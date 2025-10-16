import { View, Text, ScrollView } from "native-base";
import { useSelector } from "react-redux";
import CartItem from "../gdinercomponents/CartItem";
import Header1 from "../gdinercomponents/Header1";
import CheckoutBtn from "../gdinercomponents/CheckoutBtn";

const Cart = () => {
  const cart = useSelector((state) => state.appdata.cart) || [];

  // ✅ Check if there are any items in the cart
  const hasItems = cart.some((mess) => mess.items.length > 0);
  const totalItems = cart.reduce((count, mess) => count + (mess.items ? mess.items.length : 0), 0);
 
  return (
    <View className="flex-1 bg-gray-50">
      <Header1 title={"Shopping Cart"} />
      
      {hasItems ? (
        <View className="flex-1">
          {/* Cart Header */}
          <View className="bg-white px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'} in Cart
            </Text>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {cart.map((mess, index) => (
              mess.items.length > 0 && (
                <View key={index} className="bg-white mb-2">
                  {/* Mess Header */}
                  <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <Text className="font-bold text-primary-600 text-base">
                      {mess.mess_name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {mess.items.length} {mess.items.length === 1 ? 'item' : 'items'}
                    </Text>
                  </View>
                  
                  {/* Cart Items */}
                  <View className="px-4">
                    {mess.items.map((item, itemIndex) => (
                      <CartItem 
                        key={itemIndex} 
                        item={item} 
                        mess_code={mess.mess_code} 
                        mess_name={mess.mess_name}
                      />
                    ))}
                  </View>
                </View>
              )
            ))}
            
            {/* Checkout Button */}
            <View className="px-4 pb-6">
              <CheckoutBtn />
            </View>
          </ScrollView>
        </View>
      ) : (
        // Empty Cart State
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center">
            <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-6">
              <Text className="text-4xl">🛒</Text>
            </View>
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              Browse our delicious menu and add items to get started
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Cart;