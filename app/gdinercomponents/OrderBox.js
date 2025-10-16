import React from 'react';
import { FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { Box, Text, VStack, HStack, Icon, View, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { updateOrderData } from "../../Store/Dinerdataslice";
import FoodRating from './FoodRating';

const OrderBox = ({ order }) => {
    const dispatch = useDispatch();
    const navigation = useRouter();

    const openOrder = (order_id) => {
        dispatch(updateOrderData({ loader: true, order: {} }));
        navigation.push({
            pathname: "/gdiner/OrderView",
            params: { orderId:order_id },
        });        };

        const formatDate = (date) => {
            if (!date) return "Invalid Date"; // Handle null/undefined values
        
            // Replace "T" with space and remove milliseconds if present
            const formattedDate = date.replace("T", " ").split(".")[0];
   
            const dateObj = new Date(formattedDate);
            if (isNaN(dateObj)) return "Invalid Date"; // Handle incorrect date formats
        
            // Extract date components
            const day = dateObj.getDate();
            const month = dateObj.getMonth() + 1;
            const year = dateObj.getFullYear();
        
            // Extract time components
            let hours = dateObj.getHours();
            const minutes = dateObj.getMinutes().toString().padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
        
            return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
        };
        
    const getPaymentStatus = (status) => {
        switch (status) {
            case 0:
                return "Payment Pending";
            case 1:
                return "Payment Success";
            case 2:
                return "Payment Failed";
            default:
                return "Unknown Status";
        }
    };

    const getOrderStatus = (status) => {
        switch (status) {
            case 1:
                return "Order Confirmed";
            case 2:
                return "Order Preparing";
            case 3:
                return "Ready to Pick";
            case 4:
                return "Delivered";
            case 5:
                return "Order Canceled";
            default:
                return "Unknown Status";
        }
    };

    return (
        <Pressable onPress={() => openOrder(order.payment_order_id)}>
            <Box bg="white" shadow={1} rounded="md" p={3} mx={1} mb={3}>
                <HStack justifyContent="space-between" alignItems="center">
                    <VStack space={2} w={"80%"}>
                        <Text style={styles.mess_name}>{order.mess_name}</Text>
                        {order.payment_status === 1 && (
                            <Text style={styles.token}>Token No: #{order.token_no}</Text>
                        )}

                        <HStack alignItems={"center"}>
                            <Icon as={MaterialIcons} name="access-time" size={4} style={styles.date} />
                            <Text style={styles.date}> {formatDate(order.order_date)}</Text>
                        </HStack>

                        {order.payment_status === 1 ? (
                            <Text style={styles.paymentsuccess}>Order Status: {getOrderStatus(order.order_status)}</Text>
                        ) : (
                            <Text color={"#007367"} fontWeight={"700"}>
                                Status: <Text style={styles.paymentfail}>{getPaymentStatus(order.payment_status)}</Text>
                            </Text>
                        )}
                       
                    </VStack>

                  <View alignItems={"center"}  justifyContent={"center"}>
                        <Text style={styles.amount}>₹{order.total_amount}</Text>
                    </View> 
                </HStack>
                {order.order_status === 4 &&   <View mt={2}>
                <FoodRating order={order} place="outside"/>
                </View>}
            </Box>
        </Pressable>
    );
};

 

const styles = StyleSheet.create({
    mess_name: {
        fontSize: 17,
        fontWeight: "bold",
        textTransform: "capitalize",
        color: "#007367",
    },
    token: {
        fontSize: 14,
        color: "#007367",
    },
    amount: {
        fontSize: 30,
        fontWeight: "700",
        color: "#A58255",
        paddingTop: 10,
        paddingRight: 10,
    },
    date: {
        fontSize: 14,
        color: "#007367",
        fontWeight: "700",
    },
    paymentfail: {
        color: "#C42B2B",
        fontWeight: "700",
    },
    noOrders: {
        fontSize: 16,
        color: "#A58255",
        textAlign: "center",
        marginTop: 20,
    },
    paymentsuccess:{fontWeight:"700",color:"#a58255"}
});
 
export default OrderBox;
