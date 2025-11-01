// 解析器接口定义
export interface TableParser {
  parse(data: string): string[][]
  generate(data: string[][]): string
}

// 解析器类型
export type ParserType = 'csv' | 'html' | 'json' | 'markdown' | 'sql' | 'yaml' | 'xml' | 'ascii'