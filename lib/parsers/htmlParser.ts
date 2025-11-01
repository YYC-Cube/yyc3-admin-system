import { TableParser } from "./index"

export class HTMLParser implements TableParser {
  parse(data: string): string[][] {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(data, "text/html")
      const table = doc.querySelector("table")
      if (!table) return []

      const result: string[][] = []
      const rows = table.querySelectorAll("tr")
      
      Array.from(rows).forEach(row => {
        const rowData: string[] = []
        const cells = row.querySelectorAll("td, th")
        
        Array.from(cells).forEach(cell => {
          // 处理嵌套表格
          const nestedTables = cell.querySelectorAll("table")
          if (nestedTables.length > 0) {
            rowData.push(`[Nested Table: ${nestedTables.length} levels]`)
          } else {
            rowData.push(cell.textContent?.trim() || "")
          }
        })
        
        result.push(rowData)
      })
      
      return result
    } catch (error) {
      // 移除非组件环境的 Hook 调用，改为静默失败
      return []
    }
  }

  generate(data: string[][]): string {
    if (!data.length) return ""
    
    const rows = data.map(row => {
      const cells = row.map(cell => {
        // 处理复杂结构标记
        if (cell.startsWith("[Nested Table:")) {
          return `<td><table><tr><td>${cell}</td></tr></table></td>`
        }
        return `<td>${cell}</td>`
      }).join("")
      return `<tr>${cells}</tr>`
    }).join("")
    
    return `<table border="1">${rows}</table>`
  }
}