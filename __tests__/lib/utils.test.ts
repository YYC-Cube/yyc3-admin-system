import { describe, it, expect } from "@jest/globals"
import { cn } from "@/lib/utils"

describe("Utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("foo", "bar")).toBe("foo bar")
    })

    it("should handle conditional classes", () => {
      expect(cn("foo", false && "bar", "baz")).toBe("foo baz")
    })

    it("should handle tailwind merge", () => {
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
    })
  })
})
