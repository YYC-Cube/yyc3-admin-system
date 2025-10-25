"use client"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ProductForm } from "@/components/forms/product-form"
import { jest } from "@jest/globals"

describe("ProductForm", () => {
  it("renders form fields correctly", () => {
    render(<ProductForm onSubmit={jest.fn()} />)

    expect(screen.getByLabelText(/商品名称/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/商品类型/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/优惠价/i)).toBeInTheDocument()
  })

  it("validates required fields", async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    render(<ProductForm onSubmit={onSubmit} />)

    const submitButton = screen.getByRole("button", { name: /保存/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/商品名称不能为空/i)).toBeInTheDocument()
    })

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("submits form with valid data", async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    render(<ProductForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/商品名称/i), "青岛啤酒")
    await user.type(screen.getByLabelText(/优惠价/i), "10")

    const submitButton = screen.getByRole("button", { name: /保存/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "青岛啤酒",
          price: 10,
        }),
      )
    })
  })
})
