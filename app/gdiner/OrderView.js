import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { Icon, Box, VStack, HStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
//  import BarcodeView from '../components/BarcodeView';
// import QrcodeView from '../components/QrCodeView';
// import DetailedMenuList from '../components/DetailedMenuList';
// import Loader from '../components/Loader';
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
    const [barcodeView, setBarcodeView] = useState(false);
    const { orderId } = useLocalSearchParams();
 
     const messages = useSelector((state) => state.dinerdata.messages);
    const order_data = useSelector((state) => state.dinerdata.order_data);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (orderId) {
            dispatch(updateOrderData({ loader: true, order: {} })); // Show loader before fetching order
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
      return (
        <View flex={1} backgroundColor="white">
          <Header1 title={"Order Details"} path={"gdiner/History"}/>
            {order_data.loader ? (
                <Text>Loading...</Text>
            ) : (
                <ScrollView>
                    {/* <BarcodeView order={order_data.order} open={barcodeView} setBarcodeView={setBarcodeView} /> */}
                    <VStack p={4}>
                        {/* Order Status Box */}
                        <Box p={4} borderRadius={8} shadow={2} bg="gray.100">
                            <HStack alignItems="center" space={3}>
                                <Icon as={MaterialIcons} name={
                                    order_data.order.payment_status === 0 || order_data.order.payment_status === 2
                                        ? 'cancel'
                                        : order_data.order.order_status === 4
                                            ? 'check-circle'
                                            : 'hourglass-top'
                                } size={10} color={
                                    order_data.order.payment_status === 0 || order_data.order.payment_status === 2
                                        ? 'red.500'
                                        : order_data.order.order_status === 4
                                            ? 'green.500'
                                            : 'yellow.500'
                                } />
                                <VStack>
                                    <Text  style={styles.mainhead} bold>{
                                        order_data.order.payment_status === 0 ? 'Payment Pending' :
                                            order_data.order.payment_status === 2 ? 'Payment Failed' :
                                                order_data.order.order_status === 4 ? 'Delivered' :
                                                    order_data.order.order_status === 3 ? 'Ready to Pick' :
                                                        order_data.order.order_status === 2 ? 'Preparing' :
                                                            order_data.order.order_status === 1 ? 'Confirmed' : 'Pending'
                                    }</Text>
                                    <Text>{
                                        order_data.order.payment_status === 0 ? 'Please wait for order confirmation' :
                                            order_data.order.payment_status === 2 ? 'Your order is cancelled' :
                                                order_data.order.order_status === 4 ? 'Your order has been collected' :
                                                    order_data.order.order_status === 3 ? 'Your order is ready for pickup' :
                                                        order_data.order.order_status === 2 ? 'Your order is being prepared' :
                                                            order_data.order.order_status === 1 ? 'Your order is confirmed' : 'Waiting for confirmation'
                                    }</Text>
                                </VStack>
                                
                            </HStack>
                        </Box>

                        {/* QR Code View */}
                        {(order_data.order.payment_status !== 0 && order_data.order.payment_status !== 2 && order_data.order.order_status <4) && (
                            <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 ,padding:40,backgroundColor:"#fff",borderRadius:10,elevation:2}} >
                                <QrcodeView size={250} order={order_data.order} />
                            </View>
                        )}

                        {/* Delivery Message */}
                        {order_data.order.payment_status === 1 && order_data.order.order_type === 'delivery' && order_data.order.order_status !== 4 && (
                            <Box p={4} bg="yellow.100" borderRadius={8}>
                                <Text>{msg}</Text>
                            </Box>
                        )}
                        {(order_data.order.order_status == 4  ) && <Box p={4} mt={4} borderRadius={8} shadow={1}  bg="#FFFAF3">
                       <Text style={styles.boxhead}>Food Rating</Text>
                      <FoodRating order={{...order_data.order}} place="inside"/>
                       <Text style={styles.review}>{order_data.order.review}</Text>
                      </Box>}


                        {/* Order Details */}
                        <Box p={4} mt={4} borderRadius={8} shadow={1}  bg="#FFFAF3">
                            <Text style={styles.boxhead}>Detailed Bill</Text>
                            <HStack justifyContent="space-between" mt={2}>
                                <Text style={styles.boxhead1}>Token No: #{order_data.order.token_no}</Text>
                                <Text style={styles.boxhead1}><Icon as={MaterialIcons} name="access-time" size={4} /> {formatDate(order_data.order.order_date)}</Text>
                            </HStack>
                            <DetailedMenuList items={order_data.order.Items_list} />
                            <HStack justifyContent="space-between" mt={2} paddingX={2}>
                                <Text bold>Order Amount</Text>
                                <Text >₹ {order_data.order.total_amount}</Text>
                            </HStack>
                        </Box>

                        {/* Payment Info */}
                        <Box p={4} mt={4} borderRadius={8} shadow={1} bg="#FFFAF3">
                            <Text style={styles.boxhead}>Payment Info</Text>
                            <HStack justifyContent="space-between" mt={2}><Text>Paid Via</Text><Text bold>Razor Pay</Text></HStack>
                            <HStack justifyContent="space-between" mt={2}><Text>Amount</Text><Text>₹ {order_data.order.total_amount}</Text></HStack>
                            <HStack justifyContent="space-between" mt={2}><Text>Trans ID</Text><Text>{order_data.order.payment_order_id}</Text></HStack>
                            <HStack justifyContent="space-between" mt={2}><Text>Status</Text>
                                <Text bold color={order_data.order.payment_status === 0 ? "red.500" : "green.500"}>
                                    {order_data.order.payment_status === 0 ? 'Failed' : 'Success'}
                                </Text>
                            </HStack>
                        </Box>
                    </VStack>
                </ScrollView>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    mess_name: {
        fontSize: 17,
        fontWeight: "bold",
        textTransform: "capitalize",
        color: "#007367",
    },
    boxhead:{
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "capitalize",
        color: "#007367",
    },
    mainhead:{
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "capitalize",
        color: "#007367",
    },
    boxhead1:{
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "capitalize",
        color: "#007367",
        flex:1,
        alignItems:"center",
        paddingBottom:10,
        paddingTop:5
    },
    review:{
        fontSize: 14,
        fontWeight: "600",
        textAlign:"center",
       
        
    }
});
export default OrderView;
