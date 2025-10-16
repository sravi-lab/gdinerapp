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
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Center,
  VStack,
  Text,
  Stack,
  Input,
  Button,
  NativeBaseProvider,
} from "native-base";
import Layout from "../components/Layout";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Loading from "../components/Loading";
import axios from "axios";

const Otp = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { userid } = params;
  console.log(userid);
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://172.17.58.111:3000/api/verifyotp",
        {
          otp,
          userid: userid,
        }
      );

      if (response.data.status) {
        if (response.data.type === "employee") {
          router.navigate("/staff", { user: response.data.user });
        } else if (response.data.type === "student") {
          router.navigate("/student", { user: response.data.user });
        }
      } else {
        Alert.alert("Error", "OTP verification failed. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
      console.error("API call error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout customStyle={styles.customLayout}>
            <VStack>
              <Center mt={10}>
                <Image
                  source={require("../assets/login_img.png")}
                  resizeMode="cover"
                  style={styles.bannerImg}
                />
              </Center>
              <View>
                <Center>
                  <Text fontSize="3xl" bold mb="5">
                    OTP
                  </Text>
                </Center>
                <Stack
                  direction="column"
                  mb="2.5"
                  mt="1.5"
                  space={3}
                  width={"100%"}
                  bg={"#F4F4F4"}
                >
                  <Input
                    size="lg"
                    placeholder="OTP"
                    w="full"
                    type="number"
                    keyboardType="phone-pad"
                    bg="white"
                    value={otp}
                    onChangeText={setOtp}
                  />

                  <Button
                    bg={"#005A50"}
                    mt="2"
                    onPress={handleLogin}
                    style={styles.shadwoButton}
                  >
                    Verify
                  </Button>
                </Stack>
                <Center>
                  <Text mt={4}>
                    Powered by Team{" "}
                    <Text color={"#005A50"} bold>
                      CATS, GITAM
                    </Text>
                  </Text>
                </Center>
              </View>
            </VStack>
            <StatusBar style="auto" />
          </Layout>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customLayout: {
    backgroundColor: "#F4F4F4",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerImg: {
    width: 356,
    height: 356,
    marginBottom: 24,
  },
  shadwoButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default Otp;
