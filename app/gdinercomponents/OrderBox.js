import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Text, VStack, HStack, Icon, View } from 'native-base';
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
      params: { orderId: order_id },
    });
  };

  const formatDate = (date) => {
    if (!date) return "Invalid Date";
    
    const formattedDate = date.replace("T", " ").split(".")[0];
    const dateObj = new Date(formattedDate);
    if (isNaN(dateObj)) return "Invalid Date";
    
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };
        
  const getPaymentStatus = (status) => {
    switch (status) {
      case 0: return { text: "Payment Pending", color: "text-yellow-600", bg: "bg-yellow-50" };
      case 1: return { text: "Payment Success", color: "text-green-600", bg: "bg-green-50" };
      case 2: return { text: "Payment Failed", color: "text-red-600", bg: "bg-red-50" };
      default: return { text: "Unknown Status", color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const getOrderStatus = (status) => {
    switch (status) {
      case 1: return { text: "Order Confirmed", color: "text-blue-600", bg: "bg-blue-50" };
      case 2: return { text: "Preparing", color: "text-orange-600", bg: "bg-orange-50" };
      case 3: return { text: "Ready to Pick", color: "text-purple-600", bg: "bg-purple-50" };
      case 4: return { text: "Delivered", color: "text-green-600", bg: "bg-green-50" };
      case 5: return { text: "Cancelled", color: "text-red-600", bg: "bg-red-50" };
      default: return { text: "Unknown Status", color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const paymentStatusInfo = getPaymentStatus(order.payment_status);
  const orderStatusInfo = getOrderStatus(order.order_status);

  return (
    <TouchableOpacity 
      onPress={() => openOrder(order.payment_order_id)}
      className="mx-4 mb-3"
    >
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold text-primary-600" numberOfLines={1}>
            {order.mess_name}
          </Text>
          <Text className="text-2xl font-bold text-gray-800">
            ₹{order.total_amount}
          </Text>
        </View>

        {/* Token Number (if payment successful) */}
        {order.payment_status === 1 && (
          <View className="bg-primary-50 rounded-lg p-2 mb-3">
            <Text className="text-primary-600 font-semibold text-center">
              Token No: #{order.token_no}
            </Text>
          </View>
        )}

        {/* Date and Time */}
        <View className="flex-row items-center mb-3">
          <MaterialIcons name="access-time" size={16} color="#6b7280" />
          <Text className="text-gray-600 ml-2 text-sm">
            {formatDate(order.order_date)}
          </Text>
        </View>

        {/* Status Badges */}
        <View className="flex-row space-x-2 mb-3">
          {order.payment_status === 1 ? (
            <View className={`px-3 py-1 rounded-full ${orderStatusInfo.bg}`}>
              <Text className={`text-xs font-medium ${orderStatusInfo.color}`}>
                {orderStatusInfo.text}
              </Text>
            </View>
          ) : (
            <View className={`px-3 py-1 rounded-full ${paymentStatusInfo.bg}`}>
              <Text className={`text-xs font-medium ${paymentStatusInfo.color}`}>
                {paymentStatusInfo.text}
              </Text>
            </View>
          )}
        </View>

        {/* Rating Section for Delivered Orders */}
        {order.order_status === 4 && (
          <View className="border-t border-gray-100 pt-3">
            <FoodRating order={order} place="outside" />
          </View>
        )}

        {/* Arrow Indicator */}
        <View className="absolute right-4 top-1/2 -mt-3">
          <MaterialIcons name="chevron-right" size={24} color="#d1d5db" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderBox;