import React, { useContext } from "react";
import { Text, View, FlatList, HStack, Image } from "native-base";
import { Pressable, StyleSheet } from "react-native";
import StarRating from "./StarRating";
import { useDispatch } from "react-redux";
import { menuListUpdate, updateSelectedMess } from "../../Store/Dinerdataslice";
import { useRouter } from "expo-router";
import SocketContext from "./Connections/Socket";

const CafeLists = ({ list }) => {
  const dispatch = useDispatch(); 
  const router = useRouter();
  const ctx = useContext(SocketContext);
  
  const handleClick = (item) => {
    dispatch(updateSelectedMess({code: item.mess_code, name: item.mess_name, item}))
    dispatch(menuListUpdate({ loader: true, data: [] }));
    ctx.sendCommand('Get Menu', { 'mess_code': item.mess_code });
    router.navigate("gdiner/CafeMenu")
  }
 
  return (
    <View className="space-y-3">
      <FlatList
        data={list.cafe_list}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => handleClick(item)}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 active:bg-gray-50"
          >
            <HStack space={4} alignItems="center">
              {/* Text Section */}
              <View className="flex-1">
                <Text className="text-lg font-bold text-primary-600 mb-1">
                  {item.mess_name}
                </Text>
                <Text className="text-gray-500 text-sm mb-2">{item.campus}</Text>
                <StarRating rating={item.rating} reviews={item.reviews}/>
                
                {/* Status Badge */}
                <View className="flex-row items-center mt-2">
                  <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <Text className="text-green-600 text-xs font-medium">Open Now</Text>
                </View>
              </View>

              {/* Image Section */}
              {item.image && (
                <View className="w-24 h-20 rounded-lg overflow-hidden shadow-sm">
                  <Image
                    alt={item.mess_name}
                    source={{ uri: item.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={(error) => console.log("Image Load Error:", error.nativeEvent.error)}
                  />
                </View>
              )}
            </HStack>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CafeLists;