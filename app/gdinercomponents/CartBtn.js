import React from "react";
import { Badge, Button, VStack, Box, Center, NativeBaseProvider, Icon, Pressable } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
function CartBtn() {
    const cart = useSelector((state) => state.appdata.cart) || [];
    
    // Calculate total amount and item count
     const totalItems = cart.reduce((count, mess) => count + (mess.items ? mess.items.length : 0), 0);
    const router = useRouter();

  return <Box alignItems="center">
    <Pressable onPress={() => router.navigate("/gdiner/Cart")}>
      <VStack>
        <Badge // bg="red.400"
      colorScheme="danger" rounded="full" mb={-6} mr={-2} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
        fontSize: 12
      }}>
          {totalItems}
        </Badge>
        <Button onPress={() => router.navigate("/gdiner/Cart")} borderRadius={"full"} mx={{
        base: "auto",
        md: 0
      }} p="5" bg="#054f47" _text={{
        fontSize: 14
      }}>
          <Icon color="#f3e5cb" as={MaterialCommunityIcons} name="cart" size="lg"/>
        </Button>
      </VStack>
      </Pressable>
    </Box>;
}
export default CartBtn;
