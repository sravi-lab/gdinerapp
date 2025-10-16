import React, { useCallback } from "react";
import { HStack, IconButton, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { updateCart } from "../../Store/Appdataslice";
 
const AddToCartButton = React.memo(({ item }) => {
  const dispatch = useDispatch();
  const selected_mess_code = useSelector((state) => state.dinerdata.selected_mess.code);
  const selected_mess_name = useSelector((state) => state.dinerdata.selected_mess.name);

  // ✅ Select only the cart items related to the selected mess
  const cart = useSelector((state) =>
    state.appdata.cart.find((c) => c.mess_code === selected_mess_code) || { total: 0, items: [] }
  );

  // ✅ Get item details from cart (if present)
  const itemInCart = cart.items.find((cartItem) => cartItem.id === item.id);
  const count = itemInCart ? itemInCart.quantity : 0;

  // ✅ Memoized function to update cart
  const handleCartUpdate = useCallback(
    (type) => {
      let updatedItems = [...cart.items];
      let newTotal = cart.total;
      const index = updatedItems.findIndex((cartItem) => cartItem.id === item.id);

      if (type === "add") {
        if (itemInCart) {
          updatedItems[index] = {
            ...itemInCart,
            quantity: itemInCart.quantity + 1,
            total: itemInCart.total + item.price,
          };
        } else {
          updatedItems.push({ ...item, quantity: 1, total: item.price });
        }
        newTotal += item.price;
      } else if (type === "remove" && count > 0) {
        if (itemInCart.quantity > 1) {
          updatedItems[index] = {
            ...itemInCart,
            quantity: itemInCart.quantity - 1,
            total: itemInCart.total - item.price,
          };
        } else {
          updatedItems = updatedItems.filter((cartItem) => cartItem.id !== item.id);
        }
        newTotal -= item.price;
      }

      dispatch(updateCart({ mess_code: selected_mess_code, mess_name: selected_mess_name, total: newTotal, items: updatedItems }));
    },
    [dispatch, cart, item, itemInCart, count, selected_mess_code]
  );

  return count === 0 ? (
    <TouchableOpacity
      onPress={() => handleCartUpdate("add")}
      className="bg-primary-500 w-8 h-8 rounded-full items-center justify-center shadow-sm active:bg-primary-600"
    >
      <MaterialIcons name="add" size={18} color="white" />
    </TouchableOpacity>
  ) : (
    <View className="bg-primary-500 rounded-full px-3 py-1 flex-row items-center space-x-2">
      <TouchableOpacity
        onPress={() => handleCartUpdate("remove")}
        className="w-6 h-6 rounded-full bg-white/20 items-center justify-center active:bg-white/30"
      >
        <MaterialIcons name="remove" size={14} color="white" />
      </TouchableOpacity>
      
      <Text className="text-white font-medium text-sm min-w-[20px] text-center">
        {count}
      </Text>
      
      <TouchableOpacity
        onPress={() => handleCartUpdate("add")}
        className="w-6 h-6 rounded-full bg-white/20 items-center justify-center active:bg-white/30"
      >
        <MaterialIcons name="add" size={14} color="white" />
      </TouchableOpacity>
    </View>
  );
});

export default AddToCartButton;