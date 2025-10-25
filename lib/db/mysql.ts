// MySQL数据库连接配置
import mysql from "mysql2/promise"

// 数据库连接池配置
const poolConfig = {
  host: process.env.YYC3_YY_DB_HOST || "localhost",
  port: Number.parseInt(process.env.YYC3_YY_DB_PORT || "3306"),
  user: process.env.YYC3_YY_DB_USER || "root",
  password: process.env.YYC3_YY_DB_PASSWORD || "",
  database: process.env.YYC3_YY_DB_NAME || "yyc3_yy",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
}

// 创建连接池
let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(poolConfig)
  }
  return pool
}

// 执行查询
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await getPool().getConnection()
  try {
    const [rows] = await connection.execute(sql, params)
    return rows as T
  } finally {
    connection.release()
  }
}

// 执行事务
export async function transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const connection = await getPool().getConnection()
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// 数据库健康检查
export async function healthCheck(): Promise<boolean> {
  try {
    await query("SELECT 1")
    return true
  } catch (error) {
    console.error("[v0] 数据库连接失败:", error)
    return false
  }
}

// 关闭连接池
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

export const db = {
  query,
  transaction,
  healthCheck,
  getPool,
  closePool,
}
