import { Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Box, HStack, Image, View, VStack } from "native-base";
import { useSelector } from "react-redux";

const Heading = () => {
  const user = useSelector((state) => state.appdata.user);
  const [image1, setImage] = useState();

  useEffect(() => {
    if (user.islogged) {
      if (user.role === "student") {
        setImage("https://doeresults.gitam.edu/photo/img.aspx?id=" + user.regdno);
      } else {
        setImage("https://gstaff.gitam.edu/img1.aspx?empid=" + user.regdno);
      }
    }
  }, [user]);

  return (
    <View backgroundColor={"#007367"}>
      <Box w="100%" px="4" pt="2" style={styles.marginbottoms}>
        <View style={styles.heading}>
          <HStack space={3}>
            <Image source={{ uri: image1 }} alt={user.name} style={styles.profile} />
            <VStack ml={3}>
              {/* Name Text with Wrapping & Shrinking */}
              <Text style={styles.name} numberOfLines={2} adjustsFontSizeToFit>
                {user.name}
              </Text>

              {user.role === "staff" && <Text style={styles.name1}>EMPID : {user.regdno}</Text>}
              {user.role === "staff" && <Text style={styles.name1}>{user.emailid}</Text>}
              {user.role === "student" && <Text style={styles.name1}>{user.regdno}</Text>}
              {user.role === "student" && (
                <Text style={styles.name2}>
                  {user.collegE_CODE}, {user.campus}
                </Text>
              )}
            </VStack>
          </HStack>
        </View>
      </Box>
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode:"cover"
  },
  heading: {
    fontSize: 24,
    color: "#000",
    padding: 15,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 9 },
    marginVertical:15,
    elevation:2,
    shadowColor:"#000",
    shadowOpacity:343
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007367",
    textTransform: "capitalize",
    maxWidth: 200, // Prevents overflow
    flexShrink: 1, // Allows text to shrink if needed
    lineHeight: 22, // Adjusted for better readability
  },
  name1: {
    fontSize: 16,
    marginTop: 1,
    color: "#007367",
  },
  name2: {
    fontSize: 13,
    
    color: "#007367",
    marginTop: 2,
  },
  marginbottoms: {
    backgroundColor: "#f1f1f1",
    borderTopLeftRadius:30,
    borderTopRightRadius:30
  },
});

export default Heading;
