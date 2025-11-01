"use client"

import { ErrorHandler } from "@/lib/errorHandler"
import { PARSERS } from "@/lib/parsers/config"

export const useTableParsers = () => {
  const parseInputData = (data: string, format: string): string[][] => {
    try {
      const parser = PARSERS[format as keyof typeof PARSERS]?.parser
      if (!parser) {
        ErrorHandler.handleParseError(format)
        return []
      }
      // 防御性编程：确保传入解析器的数据为字符串
      const safeData = typeof data === "string" ? data : ""
      return parser.parse(safeData)
    } catch (error) {
      ErrorHandler.handleParseError(format)
      return []
    }
  }

  return { parseInputData }
}
