// 微前端配置
export const microFrontendConfig = {
  // 主应用配置
  host: {
    name: "ktv-admin-host",
    port: 3000,
    shared: {
      react: { singleton: true, requiredVersion: "^19.0.0" },
      "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
      next: { singleton: true, requiredVersion: "^15.0.0" },
    },
  },

  // 子应用配置
  remotes: [
    {
      name: "sales-app",
      url: "http://localhost:3001",
      scope: "sales",
      module: "./SalesModule",
      routes: ["/dashboard/sales/*"],
    },
    {
      name: "products-app",
      url: "http://localhost:3002",
      scope: "products",
      module: "./ProductsModule",
      routes: ["/dashboard/products/*"],
    },
    {
      name: "warehouse-app",
      url: "http://localhost:3003",
      scope: "warehouse",
      module: "./WarehouseModule",
      routes: ["/dashboard/warehouse/*"],
    },
  ],
}

// 微前端加载器
export class MicroFrontendLoader {
  private loadedApps = new Map<string, any>()
  private webpackShareScopes: any

  constructor(webpackShareScopes: any) {
    this.webpackShareScopes = webpackShareScopes
  }

  async loadRemoteApp(config: (typeof microFrontendConfig.remotes)[0]) {
    if (this.loadedApps.has(config.name)) {
      return this.loadedApps.get(config.name)
    }

    try {
      // 动态加载远程模块
      const container = await this.loadScript(config.url)
      await container.init(this.webpackShareScopes.default)
      const factory = await container.get(config.module)
      const Module = factory()

      this.loadedApps.set(config.name, Module)
      return Module
    } catch (error) {
      console.error(`加载微前端应用失败: ${config.name}`, error)
      throw error
    }
  }

  private loadScript(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = `${url}/remoteEntry.js`
      script.onload = () => {
        resolve((window as any)[url.split("//")[1].split(":")[0]])
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
}
