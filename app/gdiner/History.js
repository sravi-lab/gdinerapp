import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
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
       <Box  flex={1} >
           <Header1 title={"Order History"} />
           {orders.loader ? (
             <Box flex={1} p={4} h={"80%"}>
               <Spinner size="lg" />
               </Box>
           ) : (
               <Box flex={1} p={4} h={"80%"}>
                   {myorders.length === 0 ? (
                       <VStack flex={1} justifyContent="center" alignItems="center">
                           <Text fontSize="lg" bold>No orders placed</Text>
                           <Text textAlign="center">Browse food items and add them to your cart.</Text>
                            
                       </VStack>
                   ) : (
                       <FlatList
                           data={myorders}
                           keyExtractor={(item) => item.order_id.toString()}
                           renderItem={({ item }) => <OrderBox order={item} />}
                           onEndReached={loadMoreOrders}
                           onEndReachedThreshold={0.5}
                           ListFooterComponent={loadingMore ? <Spinner size="lg" /> : null}
                           showsVerticalScrollIndicator={false}
                           contentContainerStyle={{ paddingBottom:5 }} // Adjust padding for smooth scrolling
                       />
                   )}
               </Box>
           )}
           <BottomBar />
       </Box>
   );
};

export default History;
