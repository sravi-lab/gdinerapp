import React, { useContext, useEffect, useState } from "react";
import { 
    Badge, Button, VStack, Box, Text, HStack, Divider, Center, Icon, Pressable, 
    Alert
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import SocketContext from "./Connections/Socket";

function CheckoutBtn() {
    const cart = useSelector((state) => state.appdata.cart) || [];
    const router = useRouter();
    const messages = useSelector((state) => state.dinerdata.messages);
    const user = useSelector((state) => state.appdata.user);
    const order_status = useSelector((state) => state.dinerdata.order_status);

    const [disablePay, setDisablePay] = useState(false);
    const [errmsg, setErrMsg] = useState('');
    
    const ctx = useContext(SocketContext);

    // Calculate total amount, tax, convenience fee, and grand total
    const totalAmount = cart.reduce((total, mess) => total + (mess.total || 0), 0);
    const tax = totalAmount * 0.05; // 5% Tax
    const convenienceFee = totalAmount > 0 ? 10 : 0; // ₹10 Convenience Fee if cart is not empty
    const grandTotal = totalAmount + tax + convenienceFee;
    
    // Count total items
    const totalItems = cart.reduce((count, mess) => count + (mess.items ? mess.items.length : 0), 0);

    const proccedToPay = () => {
        setDisablePay(true);
        ctx.sendCommand("Create Order", { cart, user_id: user.regdno, mess_type: "" });
    };

    useEffect(() => {
        if (order_status !== undefined && order_status.status === "failed") {
            const itemNames = order_status.unavailableItems.map(item => item.name).join(", ");
            setErrMsg("List of items not available: " + itemNames);
           setDisablePay(false);
        }
    }, [order_status]);

    return (
        <Box 
            p={4} 
            bg="#fff7e9" 
            shadow={2} 
            borderRadius={10} 
            mt={4} 
            width="85%" 
            marginLeft={"5%"} 
            marginBottom={5}
        >
            <VStack space={3}>
                {/* Cart Summary */}
                <HStack justifyContent="space-between">
                    <Text fontSize="sm" bold>Total Amount:</Text>
                    <Text fontSize="sm">₹{totalAmount.toFixed(2)}</Text>
                </HStack>

                <HStack justifyContent="space-between">
                    <Text fontSize="sm">Tax (5%):</Text>
                    <Text fontSize="sm">₹{tax.toFixed(2)}</Text>
                </HStack>

                <HStack justifyContent="space-between">
                    <Text fontSize="sm">Convenience Fee:</Text>
                    <Text fontSize="sm">₹{convenienceFee.toFixed(2)}</Text>
                </HStack>

                <Divider />

                <HStack justifyContent="space-between">
                    <Text fontSize="md" bold>Grand Total:</Text>
                    <Text fontSize="md" bold>₹{grandTotal.toFixed(2)}</Text>
                </HStack>
{errmsg && <Alert colorScheme={"red"}><Text>{errmsg}</Text></Alert>}
                {/* Checkout Button */}
                <Pressable >
                    <VStack>
                        <Button 
                        onPress={() => proccedToPay()}
                            disabled={disablePay}
                            borderRadius="15" 
                            w={"100%"} 
                            mx="auto" 
                            p="3" 
                            bg={disablePay ? "#ccc" : "#054f47"} 
                            _text={{ fontSize: 14 }}
                        >
                            <HStack alignItems={"center"}>
                                <Icon color="#f3e5cb" as={MaterialCommunityIcons} name="cart" size="md" />
                                <Text color="white" fontSize="md" ml={2}>Checkout</Text>
                            </HStack>
                        </Button>
                    </VStack>
                </Pressable>
            </VStack>
        </Box>
    );
}

export default CheckoutBtn;
