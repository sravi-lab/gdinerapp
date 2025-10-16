import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Box, HStack, StatusBar } from "native-base";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const Header1 = ({ title,path }) => {
  const router = useRouter();
  const goBack = () => {
    if(path!='' && path!=undefined){
      router.push(path);
    }else
    router.push("/gdiner");
  };
  const user = useSelector((state) => state.appdata.user);
  const [image1, setImage] = React.useState();
   React.useEffect(() => {
    if (user.islogged) {
      if (user.role == "student") {
        setImage(
          "https://doeresults.gitam.edu/photo/img.aspx?id=" + user.regdno
        );
      } else {
        setImage("");
      }
    }
  }, [user]);
  return (
    <>
    <StatusBar backgroundColor={"#007367ba"}></StatusBar>
      <Box StatusBar bg="#007367" w="full">
        <HStack
          bg="#007367"
          px="4"
          py="3"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          <TouchableOpacity onPress={goBack}>
            <Image
              source={require("../../assets/backArrow.png")}
              style={styles.img}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          {/* <View></View> */}
          <View style={styles.profile}/>
        </HStack>
      </Box>
    </>
  );
};
const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
  img: {
    width: 32,
    height: 32,
  },
  profile: {
    width: 42,
    height: 42,
    borderRadius: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "semibold",
    color: "#fff",
    width:"60%",
    textAlign:"center"
  },
});
export default Header1;
