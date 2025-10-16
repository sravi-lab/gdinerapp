import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Box, HStack, Image, StatusBar } from "native-base";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

const Header = ({ title }) => {
  const router = useRouter();
  const user = useSelector((state) => state.appdata.user);
  const location = useSelector((state) => state.appdata.location);

  const goBack = () => {
    if (user.role === "student") router.push("/student");
    else if (user.role === "staff") router.push("/staff");
    else router.push("/gdiner");
  };

  const changeLocation = () => {
    router.push("gdiner/ChangeLocation");
  };

  return (
    <>
      <StatusBar backgroundColor={"#007367"} />
      <View className="bg-primary-500 shadow-lg">
        <View className="flex-row items-center justify-between px-4 py-4 pt-12">
          {/* Back Button */}
          <TouchableOpacity 
            onPress={goBack}
            className="p-2 rounded-full active:bg-white/10"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Logo */}
          <View className="flex-1 items-center">
            <Image
              source={require("../../assets/dinerlogo.png")}
              alt="G-Diner Logo"
              className="w-24 h-8"
              resizeMode="contain"
            />
          </View>

          {/* Location Section */}
          <TouchableOpacity 
            onPress={changeLocation}
            className="flex-row items-center bg-white/10 px-3 py-2 rounded-full"
          >
            <Ionicons name="location-outline" size={18} color="#fff" />
            <Text className="text-white text-sm font-medium ml-1">
              {location.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Header;