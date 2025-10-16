import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";

export default function CheckInternet() {
  const [isConnected, setIsConnected] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(()=>{
    if(!isConnected){
         router.navigate("/NoInternet");
    }
  },[isConnected])
  return (
     <>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  offlineMessage: {
    position: "absolute",
    top: 50,
    width: "100%",
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
  },
  offlineText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    fontSize: 20,
  },
});
