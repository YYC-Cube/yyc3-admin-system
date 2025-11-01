import { ErrorHandler } from "./errorHandler"
import { PARSERS } from "./parsers/config"

export const generateOutput = (format: string, data: string[][]) => {
  if (data.length === 0) return ""

  const parser = PARSERS[format as keyof typeof PARSERS]?.parser
  if (!parser) {
    ErrorHandler.handleGenerateError(format)
    return ""
  }

  try {
    return parser.generate(data)
  } catch (error) {
    ErrorHandler.handleGenerateError(format)
    return ""
  }
}
