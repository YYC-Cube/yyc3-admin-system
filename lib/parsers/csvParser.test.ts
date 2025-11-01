/**
 * @file CSV 解析器单元测试
 * @description 覆盖正常输入、空值与生成逻辑，确保健壮性
 * @module parsers/csvParser.test
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */
import { CSVParser } from "./csvParser"

describe("CSVParser", () => {
  const parser = new CSVParser()

  test("parse valid CSV lines", () => {
    const input = "a,b\nc,d\n \n e , f "
    const result = parser.parse(input)
    expect(result).toEqual([
      ["a", "b"],
      ["c", "d"],
      ["e", "f"],
    ])
  })

  test("parse empty string returns []", () => {
    const input = ""
    const result = parser.parse(input)
    expect(result).toEqual([])
  })

  test("parse undefined (runtime) returns []", () => {
    // 使用 any 模拟运行时传入 undefined 的场景
    const result = parser.parse(undefined as any)
    expect(result).toEqual([])
  })

  test("generate CSV from 2D array", () => {
    const data = [
      ["a", "b"],
      ["c", "d"],
    ]
    const result = parser.generate(data)
    expect(result).toBe("a,b\nc,d")
  })
})
