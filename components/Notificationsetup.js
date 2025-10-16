import { useEffect } from "react";
import { useNotifications } from "../utilities/usePushToken";
import * as Notifications from "expo-notifications";
 import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const Notificationsetup = () => {
  const { registerForPushNotificationsAsync } = useNotifications();
  const router = useRouter();
  const user = useSelector((state) => state.appdata.user);

  useEffect(() => {
    registerForPushNotificationsAsync();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        
      }),
    });
 
     
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      if(user.role=='staff'){
        router.navigate("staff/Communications");
      }else{
         router.navigate("student/Communications");
      }
});

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return null;
};

export default Notificationsetup;
