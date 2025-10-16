import React, { useEffect } from "react";
import '../global.css';
import Login from "./Login";
import { NativeBaseProvider, ScrollView, StatusBar } from "native-base";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
 import { Provider, useDispatch, useSelector } from "react-redux";
import { persistor, store } from "../Store/Store";
import { PersistGate } from "redux-persist/integration/react";
import { Slot } from "expo-router";
import Notificationsetup from "../components/Notificationsetup";
import * as Notifications from "expo-notifications";
import { StyleSheet } from "react-native";
import CheckInternet from "../components/CheckInternet";
import NotificationsetupNew from "../components/NotificationSetupNew";
import { SocketContextProvider } from "../utilities/SocketContext";
 const RootLayout = () => {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);
   
  return (
    <>
      <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <SocketContextProvider>
            <NativeBaseProvider>
              <Notificationsetup />
              <NotificationsetupNew/>
              <CheckInternet/>
              <Slot />
              
            
              <StatusBar backgroundColor="#F6F6F6" />
            </NativeBaseProvider>
            </SocketContextProvider>
          </PersistGate>
        </Provider> 
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
export default RootLayout;
