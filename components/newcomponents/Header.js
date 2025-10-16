// components/headers/HeaderMain.js
import React from "react";
import { StatusBar, Platform } from "react-native";
import { HStack, Box, Image, Pressable, Avatar, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Main Header with Logo and User Image
export function HeaderMain({ 
  logoSource, 
  userImage, 
  userName = "User",
  onUserPress,
  backgroundImage,
  showNotificationBadge = false,
  notificationCount = 0 
}) {
  const insets = useSafeAreaInsets();
  
  return (
    <>
      {/* Status Bar */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#007367" 
        translucent={Platform.OS === 'android'}
      />
      
      {/* Header Container */}
      <Box
        className="relative"
        bg="#007367"
        style={{ paddingTop: insets.top + 8 }}
      >
        {/* Background Image Overlay */}
        {backgroundImage && (
          <Image
            source={backgroundImage}
            alt="Header Background"
            className="absolute inset-0 opacity-15"
            resizeMode="cover"
          />
        )}
        
        {/* Header Content */}
        <HStack
          className="items-center justify-between relative z-10 px-4 pb-4"
        >
          {/* Left - Logo */}
          <Box className="flex-1">
            {logoSource ? (
              <Image
                source={logoSource}
                alt="Logo"
                className="h-10 w-32"
                resizeMode="contain"
              />
            ) : (
              <Text className="text-white text-xl font-bold">
                MyApp
              </Text>
            )}
          </Box>
          
          {/* Right - User Section */}
          <HStack className="items-center space-x-3">
            {/* Notification Bell */}
            <Pressable
              className="relative p-2 rounded-full active:bg-white/10"
              onPress={() => console.log("Notifications pressed")}
            >
              <Ionicons 
                name="notifications-outline" 
                size={24} 
                color="white" 
              />
              {showNotificationBadge && notificationCount > 0 && (
                <Box
                  className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center"
                >
                  <Text
                    className="text-white text-2xs font-bold"
                  >
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Text>
                </Box>
              )}
            </Pressable>
            
            {/* User Avatar */}
            <Pressable
              className="active:opacity-80"
              onPress={onUserPress}
            >
              <Avatar
                source={userImage}
                size="md"
                className="border-2"
                borderColor="#f3e5cb"
              >
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </Avatar>
            </Pressable>
          </HStack>
        </HStack>
      </Box>
    </>
  );
}

// Secondary Header with Back Button
export function HeaderWithBack({ 
  title, 
  onBackPress,
  rightComponent,
  showRightUser = true,
  userImage,
  userName = "User",
  onUserPress,
  backgroundImage 
}) {
  const insets = useSafeAreaInsets();
  
  return (
    <>
      {/* Status Bar */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#007367" 
        translucent={Platform.OS === 'android'}
      />
      
      {/* Header Container */}
      <Box
        className="relative"
        bg="#007367"
        style={{ paddingTop: insets.top + 8 }}
      >
        {/* Background Image Overlay */}
        {backgroundImage && (
          <Image
            source={backgroundImage}
            alt="Header Background"
            className="absolute inset-0 opacity-15"
            resizeMode="cover"
          />
        )}
        
        {/* Header Content */}
        <HStack
          className="items-center justify-between relative z-10 px-4 pb-4"
        >
          {/* Left - Back Button */}
          <Pressable
            className="p-2 rounded-full mr-3 active:bg-white/10"
            onPress={onBackPress}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color="white" 
            />
          </Pressable>
          
          {/* Center - Title */}
          <Box className="flex-1">
            <Text
              className="text-white text-lg font-semibold text-center"
              numberOfLines={1}
            >
              {title}
            </Text>
          </Box>
          
          {/* Right - User/Custom Component */}
          <Box className="min-w-10">
            {rightComponent ? (
              rightComponent
            ) : showRightUser ? (
              <HStack className="items-center space-x-2">
                <Pressable
                  className="active:opacity-80"
                  onPress={onUserPress}
                >
                  <Avatar
                    source={userImage}
                    size="sm"
                    className="border-2"
                    borderColor="#f3e5cb"
                  >
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                </Pressable>
              </HStack>
            ) : null}
          </Box>
        </HStack>
      </Box>
    </>
  );
}

// Enhanced Header with Gradient Background
export function HeaderGradient({ 
  title, 
  onBackPress,
  showBack = false,
  logoSource,
  userImage,
  userName = "User",
  onUserPress,
  showNotificationBadge = false,
  notificationCount = 0,
  rightComponent
}) {
  const insets = useSafeAreaInsets();
  
  return (
    <>
      {/* Status Bar */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#007367" 
        translucent={Platform.OS === 'android'}
      />
      
      {/* Gradient Header Container */}
      <Box
        className="relative"
        style={{ 
          paddingTop: insets.top + 8,
          background: 'linear-gradient(135deg, #007367 0%, #005a50 100%)'
        }}
        bg="#007367"
      >
        {/* Decorative Pattern */}
        <Box
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, white 2px, transparent 2px)',
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Header Content */}
        <HStack
          className="items-center justify-between relative z-10 px-4 pb-4"
        >
          {/* Left Section */}
          <Box className="flex-1">
            {showBack ? (
              <HStack className="items-center space-x-3">
                <Pressable
                  className="p-2 rounded-full active:bg-white/10"
                  onPress={onBackPress}
                >
                  <Ionicons 
                    name="arrow-back" 
                    size={24} 
                    color="white" 
                  />
                </Pressable>
                <Text
                  className="text-white text-lg font-semibold"
                  numberOfLines={1}
                >
                  {title}
                </Text>
              </HStack>
            ) : (
              <>
                {logoSource ? (
                  <Image
                    source={logoSource}
                    alt="Logo"
                    className="h-10 w-32"
                    resizeMode="contain"
                  />
                ) : (
                  <Box>
                    <Text className="text-white text-xl font-bold">
                      MyApp
                    </Text>
                    <Text className="text-white/70 text-sm">
                      Welcome back
                    </Text>
                  </Box>
                )}
              </>
            )}
          </Box>
          
          {/* Right Section */}
          <HStack className="items-center space-x-3">
            {rightComponent ? (
              rightComponent
            ) : (
              <>
                {/* Notification Bell */}
                <Pressable
                  className="relative p-2 rounded-full active:bg-white/10"
                  onPress={() => console.log("Notifications pressed")}
                >
                  <Ionicons 
                    name="notifications-outline" 
                    size={24} 
                    color="white" 
                  />
                  {showNotificationBadge && notificationCount > 0 && (
                    <Box
                      className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center shadow-lg"
                    >
                      <Text className="text-white text-2xs font-bold">
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </Text>
                    </Box>
                  )}
                </Pressable>
                
                {/* User Avatar */}
                <Pressable
                  className="active:opacity-80"
                  onPress={onUserPress}
                >
                  <Avatar
                    source={userImage}
                    size="md"
                    className="border-2 shadow-lg"
                    borderColor="#f3e5cb"
                  >
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                </Pressable>
              </>
            )}
          </HStack>
        </HStack>
      </Box>
    </>
  );
}