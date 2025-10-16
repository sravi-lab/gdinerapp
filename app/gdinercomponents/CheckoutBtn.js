import React, { useContext, useEffect, useState } from "react";
import { 
    Button, VStack, Box, Text, HStack, Divider, Alert, TouchableOpacity
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

    const proceedToPay = () => {
        setDisablePay(true);
        ctx.sendCommand("Create Order", { cart, user_id: user.regdno, mess_type: "" });
    };

    useEffect(() => {
        if (order_status !== undefined && order_status.status === "failed") {
            const itemNames = order_status.unavailableItems.map(item => item.name).join(", ");
            setErrMsg("Items not available: " + itemNames);
            setDisablePay(false);
        }
    }, [order_status]);

    return (
        <View className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            {/* Order Summary */}
            <Text className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
            </Text>
            
            <View className="space-y-3 mb-4">
                <View className="flex-row justify-between">
                    <Text className="text-gray-600">Subtotal ({totalItems} items)</Text>
                    <Text className="font-medium">₹{totalAmount.toFixed(2)}</Text>
                </View>

                <View className="flex-row justify-between">
                    <Text className="text-gray-600">Tax (5%)</Text>
                    <Text className="font-medium">₹{tax.toFixed(2)}</Text>
                </View>

                <View className="flex-row justify-between">
                    <Text className="text-gray-600">Convenience Fee</Text>
                    <Text className="font-medium">₹{convenienceFee.toFixed(2)}</Text>
                </View>

                <View className="border-t border-gray-200 pt-3">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-bold text-gray-800">Total</Text>
                        <Text className="text-xl font-bold text-primary-600">
                            ₹{grandTotal.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Error Message */}
            {errmsg && (
                <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <Text className="text-red-600 text-sm">{errmsg}</Text>
                </View>
            )}

            {/* Checkout Button */}
            <TouchableOpacity
                onPress={proceedToPay}
                disabled={disablePay || totalAmount === 0}
                className={`py-4 rounded-xl flex-row items-center justify-center space-x-2 ${
                    disablePay || totalAmount === 0 
                        ? 'bg-gray-300' 
                        : 'bg-primary-500 active:bg-primary-600'
                }`}
            >
                <MaterialCommunityIcons 
                    name="cart-check" 
                    size={20} 
                    color={disablePay || totalAmount === 0 ? "#9ca3af" : "white"} 
                />
                <Text className={`text-lg font-semibold ${
                    disablePay || totalAmount === 0 ? 'text-gray-500' : 'text-white'
                }`}>
                    {disablePay ? 'Processing...' : 'Proceed to Payment'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default CheckoutBtn;