import { Box, Button, HStack, Image, Text, View, VStack } from "native-base"
import { Alert, StyleSheet } from "react-native";
 import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AddToCartButton1 from "./AddToCartButton1";
const CartItem=({item,mess_code,mess_name})=>{
   
    return <Box  style={styles.box}>
<View position={"absolute"} zIndex={12} left={2} top={2} backgroundColor={"#fff"}><MaterialCommunityIcons color={item.type=='veg' ? "#007c00" : "#f00"} name="square-circle" size={16}   /></View>
        <HStack    >
            <Image source={{uri:item.image}} alt={item.name} style={styles.image}/>
            <View style={styles.subbox}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.category_name}</Text>
                <HStack justifyContent="space-between" alignItems="center" marginBottom={3} w={"80%"}>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <AddToCartButton1 item={item} selected_mess_code={mess_code} selected_mess_name={mess_name}/>
                </HStack>
            </View>
        </HStack>
    </Box>
}
const styles = StyleSheet.create({
 
  image:{
    width:100,
    height:"100%",
    resizeMode:"cover",
    
  },
  box:{
    width:"90%",
    borderWidth:1,
    margin:10,
    borderRadius:15,
    overflow:"hidden",
    borderColor:"#ccc",
    backgroundColor:"#fff",
    elevation:1,
    shadowColor:"#ccc"
  },
  subbox:{paddingHorizontal:10},
  title:{fontSize:12,fontWeight:700,color:"#007467"},
  subtitle:{fontSize:10,fontWeight:400,textTransform:"capitalize",color:"#007467"},
  price:{fontSize:15,fontWeight:700,color:"#007467"},
});
export default CartItem;