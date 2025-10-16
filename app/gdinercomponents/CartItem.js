import { Box, Button, HStack, Image, Text, View, VStack } from "native-base"
import { Alert, StyleSheet } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AddToCartButton1 from "./AddToCartButton1";

const CartItem = ({ item, mess_code, mess_name }) => {
  return (
    <View className="flex-row bg-white rounded-xl mb-3 overflow-hidden border border-gray-100 shadow-sm">
      {/* Veg/Non-veg indicator */}
      <View className="absolute top-2 left-2 z-10 bg-white rounded-full p-1">
        <MaterialCommunityIcons 
          color={item.type === 'veg' ? "#22c55e" : "#ef4444"} 
          name="square-circle" 
          size={16}   
        />
      </View>

      {/* Item Image */}
      <Image 
        source={{ uri: item.image }} 
        alt={item.name} 
        className="w-24 h-24"
        resizeMode="cover"
      />

      {/* Item Details */}
      <View className="flex-1 p-3 justify-between">
        <View>
          <Text className="text-sm font-bold text-gray-800 mb-1" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="text-xs text-gray-500 capitalize">
            {item.category_name}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-lg font-bold text-primary-600">
            ₹{item.price}
          </Text>
          <AddToCartButton1 
            item={item} 
            selected_mess_code={mess_code} 
            selected_mess_name={mess_name}
          />
        </View>
      </View>
    </View>
  );
};

export default CartItem;