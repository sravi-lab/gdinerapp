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
  TouchableOpacity,
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
      className="flex-1"
    >
      <StatusBar style="auto" backgroundColor="#007367"/>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require('../assets/loginbg.png')}
          className="flex-1"
          resizeMode="cover"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            className="flex-1"
          >
            {/* Header Logo */}
            <View className="items-center mt-16">
              <Image
                source={require("../assets/gitam_logo_w.png")}
                resizeMode="cover"
                className="w-32 h-14"
              />
            </View>

            {/* Dynamic Image Based on Role */}
            <View className="items-center mt-8">
              <Image
                source={roleImages[selectedRole]}
                resizeMode="cover"
                className="w-48 h-48"
              />
            </View>

            {/* Login Form */}
            <View className="flex-1 bg-amber-50 rounded-t-3xl mt-8 px-6 pt-8">
              <View className="items-center mb-6">
                <Text className="text-2xl font-bold text-gray-800 mb-2">My-GITAM</Text>
                <Text className="text-base text-gray-600 text-center">
                  Please login with My-GITAM credentials
                </Text>
              </View>

              {error !== "" && (
                <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <Text className="text-red-600 text-center font-medium">{error}</Text>
                </View>
              )}

              {/* Role Selection */}
              <View className="flex-row justify-between mb-6">
                {["student", "staff", "parent"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() => setSelectedRole(role)}
                    className={`flex-1 mx-1 py-3 rounded-2xl border-2 ${
                      selectedRole === role
                        ? "bg-primary-500 border-primary-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        selectedRole === role ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Input Fields */}
              <View className="space-y-4">
                {selectedRole === "parent" ? (
                  <>
                    <View className="bg-white rounded-xl border border-gray-200">
                      <Input
                        placeholder="Enter Student ID"
                        value={username}
                        onChangeText={setUsername}
                        className="text-base"
                        variant="unstyled"
                        px={4}
                        py={3}
                      />
                    </View>
                    <View className="bg-white rounded-xl border border-gray-200">
                      <Input
                        placeholder="Parent Mobile No"
                        value={password}
                        onChangeText={setPassword}
                        className="text-base"
                        variant="unstyled"
                        px={4}
                        py={3}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <View className="bg-white rounded-xl border border-gray-200">
                      <Input
                        placeholder={selectedRole === "student" ? "Enter Student ID" : "Enter Employee ID"}
                        value={username}
                        onChangeText={setUsername}
                        className="text-base"
                        variant="unstyled"
                        px={4}
                        py={3}
                      />
                    </View>
                    <View className="bg-white rounded-xl border border-gray-200">
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChangeText={setPassword}
                        className="text-base"
                        variant="unstyled"
                        px={4}
                        py={3}
                        InputRightElement={
                          <IconButton
                            icon={
                              <Icon
                                as={Ionicons}
                                name={showPassword ? "eye-off" : "eye"}
                                color="gray.400"
                              />
                            }
                            onPress={() => setShowPassword(!showPassword)}
                            mr={2}
                          />
                        }
                      />
                    </View>
                  </>
                )}

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={loading}
                  className={`py-4 rounded-xl mt-6 ${
                    loading ? "bg-gray-400" : "bg-primary-600"
                  } shadow-lg`}
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    {loading ? "Validating..." : "Sign In"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View className="items-center mt-8 mb-6">
                <Text className="text-gray-600">
                  Powered by <Text className="text-primary-600 font-bold">CATS</Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;