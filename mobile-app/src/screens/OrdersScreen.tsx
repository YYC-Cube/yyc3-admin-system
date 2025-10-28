"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from "react-native"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: number
  status: string
  createdAt: string
}

export default function OrdersScreen({ navigation }: any) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchOrders()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981"
      case "pending":
        return "#f59e0b"
      case "cancelled":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成"
      case "pending":
        return "待处理"
      case "cancelled":
        return "已取消"
      default:
        return status
    }
  }

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.customerName}>{item.customerName}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.amount}>¥{item.totalAmount.toFixed(2)}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString("zh-CN")}</Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>订单管理</Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无订单</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  customerName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
})
