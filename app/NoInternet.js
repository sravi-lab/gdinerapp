import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import NetInfo from "@react-native-community/netinfo";  
import nonet from "../assets/nonet.png";

export default function NoInternet() {
  const [isConnected, setIsConnected] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={nonet} style={styles.image} />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Please check your connection and try again.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (isConnected) router.replace("/");
        }}
      >
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  image: {
    width: 220,
    height: 180,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "400",
    width: "90%", // Prevents overflow
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderColor: "#005A50",
    borderWidth: 2,
    alignItems: "center",
  },
  buttonText: {
    color: "#005A50",
    fontSize: 16,
    fontWeight: "bold",
  },
});
