import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Box, HStack, StatusBar } from "native-base";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const Header = ({ title }) => {
  const router = useRouter();
  const user = useSelector((state) => state.appdata.user);

  const goBack = () => {
  if(user.role == "staff"){
    router.push("/staff");
  }else if(user.role == "student"){
    router.push("/student");
  }else router.push("/parent");
  };
  const [image1, setImage] = React.useState();
   React.useEffect(() => {
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
  return (
    <>
    <StatusBar backgroundColor={"#007367ba"}></StatusBar>
      <Box StatusBar bg="#007367" w="full" position={"relative"}  >
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
              source={require("../assets/backArrow.png")}
              style={styles.img}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          {/* <View></View> */}
          <Image
           source={image1 ? { uri: image1 } : require("../assets/profile.png")} alt={user.name}
            style={styles.profile}
          />
        </HStack>
        {/* <View style={styles.main}></View> */}
      </Box>
     
    </>
  );
};
const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
  main:{
    backgroundColor:"#f2f2f2",
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    paddingTop:15,
    position:"absolute",bottom:0,
    zIndex:1000,
    width:"100%",
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
export default Header;
