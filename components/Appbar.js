import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Badge, Box, HStack, IconButton, Image, VStack, Pressable } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { resetState, userUpdate } from "../Store/Appdataslice";
import axios from "axios";
import { MOBILEAPI, MOBILEAPIKEY } from "../utilities/Apiurl";

const Appbar = () => {
  const user = useSelector((state) => state.appdata.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [image1, setImage] = useState();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (user.islogged) {
      if (user.role === "student") {
        setImage(`https://doeresults.gitam.edu/photo/img.aspx?id=${user.regdno}`);
      } else {
        setImage(`https://gstaff.gitam.edu/img1.aspx?empid=${user.regdno}`);
      }
    }
  }, [user]);

  const onclickscanner = () => {
    router.push("staff/QrcodeScanMain");
  };
  const logout = () => {
    dispatch(userUpdate({}));
    dispatch(resetState());
    router.navigate("/Login");
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
       
      const url = `${MOBILEAPI}/getNotificationCount`;

     
      const response = await axios.post(
        url,
        { user_id: user.regdno },
        { headers: { Authorization: `Bearer ${MOBILEAPIKEY}` } }
      );
       setCount(response.data.data[0].total || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    } finally {
       
    }
  };
  return (
    <Box StatusBar bg="#007367" w="full">
      <HStack bg="#007367" px="4" py="3" justifyContent="space-between" alignItems="center" w="100%">
       
        <Image source={require("../assets/gitam_logo_w.png")} style={styles.logo} alt="Gitam logo" />
        <HStack space={2} alignItems="center">
      {user.role !== "student" &&  <IconButton 
          size="lg"
          bg="#007367"
          onPress={onclickscanner}
          colorScheme="darkBlue"
          variant="solid"
          borderRadius={100}
          _icon={{ as: MaterialCommunityIcons, name: "qrcode-scan", color: "#fff", size: "28" }}
        />}
          <VStack>
            <Badge  
              colorScheme="danger" 
              rounded="full" 
              mb={-5} 
              mr={0} 
              zIndex={1} 
              variant="solid" 
              alignSelf="flex-end" 
              _text={{ fontSize: 12 }}>
              {count}
            </Badge>
            <IconButton 
              size="lg"
              bg="#007367"
              onPress={() => router.navigate("/Alerts")}
              colorScheme="darkBlue"
              variant="solid"
              borderRadius={100}
              _icon={{ as: MaterialCommunityIcons, name: "bell", color: "#fff", size: "28" }}
            />
          </VStack>
          <Pressable onPress={() => {
            if(user.role === "student"){
              router.navigate("student/Profile");
            }else if(user.role === "staff"){
              router.navigate("staff/Profile");
            }else{
              router.navigate("parent");
            }
            }}> 
            <Image 
              source={{ uri: image1 }} 
              alt="User Avatar" 
              style={styles.avatar} 
            />
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 109,
    height: 46,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Appbar;
