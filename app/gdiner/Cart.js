import { View, Text, ScrollView } from "native-base";
import BottomBar from "../gdinercomponents/BottomBar";
import { useSelector } from "react-redux";
import CartItem from "../gdinercomponents/CartItem";
import Header1 from "../gdinercomponents/Header1";
import CheckoutBtn from "../gdinercomponents/CheckoutBtn";

const Cart = () => {
  const cart = useSelector((state) => state.appdata.cart) || [];

  // ✅ Check if there are any items in the cart
  const hasItems = cart.some((mess) => mess.items.length > 0);
 
  return (
    <>
      <Header1 title={"Cart"} />
      <View h={"90%"} justifyContent="center" alignItems="center">
        {hasItems ? (
         <>
          <ScrollView>
            {cart.map((mess, index) => (
              mess.items.length > 0 && ( // ✅ Render only if the mess has items
                <View key={index} paddingX={4} paddingTop={3} >
                  <Text fontSize="14" paddingX={4} fontWeight="bold">
                    {mess.mess_name}
                  </Text>
                  {mess.items.map((item, itemIndex) => (
                    <CartItem key={itemIndex} item={item} mess_code={mess.mess_code} mess_name={mess.mess_name}/>
                  ))}
                  
                </View>
              )
            ))}
              <CheckoutBtn />
          </ScrollView>
        
          </>
        ) : (
          // ✅ Show "No items in cart" when cart is empty
          <Text fontSize="lg" color="gray.500">No items in cart</Text>
        )}
      </View>
    </>
  );
};

export default Cart;
