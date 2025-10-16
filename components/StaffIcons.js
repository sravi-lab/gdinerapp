import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Box, Center, Divider, HStack, ScrollView, VStack } from "native-base";
import Layout from "./Layout";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { resetState, userUpdate } from "../Store/Appdataslice";
import WebView from "react-native-webview";
import WebViewPage from "./WebViewPage";
import TodayBiomatric from "./StaffComponents/TodayBiomatric";
import TimeInOut from "./TimeInOut";
import { STAFFKEY, STAFFURL } from "../utilities/Apiurl";
import axios from "axios";

const images = {
  icon_1: require("../assets/newicons/Digital ID.png"),
  icon_2: require("../assets/newicons/Attendence.png"),
  icon_3: require("../assets/newicons/Payslip.png"),
  icon_4: require("../assets/newicons/Health card.png"),
  icon_5: require("../assets/newicons/Communications.png"),
  icon_6: require("../assets/newicons/Events.png"),
  icon_7: require("../assets/newicons/Leaves.png"),
  icon_8: require("../assets/icons/idcard.png"),
  icon_9: require("../assets/icons/healthcard.png"),
  icon_10: require("../assets/icons/policies.png"),
  icon_11: require("../assets/icons/policies.png"),
  icon_12: require("../assets/icon_12.png"),
  icon_14: require("../assets/qrcode.png"),
  icon_15: require("../assets/logout.png"),
  icon_19: require("../assets/newicons/Approvals.png"),
  icon_20: require("../assets/Biometric.png"),
  icon_21: require("../assets/newicons/Directory.png"),
  icon_22: require("../assets/newicons/Events.png"),
  icon_25: require("../assets/newicons/SOS.png"),
  icon_27: require("../assets/newicons/G diner.png"),
};

const StaffIcons = () => {
  const dynamicapps = useSelector((state) => state.appdata.dynamicapps);
  const user = useSelector((state) => state.appdata.user);
  const [emp_type, setEmpType] = React.useState('');
  const [url, setUrl] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [approvals, setApprovals] = React.useState('A');
  const router = useRouter();

  const handlePress = (item) => {
    if (item.type === "W") {
      setUrl(item.url);  
      setTitle(item.name);
    } else {
      router.push(item.url);
    }
  };

  const dispatch = useDispatch();
  const router1 = useRouter();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const live = `${STAFFURL}/CheckAuthorization?userid=` + user.regdno;
        const response = await axios.get(live, {
          headers: { APIKey: STAFFKEY },
        });
        if (response.data === 'Authorization') {
          setApprovals('H');
        } else {
          setApprovals('A');
        }
      } catch (err) {
        console.log(err);
        Alert.alert(err.message);
        setApprovals('A');
      }
    };
    fetchLeaves();
  }, []); 

  const gotoPage = (link) => {
    router.push(link);
  };

  const logout = () => {
    dispatch(userUpdate({}));
    dispatch(resetState());
    router.navigate("/Login");
  };

  useEffect(() => {
    if (user.emp_type === 'TC' || user.emp_type === 'TP') {
      setEmpType("T");
    } else {
      setEmpType("NT");
    }
  }, [user.emp_type]);

  return (
    <>
      {url && (<WebViewPage title={title} url={url} setUrl={setUrl} location="staff" />)}

      <Layout style={styles.main}>
        <ScrollView>
          <Box style={styles.container}>
            <HStack style={styles.gridContainer}>
              {dynamicapps.filter((items) => 
                items.status === "A" && items.mode === "F" 
              ).map((items) => {
                if (items.available !== "A" &&  items.available !== "E" &&  items.available !== approvals && items.available !== emp_type) return;
                return (
                  <TouchableOpacity 
                    key={items.name} 
                    style={styles.iconCard}
                    onPress={() => handlePress(items)}
                    activeOpacity={0.7}
                  >
                    <VStack alignItems="center" space={2}>
                      <Center style={styles.iconContainer}>
                        {items.type === "W" ? 
                          <Image source={{ uri: items.icon }} style={styles.icon} alt="icon" /> : 
                          <Image source={images[items.icon]} style={styles.icon} />
                        }
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
    marginBottom: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f9f7",
    alignItems:"center",
    justifyContent:"center", 
    elevation: 1,
    marginBottom: 8,
  },
  icon: {
    width: 35,
    height: 35,
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
    marginTop:-7
  },
});

export default StaffIcons;