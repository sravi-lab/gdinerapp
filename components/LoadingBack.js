import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Box, Center, HStack } from "native-base";
import Layout from "./Layout";
import { Link } from "expo-router";

const images = {
  icon_1: require("../assets/icon_1.png"),
  icon_2: require("../assets/icon_2.png"),
  icon_3: require("../assets/icon_3.png"),
  icon_4: require("../assets/icon_4.png"),
  icon_5: require("../assets/icon_5.png"),
  icon_6: require("../assets/icon_6.png"),
  icon_7: require("../assets/icon_7.png"),
  icon_8: require("../assets/icon_8.png"),
  icon_9: require("../assets/icon_9.png"),
  icon_10: require("../assets/icon_10.png"),
};

const HomecomponentsBackup = () => {
  const data = [
    {
      id: 1,
      img: "icon_1",
      title: "Profile",
      link: "student/Profile",
    },
    {
      id: 2,
      img: "icon_2",
      title: "Attendance",
      link: "student/Attendance",
    },
    {
      id: 3,
      img: "icon_3",
      title: "Academic Track",
      link: "student/Academic",
    },
    {
      id: 4,
      img: "icon_4",
      title: "Hall Tickets",
      link: "student/Hallticket",
    },
    {
      id: 5,
      img: "icon_5",
      title: "Course Registration",
      link: "login",
    },
    {
      id: 6,
      img: "icon_6",
      title: "G-Certificate",
      link: "login",
    },
    {
      id: 7,
      img: "icon_7",
      title: "Permissions & Leaves",
      link: "login",
    },
    {
      id: 8,
      img: "icon_8",
      title: "G-Pay",
      link: "login",
    },
    {
      id: 9,
      img: "icon_9",
      title: "G-Dinner",
      link: "login",
    },
    {
      id: 10,
      img: "icon_10",
      title: "Feedback",
      link: "login",
    },
  ];
  return (
    <>
      <Layout>
        <Box style={styles.box}>
          <HStack style={styles.flexcards}>
            {data.map((items) => (
              <>
                <Link style={styles.card} key={items.id} href={items.link}>
                  <View style={styles.imgbg}>
                    <Image source={images[items.img]} style={styles.icon} />
                  </View>
                  <Text style={styles.title}>{items.title}</Text>
                </Link>
              </>
            ))}
          </HStack>
        </Box>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 10,
    width: "100%",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.250980406999588)",
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 9 },
    marginTop: -120,
  },
  flexcards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  card: {
    width: "22%",
    textAlign: "center",
    marginBottom: 25,
    marginHorizontal: "1.5%",
    backgroundColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imgbg: {
    width: 64,
    height: 64,
    backgroundColor: "#E5F1EF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    margin: "auto",
    marginBottom: 4,
  },
  icon: {
    width: 40,
    height: 40,
  },
  title: {
    width: "100%",
    fontSize: 12,
    // textAlign: "center",
    marginTop: 4,
  },
});

export default HomecomponentsBackup;
