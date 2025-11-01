import { TableParser } from "./index"

export class MarkdownParser implements TableParser {
  // 移除在类中使用 Hook 的字段

  parse(data: string): string[][] {
    try {
      // 防御性编程：data 为空或非字符串时返回空数组
      if (typeof data !== "string" || data.length === 0) return []
      const lines = data.split('\n').filter(line => line.trim().startsWith('|'))
      if (lines.length < 2) return []

      const result: string[][] = []
      
      // 处理表头
      const headerLine = lines[0]
      const headers = this.parseLine(headerLine)
      result.push(headers)

      // 处理表格内容（跳过对齐行）
      for (let i = 1; i < lines.length; i++) {
        const curr = lines[i]
        if (this.isAlignmentRow(curr)) continue
        const row = this.parseLine(curr)
        result.push(row)
      }

      return result
    } catch (error) {
      // 移除非组件环境的 Hook 调用，改为静默失败
      return []
    }
  }

  private parseLine(line: string): string[] {
    return line
      .split('|')
      .slice(1, -1) // 移除首尾空元素
      .map(cell => cell.trim())
  }

  // 新增：判断是否为对齐行。例如 "| --- | :---: | ---: |"
  private isAlignmentRow(line: string): boolean {
    const cells = line
      .split('|')
      .slice(1, -1)
      .map(cell => cell.trim())
    if (cells.length === 0) return false
    return cells.every(cell => /^:?-{3,}:?$/.test(cell))
  }

  generate(data: string[][], alignments: ('left'|'center'|'right')[] = []): string {
    if (!data.length) return ""

    // 生成表头
    const headerLine = `| ${data[0].join(' | ')} |`
    
    // 生成对齐行
    const alignLine = '|' + data[0].map((_, i) => {
      const align = alignments[i] || 'left'
      switch (align) {
        case 'left': return ':---'
        case 'right': return '---:'
        case 'center': return ':---:'
        default: return '---'
      }
    }).join('|') + '|'

    // 生成内容行
    const contentLines = data.slice(1).map(row => 
      `| ${row.join(' | ')} |`
    ).join('\n')

    return [headerLine, alignLine, contentLines].join('\n')
  }
}