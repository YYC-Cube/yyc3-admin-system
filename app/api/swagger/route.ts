import { NextResponse } from "next/server"

// Swagger API文档配置
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "启智KTV商家后台管理系统 API",
    version: "1.0.0",
    description: "完整的KTV商家后台管理系统API文档",
    contact: {
      name: "启智网络科技",
      email: "support@qizhi.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "开发环境",
    },
    {
      url: "https://api.qizhi.com",
      description: "生产环境",
    },
  ],
  tags: [
    { name: "商品管理", description: "商品相关接口" },
    { name: "订单管理", description: "订单相关接口" },
    { name: "会员管理", description: "会员相关接口" },
    { name: "仓库管理", description: "仓库相关接口" },
    { name: "报表管理", description: "报表相关接口" },
  ],
  paths: {
    "/products": {
      get: {
        tags: ["商品管理"],
        summary: "获取商品列表",
        description: "分页获取商品列表，支持筛选和搜索",
        parameters: [
          {
            name: "page",
            in: "query",
            description: "页码",
            required: false,
            schema: { type: "integer", default: 1 },
          },
          {
            name: "pageSize",
            in: "query",
            description: "每页数量",
            required: false,
            schema: { type: "integer", default: 10 },
          },
          {
            name: "categoryId",
            in: "query",
            description: "商品分类ID",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "keyword",
            in: "query",
            description: "搜索关键词",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Product" },
                        },
                        total: { type: "integer" },
                        page: { type: "integer" },
                        pageSize: { type: "integer" },
                      },
                    },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["商品管理"],
        summary: "创建商品",
        description: "创建新的商品",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Product" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["商品管理"],
        summary: "获取商品详情",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["商品管理"],
        summary: "更新商品",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "成功",
          },
        },
      },
      delete: {
        tags: ["商品管理"],
        summary: "删除商品",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "成功",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "string", description: "商品ID" },
          storeId: { type: "string", description: "门店ID" },
          name: { type: "string", description: "商品名称" },
          alias: { type: "string", description: "商品别名" },
          categoryId: { type: "string", description: "分类ID" },
          unit: { type: "string", description: "单位" },
          originalPrice: { type: "number", description: "原价" },
          price: { type: "number", description: "售价" },
          memberPrice: { type: "number", description: "会员价" },
          stock: { type: "integer", description: "库存" },
          minStock: { type: "integer", description: "最小库存" },
          image: { type: "string", description: "商品图片" },
          status: { type: "string", enum: ["active", "inactive"], description: "状态" },
          createdAt: { type: "string", format: "date-time", description: "创建时间" },
          updatedAt: { type: "string", format: "date-time", description: "更新时间" },
        },
      },
      ProductInput: {
        type: "object",
        required: ["name", "categoryId", "price"],
        properties: {
          name: { type: "string", description: "商品名称" },
          alias: { type: "string", description: "商品别名" },
          categoryId: { type: "string", description: "分类ID" },
          unit: { type: "string", description: "单位" },
          originalPrice: { type: "number", description: "原价" },
          price: { type: "number", description: "售价" },
          memberPrice: { type: "number", description: "会员价" },
          stock: { type: "integer", description: "库存" },
          minStock: { type: "integer", description: "最小库存" },
          image: { type: "string", description: "商品图片" },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
}

// GET /api/swagger - 获取Swagger文档
export async function GET() {
  return NextResponse.json(swaggerDocument)
}
