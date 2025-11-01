import { CSVParser } from "./csvParser"
import { HTMLParser } from "./htmlParser"
import { JSONParser } from "./jsonParser"
import { MarkdownParser } from "./markdownParser"

export const PARSERS = {
  html: {
    parser: new HTMLParser(),
    mimeType: "text/html",
    extension: "html"
  },
  csv: {
    parser: new CSVParser(),
    mimeType: "text/csv",
    extension: "csv"
  },
  json: {
    parser: new JSONParser(),
    mimeType: "application/json",
    extension: "json"
  },
  markdown: {
    parser: new MarkdownParser(),
    mimeType: "text/markdown",
    extension: "md"
  }
}

export type ParserConfig = typeof PARSERS
