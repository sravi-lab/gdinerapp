import {
    StyleSheet,
    Image,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { StatusBar } from "expo-status-bar";
  import {
    Center,
    VStack,
    Text,
    Stack,
    Input,
    Button,
    IconButton,
    Icon,
    HStack,
  } from "native-base";
  import { Ionicons } from "@expo/vector-icons";
  import Layout from "../components/Layout";
  import { useRouter } from "expo-router";
  import Loading from "../components/Loading";
  import axios from "axios";
  import { APIURl1 } from "../utilities/Apiurl";
  import { useDispatch, useSelector } from "react-redux";
  import { updateDynamicApps, userUpdate } from "../Store/Appdataslice";
  import * as Device from "expo-device";
  import * as Application from "expo-application";
  
  const Login = () => {
    const pushtoken = useSelector((state) => state.appdata.pushtoken);
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [openscreen, setOpenScreen] = useState(false);
    const [deviceid, setDeviceID] = useState("");
  
    // Fetch Device ID for Android & iOS
    useEffect(() => {
      const fetchDeviceId = async () => {
        try {
          if (Platform.OS === "android") {
            const id = await Application.getAndroidId();
            setDeviceID(id);
          } else if (Platform.OS === "ios") {
            const id = await Application.getIosIdForVendorAsync();
            setDeviceID(id);
          }
        } catch (err) {
          console.log("Error fetching device ID:", err);
        }
      };
      fetchDeviceId();
    }, []);
  
    // Login Function
    const handleLogin = async () => {
      setLoading(true);
      setError("");
  
      try {
        const pushtokenvalue = pushtoken?.data || "";
  
        const response = await axios.post(`${APIURl1}/Login`, {
          UserName: username,
          Password: password,
          pushtoken: pushtokenvalue,
          deviceid: deviceid,
        });
  
        if (response.data.status !== "failed") {
          setOpenScreen(true);
          await fetchDynamicapps(response.data.token, response.data.regdno);
  
          // Update Redux state and navigate
          dispatch(
            userUpdate({
              ...response.data.stdprofile[0],
              token: response.data.token,
              role: response.data.role,
              islogged: true,
            })
          );
  
          router.push(response.data.role === "staff" ? "/staff" : "/student");
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error("Login Error:", error);
        setError(error.response?.data?.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch Dynamic Apps
    const fetchDynamicapps = async (token, regdno) => {
      try {
        const response = await axios.get(`${APIURl1}/getdynamicapps?regdno=${regdno}`, {
          headers: { Authorization: token },
        });
        dispatch(updateDynamicApps(response.data.dynamicapps));
      } catch (err) {
        Alert.alert("Error fetching apps:", err.message);
      }
    };
  
    // Auto Redirect If Logged In
    const user = useSelector((state) => state.appdata.user);
    useEffect(() => {
      if (user.islogged) {
        router.push(user.role === "student" ? "/student" : "/staff");
      }
    }, [user]);
  
    if (openscreen) {
      return <Loading />;
    }
  
    return (
      <>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Layout customStyle={styles.customLayout}>
              <VStack w={"90%"}>
                <Center mt={8}>
                  <Image
                    source={require("../assets/gitam_logo.png")}
                    resizeMode="cover"
                    style={styles.bannerImg}
                  />
                </Center>
                <View w={"100%"}>
                  <Center>
                    <Text style={styles.title}>My-GITAM</Text>
                  </Center>
                  {error !== "" && (
                    <Center>
                      <Text bold mb="5" color={"#f00"}>
                        {error}
                      </Text>
                    </Center>
                  )}
                  <Stack
                    direction="column"
                    mb="2.5"
                    mt="1.5"
                    space={3}
                    width={"100%"}
                    bg={"#f7f0e4"}
                  >
                    <Input
                      size="lg"
                      placeholder="Student ID/ Employee ID"
                      w="full"
                      type="text"
                      bg="white"
                      value={username}
                      onChangeText={setUsername}
                    />
                    <Input
                      size="lg"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      w="full"
                      bg="white"
                      value={password}
                      onChangeText={setPassword}
                      InputRightElement={
                        <IconButton
                          icon={
                            <Icon
                              as={Ionicons}
                              name={showPassword ? "eye-off" : "eye"}
                            />
                          }
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      }
                    />
                    <Button
                      bg={"#005A50"}
                      mt="2"
                      onPress={handleLogin}
                      style={styles.shadowButton}
                      disabled={loading}
                    >
                      {loading ? "Validating...." : "Sign In"}
                    </Button>
                  </Stack>
                  <Center>
                    <HStack mt={4}>
                      <Text>Powered by </Text>
                      <Text color={"#005A50"} bold>
                        CATS
                      </Text>
                    </HStack>
                  </Center>
                </View>
              </VStack>
              <StatusBar style="auto" />
            </Layout>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 15,
    },
    customLayout: {
      backgroundColor: "#f7f0e4",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    bannerImg: {
      width: 170,
      height: 72,
      marginBottom: 24,
    },
    shadowButton: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
    },
  });
  
  export default Login;
  