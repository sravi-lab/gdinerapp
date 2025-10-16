import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Box, HStack } from "native-base";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import arrowimage from '../../assets/backArrow.png';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Header = ({ title,path }) => {
  const user = useSelector((state) => state.appdata.user);

  const router = useRouter();
   const goBack = () => {
    if(user.role=='staff') router.push("/staff");
    else router.push("/student");
  };
  const [image1, setImage] = React.useState();
   React.useEffect(() => {
    if (user.islogged) {
      if (user.role == "student") {
        setImage(
          "https://doeresults.gitam.edu/photo/img.aspx?id=" + user.regdno
        );
      } else {
        setImage(`https://gstaff.gitam.edu/img1.aspx?empid=${user.regdno}`);
      }
    }
  }, [user]);
  const containsCATS = title.toLowerCase().includes("cats");

  return (
    <>
      <Box StatusBar bg="#007367" w="full" height={70}>
        <HStack
          bg="#007367"
          px="4"
          py="2"
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
          {containsCATS ? (
          <TouchableOpacity onPress={() => router.push("staff/SupportScanner")} >
            <View style={{padding:10}}>
            <Icon name="barcode-scan" size={32} color="#fff" />
            </View>
          </TouchableOpacity>
        ) : (
         // <Image source={{ uri: image1 }} style={styles.profile} /> 
         <View style={styles.profile}></View>
        )}
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
    width: 48,
    height: 48,
    borderRadius: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: "semibold",
    color: "#fff",
    width:"70%",
    textAlign:"center"
  },
});
export default Header;
