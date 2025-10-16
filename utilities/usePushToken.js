import * as Notifications from "expo-notifications";
import { Platform, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { savePushToken } from "../Store/Appdataslice";

export const useNotifications = () => {
  const token1 = useSelector((state) => state.appdata.pushtoken);

  const dispatch = useDispatch();

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (token1 == null) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
         
        Alert.alert(
          "Notification Permission Required",
          "Please enable notifications to get updates from Gitam.",
          [
            {
              text: "OK",
              onPress: () => {
                
                Linking.openSettings();
              },
            },
          ]
        );
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: "eaf38149-fa9e-4ae6-89eb-a593a9300c82",
      });

      if (token.type == "expo") {
        dispatch(savePushToken(token));
      }
    }

    // Set up notification channel for Android
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  return { registerForPushNotificationsAsync };
};
