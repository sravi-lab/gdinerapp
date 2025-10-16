import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Box, HStack, StatusBar } from "native-base";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const Header1 = ({ title, path }) => {
  const router = useRouter();
  const user = useSelector((state) => state.appdata.user);
  
  const goBack = () => {
    if (path && path !== '') {
      router.push(path);
    } else {
      router.push("/gdiner");
    }
  };

  const [image1, setImage] = React.useState();
  
  React.useEffect(() => {
    if (user.islogged) {
      if (user.role === "student") {
        setImage(`https://doeresults.gitam.edu/photo/img.aspx?id=${user.regdno}`);
      } else {
        setImage("");
      }
    }
  }, [user]);

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

          {/* Title */}
          <View className="flex-1 items-center">
            <Text className="text-white text-lg font-semibold" numberOfLines={1}>
              {title}
            </Text>
          </View>

          {/* Right Space (for balance) */}
          <View className="w-10 h-10" />
        </View>
      </View>
    </>
  );
};

export default Header1;