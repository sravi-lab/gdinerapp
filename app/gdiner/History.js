import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, FlatList, HStack, Spinner, Text, VStack, Icon, IconButton, ScrollView } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';
import SocketContext from "../gdinercomponents/Connections/Socket";
import { updateOrderData } from "../../Store/Dinerdataslice";
import { useRouter } from "expo-router";
import Header1 from "../gdinercomponents/Header1";
import BottomBar from "../gdinercomponents/BottomBar";
import OrderBox from "../gdinercomponents/OrderBox";

const History = () => {
  const orders = useSelector((state) => state.dinerdata.orders);
  const [myorders, setOrders] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const ctx = useContext(SocketContext);
  const user = useSelector((state) => state.appdata.user);
  const navigation = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.regdno) {
      dispatch(updateOrderData({ loader: false, orders: [], next: true }));
      setOrders([]);
      ctx.sendCommand("Get Orders", { user_id: user.regdno, page: 0 });
    } else {
      navigation.navigate("Home");
    }
  }, []);

  useEffect(() => {
    if (orders.data.length > 0) {
      const allOrders = [...myorders, ...orders.data];

      // Remove duplicates based on order_id
      const uniqueOrders = [...new Map(allOrders.map(order => [order.order_id, order])).values()];

      // Sort by date (latest first)
      uniqueOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

      setOrders(uniqueOrders);
    }
  }, [orders]);

  const loadMoreOrders = () => {
    if (!orders.next || loadingMore) return;
    setLoadingMore(true);
    ctx.sendCommand("Get Orders", { user_id: user.regdno, page: myorders.length / 10 });
  };
 
  return (
    <View className="flex-1 bg-gray-50">
      <Header1 title={"Order History"} />
      
      {orders.loader ? (
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" color="#007367" />
          <Text className="text-gray-500 mt-4">Loading your orders...</Text>
        </View>
      ) : (
        <View className="flex-1">
          {myorders.length === 0 ? (
            // Empty State
            <View className="flex-1 items-center justify-center px-6">
              <View className="items-center">
                <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-6">
                  <Text className="text-4xl">📋</Text>
                </View>
                <Text className="text-xl font-semibold text-gray-800 mb-2">
                  No orders yet
                </Text>
                <Text className="text-gray-500 text-center mb-6">
                  Browse our delicious menu and place your first order
                </Text>
                <Button
                  onPress={() => navigation.navigate("/gdiner")}
                  className="bg-primary-500 rounded-xl px-6 py-3"
                >
                  <Text className="text-white font-semibold">Start Ordering</Text>
                </Button>
              </View>
            </View>
          ) : (
            // Orders List
            <View className="flex-1">
              {/* Orders Header */}
              <View className="bg-white px-4 py-3 border-b border-gray-200">
                <Text className="text-lg font-semibold text-gray-800">
                  {myorders.length} {myorders.length === 1 ? 'Order' : 'Orders'}
                </Text>
              </View>

              <FlatList
                data={myorders}
                keyExtractor={(item) => item.order_id.toString()}
                renderItem={({ item }) => <OrderBox order={item} />}
                onEndReached={loadMoreOrders}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  loadingMore ? (
                    <View className="py-4 items-center">
                      <Spinner size="sm" color="#007367" />
                      <Text className="text-gray-500 text-sm mt-2">Loading more orders...</Text>
                    </View>
                  ) : null
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                className="flex-1"
              />
            </View>
          )}
        </View>
      )}
      
      <BottomBar />
    </View>
  );
};

export default History;