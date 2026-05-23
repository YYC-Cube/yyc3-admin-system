/**
 * @file index.ts
 * @description 数据库统一导出层 — PostgreSQL
 * @module db
 * @author YYC³
 * @version 1.0.0
 * @created 2026-05-23
 */

export { query, transaction, healthCheck, closePool, pool, db } from "./pg"
