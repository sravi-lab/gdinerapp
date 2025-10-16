import React, { useCallback } from "react";
import { HStack, IconButton, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
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

      dispatch(updateCart({ mess_code: selected_mess_code,mess_name: selected_mess_name, total: newTotal, items: updatedItems }));
    },
    [dispatch, cart, item, itemInCart, count, selected_mess_code]
  );

  return count === 0 ? (
    <IconButton
      icon={<MaterialIcons name="add" size={18} color="white" />}
      borderRadius="full"
      style={styles.nrmlbtn1}
      onPress={() => handleCartUpdate("add")}
      _pressed={{ bg: "green.600" }}
    />
  ) : (
    <HStack alignItems="center" space={2} backgroundColor={"#007467"} borderRadius={20} px={3} py={1}>
      <IconButton
        icon={<MaterialIcons name="remove" size={14} color="white" />}
        borderRadius="full"
        style={styles.nrmlbtn}
        onPress={() => handleCartUpdate("remove")}
        _pressed={{ bg: "red.600" }}
      />
      <Text fontSize={14} color={"#fff"}>{count}</Text>
      <IconButton
        icon={<MaterialIcons name="add" size={14} color="white" />}
        borderRadius="full"
        style={styles.nrmlbtn}
        onPress={() => handleCartUpdate("add")}
        _pressed={{ bg: "green.600" }}
      />
    </HStack>
  );
});

const styles = StyleSheet.create({
  nrmlbtn: {
    backgroundColor: "#007467",
    paddingTop: 2,
    paddingLeft: 2,
    paddingBottom: 2,
    paddingRight: 2,
  },
  nrmlbtn1:{
    backgroundColor: "#007467",
    paddingTop: 4,
    paddingLeft: 4,
    paddingBottom: 4,
    paddingRight: 4,
  }
});

export default AddToCartButton;
