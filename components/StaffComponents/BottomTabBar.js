// staff/CustomTabs.js
import React from "react";
import { HStack, Pressable, Box, Text, Badge } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate
} from "react-native-reanimated";
import { useEffect } from "react";

const TABS = [
  { name: "index", label: "Home", icon: "home-outline", activeIcon: "home" },
  { name: "chat", label: "Chat", icon: "chatbubble-outline", activeIcon: "chatbubble", badge: 3 },
  { name: "notifications", label: "Notifications", icon: "notifications-outline", activeIcon: "notifications", badge: 5 },
  { name: "Profile", label: "My Account", icon: "person-outline", activeIcon: "person" },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function BottomTabBar() {
  const router = useRouter();
  const segments = useSegments();
  const current = segments[segments.length - 1] || "home";
  
  // Animation values for each tab
  const tabAnimations = TABS.map(() => useSharedValue(0));
  const scaleValues = TABS.map(() => useSharedValue(1));

  useEffect(() => {
    // Animate tabs based on active state
    TABS.forEach((tab, index) => {
      const isActive = current === tab.name;
      tabAnimations[index].value = withSpring(isActive ? 1 : 0, {
        damping: 15,
        stiffness: 150,
      });
      scaleValues[index].value = withSpring(isActive ? 1.1 : 1, {
        damping: 12,
        stiffness: 200,
      });
    });
  }, [current]);

  const TabItem = ({ tab, index }) => {
    const isActive = current === tab.name;
    
    const animatedIconStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        tabAnimations[index].value,
        [0, 1],
        [0, -2]
      );
      
      return {
        transform: [
          { translateY },
          { scale: scaleValues[index].value }
        ],
      };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        tabAnimations[index].value,
        [0, 1],
        [0.6, 1]
      );
      
      return {
        opacity,
      };
    });

    const animatedBadgeStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        tabAnimations[index].value,
        [0, 1],
        [0.8, 1]
      );
      
      return {
        transform: [{ scale }],
      };
    });

    return (
      <AnimatedPressable
        key={tab.name}
        flex={1}
        alignItems="center"
        onPress={() => {
          // Add haptic feedback for better UX
          router.push(`/staff/${tab.name}`);
        }}
        style={[
          {
            paddingVertical: 8,
          },
        ]}
      >
        <Box alignItems="center" position="relative">
          <Animated.View style={animatedIconStyle}>
            <Box position="relative">
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={24}
                color={isActive ? "#005A50" : "#6B7280"}
              />
              {tab.badge && tab.badge > 0 && (
                <Animated.View 
                  style={[
                    animatedBadgeStyle,
                    {
                      position: 'absolute',
                      top: -8,
                      right: -8,
                    }
                  ]}
                >
                  <Badge
                    bg="#EF4444"
                    rounded="full"
                    minW={5}
                    h={5}
                    _text={{
                      color: "white",
                      fontSize: "xs",
                      fontWeight: "bold"
                    }}
                  >
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </Badge>
                </Animated.View>
              )}
            </Box>
          </Animated.View>
          
          <Animated.View style={animatedTextStyle}>
            <Text 
              fontSize="xs" 
              color={isActive ? "#005A50" : "#6B7280"}
              fontWeight={isActive ? "600" : "400"}
              mt={1}
            >
              {tab.label}
            </Text>
          </Animated.View>

          {/* Active indicator */}
          {isActive && (
            <Animated.View
              style={{
                position: 'absolute',
                bottom: -12,
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#005A50',
              }}
            />
          )}
        </Box>
      </AnimatedPressable>
    );
  };

  return (
    <Box
      bg="white"
      borderTopWidth={1}
      borderTopColor="gray.200"
      safeAreaBottom
    >
      {/* Tab indicator background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="1px"
        bg="gray.100"
      />
      
      <HStack
        alignItems="center"
        justifyContent="space-around"
        py={2}
        px={4}
      >
        {TABS.map((tab, index) => (
          <TabItem key={tab.name} tab={tab} index={index} />
        ))}
      </HStack>
    </Box>
  );
}