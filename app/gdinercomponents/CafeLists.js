import React, { useContext } from "react";
import { Text, View, FlatList, HStack, Image } from "native-base";
import { Pressable, StyleSheet } from "react-native";
import StarRating from "./StarRating";
import { useDispatch } from "react-redux";
import { menuListUpdate, updateSelectedMess } from "../../Store/Dinerdataslice";
import { useRouter } from "expo-router";
import SocketContext from "./Connections/Socket";

const CafeLists = ({ list }) => {
  
  const dispatch=useDispatch(); 
  const router=useRouter();
  const ctx=useContext(SocketContext);
  const handleClick=(item)=>{
     
          dispatch(updateSelectedMess({code:item.mess_code,name:item.mess_name,item}))
          dispatch(menuListUpdate({ loader: true, data: [] }));

          ctx.sendCommand('Get Menu', { 'mess_code': item.mess_code });
          router.navigate("gdiner/CafeMenu")
        }
 
  return (
    <View p={4}>
      <FlatList
        data={list.cafe_list}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => {
         
          return <Pressable 
            onPress={() => handleClick(item)}
            style={styles.box}
          >
            <HStack space={4} alignItems="center">
              {/* Text Section */}
              <View flex={1}>
                <Text fontSize="lg" fontWeight="bold" style={styles.mainhead}>
                  {item.mess_name}
                </Text>
                <Text color="gray.500">{item.campus}</Text>
                <StarRating rating={item.rating} reviews={item.reviews}/>
              </View>

              {/* Image Section */}
              {item.image && (
                <View style={styles.ttt} >
                    <Image
                  alt={item.mess_name}
                  source={{ uri: item.image }}
                  width={"100%"}  
                  height={"100%"}  
                  borderRadius={10}
                  resizeMode="cover"
                  onError={(error) => console.log("Image Load Error:", error.nativeEvent.error)}
                /></View>
              )}
            </HStack>
          </Pressable>
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
    heading:{
        fontSize:20,
        fontWeight:500,
        padding:15
    },
    ttt:{
        width:150,
        shadowColor:"#ccc",
        elevation:1,
        height:85,
        borderRadius:10
    },
    box:{
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth:1,
        borderColor:"#ccc"
        
      },
      mainhead:{
        color:"#054f47"
      }
});
export default CafeLists;
