import React from "react";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import { StyleSheet } from "react-native";
import { SocketContextProvider } from "../gdinercomponents/Connections/Socket";
import SocketStatus from "../gdinercomponents/SocketStatus";
import MessRatingBlock from "../gdinercomponents/MessRatingBlock";

const RootLayout = () => {
  return (
   
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <SocketContextProvider>
            <NativeBaseProvider>
              <Slot />
              <StatusBar backgroundColor="#F6F6F6" />
              <MessRatingBlock/>
              <SocketStatus/>
            </NativeBaseProvider>
          </SocketContextProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default RootLayout;
