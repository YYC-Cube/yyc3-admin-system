"use client"

// 移动端仪表盘页面
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { api } from "../services/api"

export function DashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    activeMembers: 0,
    lowStock: 0,
  })
  const [refreshing, setRefreshing] = useState(false)

  const loadStats = async () => {
    try {
      const response = await api.get("/dashboard/stats")
      setStats(response.data)
    } catch (error) {
      console.error("加载统计数据失败:", error)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadStats()
    setRefreshing(false)
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>¥{stats.todaySales.toFixed(2)}</Text>
          <Text style={styles.statLabel}>今日销售额</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.todayOrders}</Text>
          <Text style={styles.statLabel}>今日订单</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeMembers}</Text>
          <Text style={styles.statLabel}>活跃会员</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.lowStock}</Text>
          <Text style={styles.statLabel}>库存预警</Text>
        </View>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Orders")}>
          <Text style={styles.menuIcon}>📋</Text>
          <Text style={styles.menuLabel}>订单管理</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Products")}>
          <Text style={styles.menuIcon}>📦</Text>
          <Text style={styles.menuLabel}>商品管理</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>👥</Text>
          <Text style={styles.menuLabel}>会员管理</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuLabel}>报表中心</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  menuItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
})
