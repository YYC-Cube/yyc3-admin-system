/**
 * @file Markdown 解析器单元测试
 * @description 覆盖表头/对齐行/内容行解析与空值处理，验证生成逻辑
 * @module parsers/markdownParser.test
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */
import { MarkdownParser } from "./markdownParser"

describe("MarkdownParser", () => {
  const parser = new MarkdownParser()

  test("parse markdown table with align line", () => {
    const input = [
      "| A | B |",
      "| --- | :---: |", // 对齐行应被跳过
      "| c | d |",
      "| e | f |",
    ].join("\n")

    const result = parser.parse(input)
    expect(result).toEqual([
      ["A", "B"],
      ["c", "d"],
      ["e", "f"],
    ])
  })

  test("parse with non-table lines returns [] (no leading '|')", () => {
    const input = [
      "A | B", // 非合法表格行（不以 | 开头）
      "something else",
    ].join("\n")
    const result = parser.parse(input)
    expect(result).toEqual([])
  })

  test("parse empty string returns []", () => {
    const result = parser.parse("")
    expect(result).toEqual([])
  })

  test("parse undefined (runtime) returns []", () => {
    const result = parser.parse(undefined as any)
    expect(result).toEqual([])
  })

  test("generate markdown with alignments", () => {
    const data = [
      ["A", "B", "C"],
      ["c1", "d1", "e1"],
      ["c2", "d2", "e2"],
    ]
    const result = parser.generate(data, ["left", "center", "right"]) // 对齐行生成

    const lines = result.split("\n")
    expect(lines[0]).toBe("| A | B | C |")
    expect(lines[1]).toBe("|:---|:---:|---:|")
    expect(lines[2]).toBe("| c1 | d1 | e1 |")
    expect(lines[3]).toBe("| c2 | d2 | e2 |")
  })
})
