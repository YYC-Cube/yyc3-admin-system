import { mockDB } from "@/lib/utils/storage"

describe("mockDB", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("stores and retrieves data", () => {
    const testData = { id: "1", name: "Test" }
    mockDB.set("test", testData)

    const retrieved = mockDB.get("test")
    expect(retrieved).toEqual(testData)
  })

  it("returns null for non-existent keys", () => {
    const result = mockDB.get("nonexistent")
    expect(result).toBeNull()
  })

  it("handles complex objects", () => {
    const complexData = {
      id: "1",
      nested: { value: "test" },
      array: [1, 2, 3],
    }

    mockDB.set("complex", complexData)
    const retrieved = mockDB.get("complex")

    expect(retrieved).toEqual(complexData)
  })
})
