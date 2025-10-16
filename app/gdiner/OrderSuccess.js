import { Text, View, Button, VStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Header1 from "../gdinercomponents/Header1";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import SocketContext from "../gdinercomponents/Connections/Socket";

const OrderSuccess = () => {
    const navigation = useRouter();
    const { amount, user_id, payment_id, order_id, signature } = useLocalSearchParams();
    const ctx = useContext(SocketContext);

   useEffect(() => {
    setTimeout(() => {      
    ctx.sendCommand("Payment Success", { amount, user_id, payment_id, order_id, signature });
    }, 500);
   }, []);

    return (
        <View flex={1} bg="#007367" justifyContent="center" alignItems="center"  px={4}>
           
             <VStack space={4} alignItems="center">
                {/* Large Success Tick Icon */}
                <Ionicons name="checkmark-circle" size={100} color="white" />

                {/* Success Message */}
                <Text fontSize="2xl" fontWeight="bold" color="white">
                    Order Created Successfully!
                </Text>
                <Text fontSize="md" color="white">
                    Track your order below.
                </Text>

                {/* Track Order Button */}
                <Button 
                    mt={4} 
                    bg="white" 
                    _text={{ color: "#007367", fontWeight: "bold" }} 
                    onPress={() => navigation.navigate("gdiner/History")}
                >
                    Track Your Order
                </Button>
            </VStack>
        </View>
    );
};

export default OrderSuccess;
