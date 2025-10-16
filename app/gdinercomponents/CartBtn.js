import React from "react";
import { Badge, Button, VStack, Box, Center, Icon, Pressable, Text } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

function CartBtn() {
    const cart = useSelector((state) => state.appdata.cart) || [];
    const totalItems = cart.reduce((count, mess) => count + (mess.items ? mess.items.length : 0), 0);
    const router = useRouter();

    if (totalItems === 0) return null;

    return (
        <TouchableOpacity 
            onPress={() => router.navigate("/gdiner/Cart")}
            className="bg-primary-500 w-14 h-14 rounded-full items-center justify-center shadow-lg active:bg-primary-600"
        >
            {/* Badge */}
            <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                    {totalItems > 99 ? "99+" : totalItems}
                </Text>
            </View>
            
            {/* Cart Icon */}
            <MaterialCommunityIcons name="cart" size={24} color="white" />
        </TouchableOpacity>
    );
}

export default CartBtn;