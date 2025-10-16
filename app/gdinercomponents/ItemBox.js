import { Box, Button, HStack, Image, Text, View, VStack } from "native-base"
import { StyleSheet, TouchableOpacity } from "react-native";
import AddToCartButton from "./AddToCartButton";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ItemBox = ({ item }) => {
  return (
    <View className="w-[48%] mb-4">
      <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        {/* Veg/Non-veg indicator */}
        <View className="absolute top-3 right-3 z-10 bg-white rounded-full p-1">
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
          className="w-full h-36"
          resizeMode="cover"
        />

        {/* Item Details */}
        <View className="p-3">
          <Text className="text-sm font-bold text-gray-800 mb-1" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="text-xs text-gray-500 mb-2 capitalize">
            {item.category_name}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-primary-600">
              ₹{item.price}
            </Text>
            
            {item.status === 1 ? (
              <AddToCartButton item={item} />
            ) : (
              <View className="bg-red-50 px-3 py-1 rounded-full">
                <Text className="text-red-600 text-xs font-medium">Out of Stock</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemBox;