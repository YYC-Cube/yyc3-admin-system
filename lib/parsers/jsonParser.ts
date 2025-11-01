import { TableParser } from "./index"

export class JSONParser implements TableParser {
  parse(data: string): string[][] {
    try {
      const jsonData = JSON.parse(data)
      if (!Array.isArray(jsonData)) {
        throw new Error("Invalid JSON format: expected array of arrays")
      }
      return jsonData.map(row => {
        if (!Array.isArray(row)) {
          return [String(row)]
        }
        return row.map(cell => String(cell))
      })
    } catch (error) {
      // 移除非组件环境的 Hook 调用，改为静默失败
      return []
    }
  }

  generate(data: string[][]): string {
    return JSON.stringify(data, null, 2)
  }
}