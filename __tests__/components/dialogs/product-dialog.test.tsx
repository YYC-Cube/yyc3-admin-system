import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ProductDialog } from "@/components/dialogs/product-dialog"
import { jest } from "@jest/globals"

describe("ProductDialog", () => {
  const mockOnSuccess = jest.fn()
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("应该渲染新增商品对话框", () => {
    render(<ProductDialog open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />)

    expect(screen.getByText("新增商品")).toBeInTheDocument()
    expect(screen.getByLabelText("商品名称")).toBeInTheDocument()
  })

  it("应该渲染编辑商品对话框", () => {
    const product = {
      id: "1",
      name: "青岛啤酒",
      price: 10,
      category: "啤酒",
    }

    render(<ProductDialog open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} product={product} />)

    expect(screen.getByText("编辑商品")).toBeInTheDocument()
    expect(screen.getByDisplayValue("青岛啤酒")).toBeInTheDocument()
  })

  it("应该验证表单输入", async () => {
    render(<ProductDialog open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />)

    const submitButton = screen.getByText("保存")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/商品名称不能为空/i)).toBeInTheDocument()
    })
  })

  it("应该提交有效的表单数据", async () => {
    render(<ProductDialog open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />)

    fireEvent.change(screen.getByLabelText("商品名称"), {
      target: { value: "新商品" },
    })
    fireEvent.change(screen.getByLabelText("价格"), {
      target: { value: "15" },
    })

    const submitButton = screen.getByText("保存")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
})
