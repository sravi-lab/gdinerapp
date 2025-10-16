import { Box, Button, HStack, Image, Text, View, VStack } from "native-base"
import { StyleSheet } from "react-native";
import AddToCartButton from "./AddToCartButton";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const ItemBox=({item})=>{
   
    return <Box  style={styles.box}>
<View position={"absolute"} zIndex={12} right={2} top={2} backgroundColor={"#fff"}><MaterialCommunityIcons color={item.type=='veg' ? "#007c00" : "#f00"} name="square-circle" size={16}   /></View>
        <VStack>
            <Image source={{uri:item.image}} alt={item.name} style={styles.image}/>
            <View style={styles.subbox}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.category_name}</Text>
                <HStack justifyContent="space-between" alignItems="center" marginY={1}>
                    <Text style={styles.price}>₹{item.price}</Text>
                   {item.status==1 ? <AddToCartButton item={item}/> : <Text style={{color:"#f00"}}>Out of Stock</Text>}
                </HStack>
            </View>
        </VStack>
    </Box>
}
const styles = StyleSheet.create({
 
  image:{
    width:"100%",
    height:180,
    resizeMode:"cover",
    
  },
  box:{
    width:"46%",
    borderWidth:1,
    margin:10,
    borderRadius:15,
    overflow:"hidden",
    borderColor:"#ccc",
    backgroundColor:"#fff",
    elevation:1,
    shadowColor:"#ccc"
  },
  subbox:{padding:10},
  title:{fontSize:14,fontWeight:700,color:"#007467"},
  subtitle:{fontSize:12,fontWeight:400,textTransform:"capitalize",color:"#007467"},
  price:{fontSize:17,fontWeight:700,color:"#007467"},
});
export default ItemBox;