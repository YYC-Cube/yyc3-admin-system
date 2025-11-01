import { TableParser } from "./index"

export class CSVParser implements TableParser {
  // 移除在类中使用 Hook 的字段
  parse(data: string): string[][] {
    try {
      // 防御性编程：data 为空或非字符串时返回空数组
      if (typeof data !== "string" || data.length === 0) return []
      const lines = data.split("\n").filter((line) => line.trim())
      return lines.map((line) => line.split(",").map((cell) => cell.trim()))
    } catch (error) {
      // 移除非组件环境的 Hook 调用，改为静默失败
      return []
    }
  }

  generate(data: string[][]): string {
    return data.map((row) => row.join(",")).join("\n")
  }
}
