/**
 * @file pg.ts
 * @description PostgreSQL 数据库连接层 — 自动兼容 MySQL ? 占位符语法
 * @module db
 * @author YYC³
 * @version 1.0.0
 * @created 2026-05-23
 * @updated 2026-05-23
 */

import pg from "pg"

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.PG_USER || "postgres"}:${process.env.PG_PASSWORD || ""}@${process.env.PG_HOST || "localhost"}:${process.env.PG_PORT || "5432"}/${process.env.PG_DATABASE || "yyc3_yy"}`,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

pool.on("error", (err) => {
  console.error("[PG] Unexpected pool error:", err.message)
})

function convertPlaceholders(sql: string): string {
  let index = 0
  return sql.replace(/\?/g, () => {
    index++
    return `$${index}`
  })
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const pgSql = convertPlaceholders(sql)
  const { rows } = await pool.query(pgSql, params)
  return rows as T
}

export async function transaction<T>(callback: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    await query("SELECT 1")
    return true
  } catch (error) {
    console.error("[PG] 连接失败:", error instanceof Error ? error.message : String(error))
    return false
  }
}

export async function closePool(): Promise<void> {
  await pool.end()
}

export { pool }
export type { pg }

export const db = {
  query: async function (sql: string, params?: any[]): Promise<[any[], any]> {
    const pgSql = convertPlaceholders(sql)
    const result = await pool.query(pgSql, params)
    return [result.rows, result]
  },
  transaction,
  healthCheck,
  getPool: () => pool,
  closePool,
}
