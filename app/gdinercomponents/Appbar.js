import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Box, HStack, IconButton, Image } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { resetState, userUpdate } from "../../Store/Appdataslice";
import { useRouter } from "expo-router";

const Appbar = () => {
  const user = useSelector((state) => state.appdata.user);
  const dispatch=useDispatch();
  const router = useRouter();
  
  const [image1, setImage] = useState();
   useEffect(() => {
    if (user.islogged) {
      if (user.role == "student") {
        setImage(
          "https://doeresults.gitam.edu/photo/img.aspx?id=" + user.regdno
        );
      } else {
        setImage("https://gstaff.gitam.edu/img1.aspx?empid=" + user.regdno);
      }
    }
  }, [user]);
 const logout = () => {
     dispatch(userUpdate({}));
     dispatch(resetState());
     router.navigate("/Login");
   };
  return (
    <>
      <Box StatusBar bg="#007367" w="full">
        <HStack
          bg="#007367"
          px="4"
          py="3"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          <Image
            source={require("../../assets/gitam_logo_w.png")}
            style={styles.logo}
            alt="Gitam logo"
          />
          <IconButton style={styles.profile1} onPress={()=>logout()} colorScheme={'darkBlue'} variant="solid" _icon={{
        as: MaterialIcons,
        name: "logout",
        color:"#007367",
        size:"lg"
      }}></IconButton>
           
        </HStack>
      </Box>
    </>
  );
};
const styles = StyleSheet.create({
  logo: {
    width: 109,
    height: 46,
  
  },
  profile: {
    width: 48,
    height: 48,
    borderRadius: 100,
  },
  profile1: {
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor:"#fff",
  },
});
export default Appbar;
