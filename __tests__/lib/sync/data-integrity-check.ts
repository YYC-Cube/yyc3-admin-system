export function runDataIntegrityCheck(payload: any): string[] {
  const issues: string[] = []

  if (!payload.id || typeof payload.id !== 'string') {
    issues.push('缺失或无效的 ID 字段')
  }

  if (!payload.sync_timestamp || isNaN(Date.parse(payload.sync_timestamp))) {
    issues.push('缺失或无效的同步时间戳')
  }

  if (!payload.source_module) {
    issues.push('缺失来源模块标识')
  }

  return issues
}
