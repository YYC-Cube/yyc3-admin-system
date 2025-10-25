// 商品数据仓库层
import { query, transaction } from "@/lib/db/mysql"
import type { Product } from "@/lib/types"

export class ProductRepository {
  // 获取商品列表（分页）
  async findAll(params: {
    page?: number
    pageSize?: number
    category?: string
    search?: string
  }): Promise<{ data: Product[]; total: number }> {
    const { page = 1, pageSize = 10, category, search } = params
    const offset = (page - 1) * pageSize

    const whereClauses: string[] = []
    const queryParams: any[] = []

    if (category) {
      whereClauses.push("category = ?")
      queryParams.push(category)
    }

    if (search) {
      whereClauses.push("(name LIKE ? OR alias LIKE ?)")
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM products ${whereClause}`
    const countResult = await query<Array<{ total: number }>>(countSql, queryParams)
    const total = countResult[0]?.total || 0

    // 查询数据
    const dataSql = `
      SELECT * FROM products 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `
    const data = await query<Product[]>(dataSql, [...queryParams, pageSize, offset])

    return { data, total }
  }

  // 根据ID获取商品
  async findById(id: string): Promise<Product | null> {
    const sql = "SELECT * FROM products WHERE id = ?"
    const result = await query<Product[]>(sql, [id])
    return result[0] || null
  }

  // 创建商品
  async create(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const sql = `
      INSERT INTO products (
        name, alias, category, unit, original_price, price, member_price,
        stock, min_stock, image, description, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `
    const params = [
      product.name,
      product.alias || product.name,
      product.category,
      product.unit,
      product.originalPrice,
      product.price,
      product.memberPrice || product.price,
      product.stock || 0,
      product.minStock || 0,
      product.image || "",
      product.description || "",
      product.status || "active",
    ]

    const result = await query<any>(sql, params)
    return this.findById(result.insertId)!
  }

  // 更新商品
  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const fields: string[] = []
    const params: any[] = []

    if (product.name !== undefined) {
      fields.push("name = ?")
      params.push(product.name)
    }
    if (product.alias !== undefined) {
      fields.push("alias = ?")
      params.push(product.alias)
    }
    if (product.category !== undefined) {
      fields.push("category = ?")
      params.push(product.category)
    }
    if (product.price !== undefined) {
      fields.push("price = ?")
      params.push(product.price)
    }
    if (product.stock !== undefined) {
      fields.push("stock = ?")
      params.push(product.stock)
    }
    if (product.status !== undefined) {
      fields.push("status = ?")
      params.push(product.status)
    }

    if (fields.length === 0) {
      return this.findById(id)
    }

    fields.push("updated_at = NOW()")
    params.push(id)

    const sql = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`
    await query(sql, params)

    return this.findById(id)
  }

  // 删除商品
  async delete(id: string): Promise<boolean> {
    const sql = "DELETE FROM products WHERE id = ?"
    const result = await query<any>(sql, [id])
    return result.affectedRows > 0
  }

  // 批量更新库存
  async updateStock(updates: Array<{ id: string; quantity: number }>): Promise<void> {
    await transaction(async (connection) => {
      for (const update of updates) {
        await connection.execute("UPDATE products SET stock = stock + ?, updated_at = NOW() WHERE id = ?", [
          update.quantity,
          update.id,
        ])
      }
    })
  }
}

export const productRepository = new ProductRepository()
