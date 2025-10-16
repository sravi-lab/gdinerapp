import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Box, VStack, HStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import SocketContext from '../gdinercomponents/Connections/Socket';
import { updateOrderData } from '../../Store/Dinerdataslice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header1 from '../gdinercomponents/Header1';
import QrcodeView from '../gdinercomponents/QrcodeView';
import DetailedMenuList from '../gdinercomponents/DetailedMenuList';
import FoodRating from '../gdinercomponents/FoodRating';
 
const OrderView = () => {
  const dispatch = useDispatch();
  const ctx = useContext(SocketContext);
  const { orderId } = useLocalSearchParams();
 
  const messages = useSelector((state) => state.dinerdata.messages);
  const order_data = useSelector((state) => state.dinerdata.order_data);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (orderId) {
      dispatch(updateOrderData({ loader: true, order: {} }));
      ctx.sendCommand('Get Order', { order_id: orderId });
    }
  }, [orderId]);

  useEffect(() => {
    if (messages.length > 0) {
      const messageObj = messages.find(p => p.message_code === '100');
      if (messageObj) setMsg(messageObj.message);
    }
  }, [messages]);

  const formatDate = (dateString) => {
    const date = new Date(dateString.replace('T', ' ').split('.')[0]);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes} ${ampm}`;
  };

  const getStatusInfo = (paymentStatus, orderStatus) => {
    if (paymentStatus === 0) return { text: 'Payment Pending', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'hourglass-top' };
    if (paymentStatus === 2) return { text: 'Payment Failed', color: 'text-red-600', bg: 'bg-red-50', icon: 'cancel' };
    
    switch (orderStatus) {
      case 4: return { text: 'Delivered', color: 'text-green-600', bg: 'bg-green-50', icon: 'check-circle' };
      case 3: return { text: 'Ready to Pick', color: 'text-purple-600', bg: 'bg-purple-50', icon: 'notifications' };
      case 2: return { text: 'Preparing', color: 'text-orange-600', bg: 'bg-orange-50', icon: 'restaurant' };
      case 1: return { text: 'Confirmed', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'check' };
      default: return { text: 'Pending', color: 'text-gray-600', bg: 'bg-gray-50', icon: 'hourglass-top' };
    }
  };

  const getStatusMessage = (paymentStatus, orderStatus) => {
    if (paymentStatus === 0) return 'Please wait for order confirmation';
    if (paymentStatus === 2) return 'Your order is cancelled';
    
    switch (orderStatus) {
      case 4: return 'Your order has been collected';
      case 3: return 'Your order is ready for pickup';
      case 2: return 'Your order is being prepared';
      case 1: return 'Your order is confirmed';
      default: return 'Waiting for confirmation';
    }
  };

  if (order_data.loader) {
    return (
      <View className="flex-1 bg-gray-50">
        <Header1 title={"Order Details"} path={"gdiner/History"} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading order details...</Text>
        </View>
      </View>
    );
  }

  const statusInfo = getStatusInfo(order_data.order.payment_status, order_data.order.order_status);
  const statusMessage = getStatusMessage(order_data.order.payment_status, order_data.order.order_status);

  return (
    <View className="flex-1 bg-gray-50">
      <Header1 title={"Order Details"} path={"gdiner/History"} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Order Status Card */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center space-x-3">
            <View className={`w-12 h-12 rounded-full ${statusInfo.bg} items-center justify-center`}>
              <MaterialIcons name={statusInfo.icon} size={24} color={statusInfo.color.replace('text-', '#')} />
            </View>
            <View className="flex-1">
              <Text className={`text-lg font-bold ${statusInfo.color}`}>
                {statusInfo.text}
              </Text>
              <Text className="text-gray-600 text-sm">
                {statusMessage}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Code Section */}
        {(order_data.order.payment_status !== 0 && 
          order_data.order.payment_status !== 2 && 
          order_data.order.order_status < 4) && (
          <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm border border-gray-100 items-center">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Show this QR code at pickup
            </Text>
            <QrcodeView size={200} order={order_data.order} />
          </View>
        )}

        {/* Delivery Message */}
        {order_data.order.payment_status === 1 && 
         order_data.order.order_type === 'delivery' && 
         order_data.order.order_status !== 4 && msg && (
          <View className="bg-yellow-50 mx-4 mt-4 rounded-xl p-4 border border-yellow-200">
            <Text className="text-yellow-800">{msg}</Text>
          </View>
        )}

        {/* Food Rating Section */}
        {order_data.order.order_status === 4 && (
          <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-primary-600 mb-3">
              Rate Your Experience
            </Text>
            <FoodRating order={{...order_data.order}} place="inside" />
            {order_data.order.review && (
              <View className="mt-3 p-3 bg-gray-50 rounded-lg">
                <Text className="text-gray-700 text-center">
                  "{order_data.order.review}"
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Order Details */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-primary-600 mb-3">
            Order Summary
          </Text>
          
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <MaterialIcons name="receipt" size={16} color="#6b7280" />
              <Text className="text-gray-600 ml-2">Token No:</Text>
            </View>
            <Text className="font-semibold text-gray-800">
              #{order_data.order.token_no}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <MaterialIcons name="access-time" size={16} color="#6b7280" />
              <Text className="text-gray-600 ml-2">Order Time:</Text>
            </View>
            <Text className="font-semibold text-gray-800">
              {formatDate(order_data.order.order_date)}
            </Text>
          </View>
          
          <DetailedMenuList items={order_data.order.Items_list} />
          
          <View className="border-t border-gray-200 pt-3 mt-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold text-gray-800">Total Amount</Text>
              <Text className="text-xl font-bold text-primary-600">
                ₹{order_data.order.total_amount}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View className="bg-white mx-4 mt-4 mb-6 rounded-xl p-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-primary-600 mb-3">
            Payment Information
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Payment Method</Text>
              <Text className="font-semibold text-gray-800">Razorpay</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Amount Paid</Text>
              <Text className="font-semibold text-gray-800">₹{order_data.order.total_amount}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Transaction ID</Text>
              <Text className="font-semibold text-gray-800" numberOfLines={1}>
                {order_data.order.payment_order_id}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Status</Text>
              <Text className={`font-semibold ${
                order_data.order.payment_status === 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {order_data.order.payment_status === 0 ? 'Failed' : 'Success'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderView;