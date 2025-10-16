import React from 'react';
import { Box, Text, HStack, Center, Pressable, Icon, Badge } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSelector } from 'react-redux'; // Assuming cart items are stored in Redux

function BottomBar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current route path

  // Get cart item count from Redux (assuming `cartItems` is an array in Redux store)
 const cart = useSelector((state) => state.appdata.cart) || [];
 
    // Calculate total amount and item count
    const totalItems = cart.reduce((count, mess) => count + (mess.items ? mess.items.length : 0), 0);
 

  // Define routes
  const tabs = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: '/gdiner' },
    { name: 'Mess Card', icon: 'card-account-details-outline', route: '/gdiner/MessCard' },
    { name: 'Cart', icon: 'cart-outline', activeIcon: 'cart', route: '/gdiner/Cart' },
    { name: 'History', icon: 'history', route: '/gdiner/History' },
  ];

  return (
    <Box bg="white" width="100%">
      <HStack bg="#054f47" alignItems="center" safeAreaBottom shadow={6}>
        {tabs.map((tab, index) => {
          const isSelected = pathname === tab.route; // Check active tab
          const showBadge = tab.name === 'Cart' && totalItems > 0; // Show badge only for Cart

          return (
            <Pressable
              key={index}
              cursor="pointer"
              opacity={isSelected ? 1 : 0.5}
              py="3"
              flex={1}
              onPress={() => router.push(tab.route)} // Navigate using `push`
            >
              <Center>
                {showBadge && (
                  <Badge
                    colorScheme="danger"
                    rounded="full"
                    mb={-4}
                    mr={3}
                    zIndex={1}
                    variant="solid"
                    alignSelf="flex-end"
                    _text={{ fontSize: 10 }}
                  >
                    {totalItems}
                  </Badge>
                )}
                <Icon
                  mb="1"
                  as={<MaterialCommunityIcons name={isSelected ? tab.activeIcon || tab.icon : tab.icon} />}
                  color="white"
                  size="lg"
                />
                <Text color="white" fontSize="12">
                  {tab.name}
                </Text>
              </Center>
            </Pressable>
          );
        })}
      </HStack>
    </Box>
  );
}

export default BottomBar;
