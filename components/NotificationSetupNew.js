import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { Alert, AppState } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const NotificationsetupNew = () => {
  const router = useRouter();
  const user = useSelector((state) => state.appdata.user);
  const pushtoken = useSelector((state) => state.appdata.pushtoken);

 
  useEffect(() => {
     const initFCM = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const fcmToken = await messaging().getToken();
         
         await subscribeToTopics(user);
      } else {
        console.log("❌ Notification permission denied");
      }
    };

    initFCM();
    messaging().setBackgroundMessageHandler(async remoteMessage => {
         console.log('📥 Message handled in the background!', remoteMessage);
       
      });
     const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
        console.log('📥 Message handled in the background!', remoteMessage);
      Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);
    });

     const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      handleNavigation(remoteMessage, user, router);
    });

     messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          handleNavigation(remoteMessage, user, router);
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);

  return null;
};

export default NotificationsetupNew;

// 🔁 Shared notification navigation handler
const handleNavigation = (remoteMessage, user, router) => {
  if (remoteMessage?.data?.screen) {
    router.navigate(remoteMessage.data.screen);
  } else {
    // Default role-based navigation
    if (user?.role === "staff") {
      router.navigate("Alerts");
    } else {
      router.navigate("Alerts");
    }
  }
};

// 📌 Helper for topic subscriptions
const subscribeToTopics = async (user) => {
  if (!user) return;
  try {
    await messaging().subscribeToTopic("all");

    if (user.role === "student") {
      await messaging().subscribeToTopic("students");
    } else if (user.role === "staff") {
      await messaging().subscribeToTopic("staff");
    }

    if (user.campus) {
      await messaging().subscribeToTopic(user.campus.toLowerCase());
    }

    if (user.branch_code) {
      await messaging().subscribeToTopic(user.branch_code.toLowerCase());
    }

    if (user.batch) {
      const batchTopic = user.batch.toLowerCase().replace(/\s+/g, "-");
      await messaging().subscribeToTopic(batchTopic);
    }

    console.log("✅ Subscribed to topics");
  } catch (error) {
    console.error("❌ Topic subscription failed:", error);
  }
};
