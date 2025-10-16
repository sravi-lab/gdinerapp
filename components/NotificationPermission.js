import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import axios from "axios";
import { useSelector } from "react-redux";
import { MOBILEAPI, MOBILEAPIKEY } from "../utilities/Apiurl";
import messaging from "@react-native-firebase/messaging";

const NotificationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const user = useSelector((state) => state.appdata.user);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  // ✅ Check Notification Permissions
  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
    
    if (status === "granted") {
      await updatePushToken(); // Update backend when permission is granted
    }
  };

  // ✅ Request Permission & Navigate to Settings if Denied
  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status === "granted") {
      
      await updatePushToken();
    } else {
      Alert.alert(
        "Permission Required",
        "Please enable notifications in settings to receive university updates.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
    }

    setPermissionStatus(status);
  };

  // ✅ Update Token in Database
  const updatePushToken = async () => {
    
    
    const pushToken = (await Notifications.getExpoPushTokenAsync({
      projectId: "eaf38149-fa9e-4ae6-89eb-a593a9300c82",
    })).data;
    
    const fcmToken = await messaging().getToken();
    
   // console.log("Push Token:", pushToken,fcmToken);
    try {
      if(user.role === "Parent"){
        var user_id = user.parent_mobile;
      }else if(user.role === "staff"){
        var user_id = user.regdno;  
      }else{
        var user_id = user.regdno;  
      }
      await axios.post(
        `${MOBILEAPI}/updatetoken`,
        { user_id: user_id, token: pushToken,fcmtoken:fcmToken },
        { headers: { Authorization: `Bearer ${MOBILEAPIKEY}` } }
      );
    } catch (error) {
      console.error("Error updating push token:", error.message);
    }
  };
 useEffect(() => {requestPermission()},[]);

  // ✅ Show Message if Permission Not Granted
  if (permissionStatus !== "granted") {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Please allow notifications to receive university updates.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Enable Notifications</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null; // If permission is granted, don't show anything
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffcc00",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
   
  },
  message: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
    width: "80%",
  },
  button: {
    marginTop: 5,
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NotificationPermission;
