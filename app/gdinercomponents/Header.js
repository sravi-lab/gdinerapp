import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Box, HStack, Image, StatusBar } from "native-base";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import vector icon

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
      <StatusBar backgroundColor={"#007367ba"} />
      <Box bg="#007367" w="full">
        <HStack
          bg="#007367"
          px="4"
          py="4"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          {/* Back Button */}
          <TouchableOpacity onPress={goBack}>
            <Image
            alt="back"
              source={require("../../assets/backArrow.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <View style={styles.lgo}>
          <Image
            alt="back"
              source={require("../../assets/dinerlogo.png")}
              style={styles.logo}
            />
            </View>
          {/* Title */}
          

          {/* Location Section */}
          <TouchableOpacity style={styles.locationContainer} onPress={changeLocation}>
            <Ionicons name="location-outline" size={22} color="#fff" />
            <Text style={styles.locationText}>{location.name}</Text>
          </TouchableOpacity>
        </HStack>
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    width: "50%",
    textAlign: "left",
    paddingLeft: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  }, icon: {
    width: 32,
    height: 32,
  },
  logo:{
    width:100,
    height:30,
    textAlign: "left",
  },
  lgo:{
    width: "50%",
    textAlign: "left",
     
  }
});

export default Header;
