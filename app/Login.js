import {
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ImageBackground,
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
  ScrollView,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Layout from "../components/Layout";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import axios from "axios";
import { APIURl1, getLocationInfo } from "../utilities/Apiurl";
import { useDispatch, useSelector } from "react-redux";
import { updateChildren, updateDynamicApps, updateLocation, userUpdate } from "../Store/Appdataslice";
import * as Device from "expo-device";
import * as Application from "expo-application";

// Import Images
import student from '../assets/student_v.png';
import staff from '../assets/Staff.png';
import parent from '../assets/parent.png';

// Mapping images to roles
const roleImages = {
  student,
  staff,
  parent,
};

const Login = () => {
  const pushtoken = useSelector((state) => state.appdata.pushtoken);
  const router = useRouter();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openscreen, setOpenScreen] = useState(false);
  const [deviceid, setDeviceID] = useState("");
  const [selectedRole, setSelectedRole] = useState("student"); // default role

  // Fetch Device ID
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

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const pushtokenvalue = pushtoken?.data || "";
 
      const response = await axios.post(`${APIURl1}/Loginnew`, {
        UserName: username,
        Password: password,
        pushtoken: pushtokenvalue,
        deviceid: deviceid,
        type: selectedRole, // Pass role to backend if required
      });
       if (response.data.status !== "failed") {
        setOpenScreen(true);
        await fetchDynamicapps(response.data.token, response.data.regdno);
    var rr=await getLocationInfo(response.data.stdprofile[0].campus);
        dispatch(updateLocation({...rr}));
        dispatch(updateChildren(response.data.childrens))
        dispatch(
          userUpdate({
            ...response.data.stdprofile[0],
            token: response.data.token,
            role: response.data.role,
            islogged: true,
          })
        );
  
  router.push("/gdiner");
 
        // router.push(response.data.role === "staff" ? "/staff" : "/student");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error.response);
      setError(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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

  const user = useSelector((state) => state.appdata.user);
  useEffect(() => {
    if (user.islogged) {
      router.push("/gdiner");
      //router.push(user.role === "student" ? "/student" : "/staff");
    }
  }, [user]);

  if (openscreen) {
    return <Loading />;
  }

  return (
   
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      ><StatusBar style="auto" backgroundColor="#007367"/>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={require('../assets/loginbg.png')}
            style={styles.background}
            resizeMode="cover"
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <Center mt={8}>
                <Image
                  source={require("../assets/gitam_logo_w.png")}
                  resizeMode="cover"
                  style={styles.bannerImg}
                />
              </Center>
    
              {/* Dynamic Image Based on Role */}
              <Center mt={8}>
                <Image
                  source={roleImages[selectedRole]}
                  resizeMode="cover"
                  style={styles.coverimg}
                />
              </Center>
    
              {/* Scrollable Layout */}
              <Layout customStyle={styles.customLayout}>
                <VStack w={"90%"}>
                  <Center>
                    <VStack space={1} alignItems={"center"}>
                      <Text style={styles.title}>My-GITAM</Text>
                      <Text style={styles.title1}>
                        Please login with My-GITAM credentials
                      </Text>
                    </VStack>
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
                    {/* Role Selection Buttons */}
                    <HStack space={4}>
                      {["student", "staff","parent"].map((role) => (
                        <Button
                          key={role}
                          size={"sm"}
                          variant={"outline"}
                          style={[
                            styles.btn,
                            selectedRole === role ? styles.btnactive : {},
                          ]}
                          onPress={() => setSelectedRole(role)}
                        >
                          <Text
                            style={[
                              styles.btntext,
                              selectedRole === role ? styles.btnactivetext : {},
                            ]}
                          >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </Text>
                        </Button>
                      ))}
                    </HStack>
    {selectedRole=="parent" ? <>
      <Input
                      size="lg"
                      placeholder="Enter Student ID"
                      w="full"
                      type="text"
                      bg="white"
                      style={styles.input}
                      value={username}
                      onChangeText={setUsername}
                    />
                    <Input
                      size="lg"
                      placeholder="Parent Mobile No"
                      type="text"
                      w="full"
                      bg="white"
                      value={password}
                      onChangeText={setPassword}
                    
                    />
    </>:<>
                    <Input
                      size="lg"
                      placeholder={selectedRole=="student" ? "Enter Student ID" : "Enter Employee ID"}
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
                    /></>}
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
                </VStack>
              </Layout>
    
              
            </ScrollView>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
    
 
};

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  container: { flex: 1 },
  coverimg: { width: "50%", height: 200, marginBottom: -10 },
  title: { fontSize: 21, fontWeight: "700", marginBottom: 10, textAlign: "center" },
  title1: { fontSize: 16, marginBottom: 25, textAlign: "center" },
  customLayout: { backgroundColor: "#f7f0e4", flex: 1, alignItems: "center", justifyContent: "center", borderTopLeftRadius: 40, borderTopRightRadius: 40 },
  bannerImg: { width: 130, height: 55, marginBottom: 24 },
  btn: { width: "30%", borderColor: "#ccc", borderRadius: 20 },
  btntext: { color: "#ccc", fontSize: 16 },
  btnactive: { borderColor: "#005A50", borderWidth: 2 },
  btnactivetext: { color: "#005A50", fontWeight: "700" },
  shadowButton: { elevation: 5 },
});

export default Login;
