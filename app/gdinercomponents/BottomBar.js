import React from 'react';
import { Box, Text, HStack, Center, Pressable, Icon, Badge } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSelector } from 'react-redux';

function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  const cart = useSelector((state) => state.appdata.cart) || [];
  const totalItems = cart.reduce((count, mess) => count + (mess.items ? mess.items.length : 0), 0);

  const tabs = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: '/gdiner' },
    { name: 'Mess Card', icon: 'card-account-details-outline', route: '/gdiner/MessCard' },
    { name: 'Cart', icon: 'cart-outline', activeIcon: 'cart', route: '/gdiner/Cart' },
    { name: 'History', icon: 'history', route: '/gdiner/History' },
  ];

  return (
    <View className="bg-white border-t border-gray-200 shadow-lg">
      <View className="flex-row items-center justify-around py-2 px-4 pb-6">
        {tabs.map((tab, index) => {
          const isSelected = pathname === tab.route;
          const showBadge = tab.name === 'Cart' && totalItems > 0;

          return (
            <Pressable
              key={index}
              onPress={() => router.push(tab.route)}
              className={`flex-1 items-center py-2 ${isSelected ? 'opacity-100' : 'opacity-60'}`}
            >
              <View className="relative items-center">
                {showBadge && (
                  <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center z-10">
                    <Text className="text-white text-xs font-bold">
                      {totalItems > 99 ? '99+' : totalItems}
                    </Text>
                  </View>
                )}
                
                <View className={`p-2 rounded-full ${isSelected ? 'bg-primary-50' : ''}`}>
                  <MaterialCommunityIcons 
                    name={isSelected ? tab.activeIcon || tab.icon : tab.icon}
                    size={24}
                    color={isSelected ? '#007367' : '#6b7280'}
                  />
                </View>
                
                <Text className={`text-xs mt-1 ${
                  isSelected ? 'text-primary-600 font-semibold' : 'text-gray-500'
                }`}>
                  {tab.name}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default BottomBar;