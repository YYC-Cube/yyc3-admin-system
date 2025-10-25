import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { LoginScreen } from "./screens/LoginScreen"
import { DashboardScreen } from "./screens/DashboardScreen"
import { ProductsScreen } from "./screens/ProductsScreen"
import { OrdersScreen } from "./screens/OrdersScreen"

const Stack = createStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: "#6366f1" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "启智KTV管理" }} />
          <Stack.Screen name="Products" component={ProductsScreen} options={{ title: "商品管理" }} />
          <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: "订单管理" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
