import { JSONParser } from "./jsonParser"

describe("JSONParser", () => {
  const parser = new JSONParser()

  test("parse valid JSON array", () => {
    const input = '[["a","b"],["c","d"]]'
    const result = parser.parse(input)
    expect(result).toEqual([["a","b"],["c","d"]])
  })

  test("parse invalid JSON", () => {
    const input = "invalid json"
    const result = parser.parse(input)
    expect(result).toEqual([])
  })

  test("generate JSON from 2D array", () => {
    const input = [["a","b"],["c","d"]]
    const result = parser.generate(input)
    expect(result).toBe('[\n  [\n    "a",\n    "b"\n  ],\n  [\n    "c",\n    "d"\n  ]\n]')
  })
})