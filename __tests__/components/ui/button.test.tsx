"use client"

import { describe, it, expect } from "@jest/globals"
import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "@/components/ui/button"
import jest from "jest" // Import jest to fix the undeclared variable error

describe("Button Component", () => {
  it("should render button text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("should handle click events", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText("Click me"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("should support disabled state", () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText("Click me")).toBeDisabled()
  })

  it("should support different variants", () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByText("Default")).toHaveClass("default") // Assuming 'default' is a class name for the default variant

    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByText("Destructive")).toHaveClass("destructive") // Assuming 'destructive' is a class name for the destructive variant
  })
})
