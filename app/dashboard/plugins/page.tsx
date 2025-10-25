"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { pluginManager, type Plugin } from "@/lib/plugins/plugin-system"
import { Download, Settings, Trash2, Package } from "lucide-react"

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlugins()
  }, [])

  const loadPlugins = async () => {
    setLoading(true)
    try {
      const allPlugins = pluginManager.getAllPlugins()
      setPlugins(allPlugins)
    } catch (error) {
      console.error("加载插件失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePlugin = async (pluginId: string, enabled: boolean) => {
    try {
      if (enabled) {
        await pluginManager.enablePlugin(pluginId)
      } else {
        await pluginManager.disablePlugin(pluginId)
      }
      loadPlugins()
    } catch (error) {
      console.error("切换插件状态失败:", error)
    }
  }

  const handleUninstallPlugin = async (pluginId: string) => {
    if (confirm("确定要卸载此插件吗？")) {
      try {
        await pluginManager.uninstallPlugin(pluginId)
        loadPlugins()
      } catch (error) {
        console.error("卸载插件失败:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">插件市场</h1>
          <p className="mt-2 text-gray-600">扩展系统功能，安装和管理插件</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          浏览插件市场
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plugins.map((plugin, index) => (
          <motion.div
            key={plugin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                    {plugin.icon ? (
                      <span className="text-2xl">{plugin.icon}</span>
                    ) : (
                      <Package className="h-6 w-6 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{plugin.name}</h3>
                    <p className="text-sm text-gray-500">v{plugin.version}</p>
                  </div>
                </div>
                <Switch
                  checked={plugin.enabled}
                  onCheckedChange={(checked) => handleTogglePlugin(plugin.id, checked)}
                />
              </div>

              <p className="mt-4 text-sm text-gray-600">{plugin.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <Badge variant={plugin.enabled ? "default" : "secondary"}>{plugin.enabled ? "已启用" : "已禁用"}</Badge>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleUninstallPlugin(plugin.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {plugins.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">暂无已安装插件</h3>
          <p className="mt-2 text-gray-500">浏览插件市场，安装您需要的功能扩展</p>
          <Button className="mt-4">
            <Download className="mr-2 h-4 w-4" />
            浏览插件市场
          </Button>
        </div>
      )}
    </div>
  )
}
