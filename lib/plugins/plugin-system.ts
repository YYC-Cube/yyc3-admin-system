import type React from "react"
// 插件系统核心
export interface Plugin {
  id: string
  name: string
  version: string
  author: string
  description: string
  icon?: string
  enabled: boolean
  config?: Record<string, any>

  // 生命周期钩子
  onInstall?: () => Promise<void>
  onUninstall?: () => Promise<void>
  onEnable?: () => Promise<void>
  onDisable?: () => Promise<void>

  // 功能扩展
  routes?: Array<{
    path: string
    component: React.ComponentType
  }>
  menuItems?: Array<{
    label: string
    icon: string
    path: string
  }>
  widgets?: Array<{
    id: string
    component: React.ComponentType
    position: "dashboard" | "sidebar" | "header"
  }>
}

export class PluginManager {
  private plugins = new Map<string, Plugin>()
  private hooks = new Map<string, Array<Function>>()

  // 注册插件
  async registerPlugin(plugin: Plugin) {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`插件 ${plugin.id} 已存在`)
    }

    this.plugins.set(plugin.id, plugin)

    if (plugin.enabled && plugin.onInstall) {
      await plugin.onInstall()
    }

    console.log(`插件 ${plugin.name} 注册成功`)
  }

  // 启用插件
  async enablePlugin(pluginId: string) {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`插件 ${pluginId} 不存在`)
    }

    plugin.enabled = true
    if (plugin.onEnable) {
      await plugin.onEnable()
    }

    this.savePluginState()
  }

  // 禁用插件
  async disablePlugin(pluginId: string) {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`插件 ${pluginId} 不存在`)
    }

    plugin.enabled = false
    if (plugin.onDisable) {
      await plugin.onDisable()
    }

    this.savePluginState()
  }

  // 卸载插件
  async uninstallPlugin(pluginId: string) {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`插件 ${pluginId} 不存在`)
    }

    if (plugin.onUninstall) {
      await plugin.onUninstall()
    }

    this.plugins.delete(pluginId)
    this.savePluginState()
  }

  // 获取所有插件
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  // 获取启用的插件
  getEnabledPlugins(): Plugin[] {
    return this.getAllPlugins().filter((p) => p.enabled)
  }

  // 注册钩子
  registerHook(hookName: string, callback: Function) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, [])
    }
    this.hooks.get(hookName)!.push(callback)
  }

  // 执行钩子
  async executeHook(hookName: string, ...args: any[]) {
    const callbacks = this.hooks.get(hookName) || []
    for (const callback of callbacks) {
      await callback(...args)
    }
  }

  private savePluginState() {
    const state = Array.from(this.plugins.entries()).map(([id, plugin]) => ({
      id,
      enabled: plugin.enabled,
      config: plugin.config,
    }))
    localStorage.setItem("plugin-state", JSON.stringify(state))
  }
}

// 全局插件管理器实例
export const pluginManager = new PluginManager()
