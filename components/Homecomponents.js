import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Box, Center, HStack, ScrollView, VStack } from "native-base";
import Layout from "./Layout";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { resetState, userUpdate } from "../Store/Appdataslice";
import WebView from "react-native-webview";
import WebViewPage from "./WebViewPage";

const images = {
  icon_1: require("../assets/newicons/Digital ID.png"),
  icon_2: require("../assets/newicons/Attendence.png"),
  icon_3: require("../assets/newicons/Academic.png"),
  icon_4: require("../assets/newicons/Time table.png"),
  icon_5: require("../assets/newicons/Communications.png"),
  icon_6: require("../assets/icon_6.png"),
  icon_7: require("../assets/newicons/Time table.png"),
  icon_8: require("../assets/icon_8.png"),
  icon_9: require("../assets/icon_9.png"),
  icon_10: require("../assets/icon_10.png"),
  icon_12: require("../assets/icon_12.png"),
  icon_13: require("../assets/newicons/Fee.png"),
  icon_14: require("../assets/newicons/QR.png"),
  icon_15: require("../assets/logout.png"),
  icon_16: require("../assets/newicons/Events.png"),
  icon_25: require("../assets/newicons/SOS.png"),
  icon_26: require("../assets/Approvals.png"),
  icon_27: require("../assets/gdiner.png"),
};

const Homecomponents = () => {
  const dynamicapps = useSelector((state) => state.appdata.dynamicapps);
  const user = useSelector((state) => state.appdata.user);

  const [url, setUrl] = React.useState(null);
  const [title, setTitle] = React.useState(null);

  const router = useRouter();
  const handlePress = (item) => {
    if (item.type == "W") {
      setUrl(item.url);
      setTitle(item.name);
    } else {
      router.push(item.url);
    }
  };

  const dispatch = useDispatch();

  const gotoPage = (link) => {
    router.push(link);
  };

  const logout = () => {
    dispatch(userUpdate({}));
    dispatch(resetState());
    router.navigate("/Login");
  };

  return (
    <>
      {url && (
        <WebViewPage url={url} setUrl={setUrl} title={title} location="student" />
      )}
      <Layout style={styles.main}>
        <ScrollView>
          <Box style={styles.container}>
            <HStack style={styles.gridContainer}>
              {dynamicapps
                .filter(
                  (items) =>
                    items.status === "A" && items.mode === "S"
                )
                .map((items) => {
                  if (user.hostler == "Y") var type = "H";
                  else type = "A";
                  if (items.available !== "A" && items.available !== "E" && items.available !== type)
                    return;
                  return (
                    <TouchableOpacity 
                      key={items.name} 
                      style={styles.iconCard}
                      onPress={() => handlePress(items)}
                      activeOpacity={0.7}
                    >
                      <VStack alignItems="center" space={2}>
                        <Center style={styles.iconContainer}>
                          {/^https?:\/\//.test(items.icon) ? (
                            <Image
                              source={{ uri: items.icon }}
                              style={styles.icon}
                              alt="icon"
                            />
                          ) : (
                            <Image
                              source={images[items.icon]}
                              style={styles.icon}
                            />
                          )}
                        </Center>
                        <Text style={styles.iconLabel}>{items.name}</Text>
                      </VStack>
                    </TouchableOpacity>
                  );
                })}
            </HStack>
          </Box>
        </ScrollView>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#fff",
  },
  container: {
    padding: 10,
    paddingTop: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconCard: {
    width: "30%",
    marginBottom: 30,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f9f7",
    alignItems: "center",
    justifyContent: "center", 
    elevation: 3,
    marginBottom: 8,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: "#007367", // Teal color for the icons
  },
  iconLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    lineHeight: 16,
    maxWidth: 80,
    marginTop: -7
  },
});

export default Homecomponents;