// 多门店数据同步服务

import { type SyncRecord, SyncDataType, SyncStatus, type Product, type Member } from "@/lib/types"
import { mockDB } from "@/lib/utils/storage"

// 创建同步任务
export async function createSyncTask(
  sourceStoreId: string,
  targetStoreId: string,
  dataType: SyncDataType,
  dataId: string,
): Promise<SyncRecord> {
  const syncRecord: SyncRecord = {
    id: `SYNC${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    sourceStoreId,
    targetStoreId,
    dataType,
    dataId,
    status: SyncStatus.PENDING,
    createdAt: new Date().toISOString(),
  }

  const syncRecords = mockDB.get<SyncRecord>("syncRecords") || []
  syncRecords.push(syncRecord)
  mockDB.set("syncRecords", syncRecords)

  // 异步执行同步
  executeSyncTask(syncRecord.id)

  return syncRecord
}

// 执行同步任务
async function executeSyncTask(syncId: string) {
  const syncRecords = mockDB.get<SyncRecord>("syncRecords") || []
  const syncRecord = syncRecords.find((s) => s.id === syncId)

  if (!syncRecord) return

  try {
    // 更新状态为同步中
    syncRecord.status = SyncStatus.SYNCING
    mockDB.set("syncRecords", syncRecords)

    // 根据数据类型执行同步
    switch (syncRecord.dataType) {
      case SyncDataType.PRODUCT:
        await syncProduct(syncRecord)
        break
      case SyncDataType.MEMBER:
        await syncMember(syncRecord)
        break
      default:
        throw new Error(`Unsupported data type: ${syncRecord.dataType}`)
    }

    // 更新状态为成功
    syncRecord.status = SyncStatus.SUCCESS
    syncRecord.completedAt = new Date().toISOString()
  } catch (error: any) {
    // 更新状态为失败
    syncRecord.status = SyncStatus.FAILED
    syncRecord.error = error.message
    syncRecord.completedAt = new Date().toISOString()
  }

  mockDB.set("syncRecords", syncRecords)
}

// 同步商品数据
async function syncProduct(syncRecord: SyncRecord) {
  const products = mockDB.get<Product>("products") || []
  const sourceProduct = products.find((p) => p.id === syncRecord.dataId && p.storeId === syncRecord.sourceStoreId)

  if (!sourceProduct) {
    throw new Error("Source product not found")
  }

  // 创建目标门店的商品副本
  const targetProduct: Product = {
    ...sourceProduct,
    id: `PROD${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    storeId: syncRecord.targetStoreId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  products.push(targetProduct)
  mockDB.set("products", products)
}

// 同步会员数据
async function syncMember(syncRecord: SyncRecord) {
  const members = mockDB.get<Member>("members") || []
  const sourceMember = members.find((m) => m.id === syncRecord.dataId && m.storeId === syncRecord.sourceStoreId)

  if (!sourceMember) {
    throw new Error("Source member not found")
  }

  // 检查目标门店是否已存在该会员
  const existingMember = members.find((m) => m.phone === sourceMember.phone && m.storeId === syncRecord.targetStoreId)

  if (existingMember) {
    // 更新现有会员信息
    Object.assign(existingMember, {
      ...sourceMember,
      id: existingMember.id,
      storeId: syncRecord.targetStoreId,
      updatedAt: new Date().toISOString(),
    })
  } else {
    // 创建新会员
    const targetMember: Member = {
      ...sourceMember,
      id: `MEM${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      storeId: syncRecord.targetStoreId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    members.push(targetMember)
  }

  mockDB.set("members", members)
}

// 批量同步数据
export async function batchSync(
  sourceStoreId: string,
  targetStoreIds: string[],
  dataType: SyncDataType,
  dataIds: string[],
): Promise<SyncRecord[]> {
  const syncRecords: SyncRecord[] = []

  for (const targetStoreId of targetStoreIds) {
    for (const dataId of dataIds) {
      const record = await createSyncTask(sourceStoreId, targetStoreId, dataType, dataId)
      syncRecords.push(record)
    }
  }

  return syncRecords
}

// 获取同步记录
export async function getSyncRecords(filters?: {
  sourceStoreId?: string
  targetStoreId?: string
  status?: SyncStatus
}): Promise<SyncRecord[]> {
  const syncRecords = mockDB.get<SyncRecord>("syncRecords") || []

  return syncRecords.filter((record) => {
    if (filters?.sourceStoreId && record.sourceStoreId !== filters.sourceStoreId) return false
    if (filters?.targetStoreId && record.targetStoreId !== filters.targetStoreId) return false
    if (filters?.status && record.status !== filters.status) return false
    return true
  })
}
