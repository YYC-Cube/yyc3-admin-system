import { http, HttpResponse } from 'msw'

/**
 * MSW Request Handlers
 * Mock API endpoints for integration tests
 */

export const handlers = [
  // Products API
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const keyword = url.searchParams.get('keyword')

    let products = [
      { id: '1', name: '青岛啤酒', price: 12, category_id: '1' },
      { id: '2', name: '百威啤酒', price: 15, category_id: '1' },
      { id: '3', name: '可乐', price: 8, category_id: '2' },
    ]

    // Filter by keyword
    if (keyword) {
      products = products.filter(p => p.name.includes(keyword))
    }

    return HttpResponse.json({
      success: true,
      data: {
        data: products,
        pagination: {
          page,
          pageSize,
          total: products.length,
          totalPages: Math.ceil(products.length / pageSize),
        },
      },
    })
  }),

  http.post('/api/products', async ({ request }) => {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || !body.categoryId) {
      return HttpResponse.json({ success: false, error: '缺少必填字段' }, { status: 400 })
    }

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: `product_${Date.now()}`,
          name: body.name,
          price: body.price,
          category_id: body.categoryId,
          created_at: new Date().toISOString(),
        },
      },
      { status: 201 }
    )
  }),

  // Orders API (to be implemented)
  http.get('/api/orders', () => {
    return HttpResponse.json({
      success: true,
      data: {
        data: [],
        pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
      },
    })
  }),

  // Members API (to be implemented)
  http.get('/api/members', () => {
    return HttpResponse.json({
      success: true,
      data: {
        data: [],
        pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
      },
    })
  }),
]
