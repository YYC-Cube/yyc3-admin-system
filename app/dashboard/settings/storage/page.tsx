"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

// 存储设置页面组件
const StorageSettingsPage: React.FC = () => {
  // 状态管理
  const [isLocalStorageEnabled, setIsLocalStorageEnabled] = useState(true);
  const [isSessionStorageEnabled, setIsSessionStorageEnabled] = useState(true);
  const [cacheSize, setCacheSize] = useState<number[]>([50]);
  const [storageQuota, setStorageQuota] = useState<number[]>([1000]);
  const [dataRetentionDays, setDataRetentionDays] = useState<number[]>([30]);
  const [selectedStorageType, setSelectedStorageType] = useState('local');
  const [customStoragePath, setCustomStoragePath] = useState('');
  const [isCacheCompressionEnabled, setIsCacheCompressionEnabled] = useState(false);
  
  // 模拟存储使用数据
  const storageUsageData = {
    total: 2048,
    used: 546,
    available: 1502,
    percentage: 26.7,
    breakdown: [
      { type: '用户数据', size: 256, percentage: 46.9 },
      { type: '缓存文件', size: 180, percentage: 33.0 },
      { type: '系统配置', size: 60, percentage: 11.0 },
      { type: '临时文件', size: 50, percentage: 9.1 }
    ]
  };

  // 处理保存设置
  const handleSaveSettings = () => {
    // 这里可以添加保存设置的逻辑
    console.log('保存存储设置');
    alert('存储设置已保存');
  };

  // 处理清除缓存
  const handleClearCache = () => {
    // 这里可以添加清除缓存的逻辑
    console.log('清除缓存');
    alert('缓存已清除');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">存储设置</h1>
        <p className="text-gray-600">管理系统的存储配置、缓存策略和数据保留设置</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        {/* 常规设置标签 */}
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="general">常规设置</TabsTrigger>
          <TabsTrigger value="usage">存储使用</TabsTrigger>
          <TabsTrigger value="advanced">高级设置</TabsTrigger>
          <TabsTrigger value="backup">备份管理</TabsTrigger>
        </TabsList>

        {/* 常规设置内容 */}
        <TabsContent value="general" className="space-y-6 animate-in fade-in-50 duration-300">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">存储配置</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base">存储类型</Label>
                <Select value={selectedStorageType} onValueChange={setSelectedStorageType}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择存储类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">本地存储</SelectItem>
                    <SelectItem value="session">会话存储</SelectItem>
                    <SelectItem value="custom">自定义路径</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedStorageType === 'custom' && (
                <div className="space-y-2">
                  <Label className="text-base">自定义存储路径</Label>
                  <Input 
                    value={customStoragePath}
                    onChange={(e) => setCustomStoragePath(e.target.value)}
                    placeholder="输入自定义存储路径"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={isLocalStorageEnabled} 
                  onCheckedChange={setIsLocalStorageEnabled}
                />
                <Label htmlFor="localStorage">启用本地存储</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={isSessionStorageEnabled} 
                  onCheckedChange={setIsSessionStorageEnabled}
                />
                <Label htmlFor="sessionStorage">启用会话存储</Label>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">缓存设置</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="cacheSize">缓存大小限制 ({cacheSize[0]}MB)</Label>
                </div>
                <Slider 
                  id="cacheSize"
                  value={cacheSize}
                  min={10}
                  max={500}
                  step={10}
                  onValueChange={setCacheSize}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={isCacheCompressionEnabled} 
                  onCheckedChange={setIsCacheCompressionEnabled}
                />
                <Label htmlFor="cacheCompression">启用缓存压缩</Label>
              </div>

              <Button 
                variant="destructive" 
                onClick={handleClearCache}
                className="mt-2"
              >
                清除缓存
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* 存储使用内容 */}
        <TabsContent value="usage" className="space-y-6 animate-in fade-in-50 duration-300">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">存储空间使用情况</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">总存储空间</span>
                  <span className="font-medium">{storageUsageData.total}MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">已使用空间</span>
                  <span className="font-medium">{storageUsageData.used}MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">可用空间</span>
                  <span className="font-medium">{storageUsageData.available}MB</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>使用百分比</span>
                  <span>{storageUsageData.percentage}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${storageUsageData.percentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">使用明细</h3>
                <div className="space-y-2">
                  {storageUsageData.breakdown.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.type}</span>
                        <span>{item.size}MB ({item.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300`}
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 高级设置内容 */}
        <TabsContent value="advanced" className="space-y-6 animate-in fade-in-50 duration-300">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">高级存储配置</h2>
            
            <div className="space-y-6">
              <Alert>
                <AlertTitle>注意</AlertTitle>
                <AlertDescription>
                  更改高级设置可能会影响系统性能和数据安全。请谨慎操作。
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="storageQuota">存储配额限制 ({storageQuota[0]}MB)</Label>
                </div>
                <Slider 
                  id="storageQuota"
                  value={storageQuota}
                  min={100}
                  max={5000}
                  step={50}
                  onValueChange={setStorageQuota}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="dataRetention">数据保留期限 ({dataRetentionDays[0]}天)</Label>
                </div>
                <Slider 
                  id="dataRetention"
                  value={dataRetentionDays}
                  min={1}
                  max={365}
                  step={1}
                  onValueChange={setDataRetentionDays}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 备份管理内容 */}
        <TabsContent value="backup" className="space-y-6 animate-in fade-in-50 duration-300">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">备份管理</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">备份设置</h3>
                
                <div className="flex items-center space-x-2">
                  <Switch id="autoBackup" />
                  <Label htmlFor="autoBackup">启用自动备份</Label>
                </div>

                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="选择备份频率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">每日备份</SelectItem>
                    <SelectItem value="weekly">每周备份</SelectItem>
                    <SelectItem value="monthly">每月备份</SelectItem>
                    <SelectItem value="manual">手动备份</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">备份历史</h3>
                
                <ScrollArea className="h-60 border rounded-lg p-4">
                  <div className="space-y-4">
                    {/* 模拟备份历史数据 */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">自动备份 - 2024-01-15</span>
                        <span className="text-sm text-green-600">完成</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">大小: 25.6MB | 时间: 14:30:22</div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">自动备份 - 2024-01-14</span>
                        <span className="text-sm text-green-600">完成</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">大小: 24.8MB | 时间: 14:30:15</div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">手动备份 - 2024-01-12</span>
                        <span className="text-sm text-green-600">完成</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">大小: 24.2MB | 时间: 09:15:33</div>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              <div className="flex space-x-2">
                <Button>立即备份</Button>
                <Button variant="secondary">恢复备份</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 保存按钮 */}
      <div className="mt-8">
        <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
          保存设置
        </Button>
      </div>
    </div>
  );
};

export default StorageSettingsPage;