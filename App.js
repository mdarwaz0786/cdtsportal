import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import DrawerNavigator from "./src/Navigation/Drawer/DrawerNavigator.js";
import { useAuth } from "./src/Context/auth.context.js";
import { useNetwork } from "./src/Context/network.context.js";
import NoInternet from "./src/Components/Common/NoInternet.js";
import { requestUserPermission } from "./src/Helper/notificationService.js";
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";

const App = () => {
  const { isLoading } = useAuth();
  const { isNetworkOkay } = useNetwork();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    };
  }, [isLoading]);

  // Request notification permissions
  useEffect(() => {
    const requestPermissions = async () => {
      await requestUserPermission();
    };
    requestPermissions();
  }, []);

  // Create notification channel
  useEffect(() => {
    const createNotificationChannel = async () => {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
        vibration: true,
        importance: AndroidImportance.HIGH,
      });
    };
    createNotificationChannel();
  }, []);

  // Handle foreground notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage?.notification) {
        const { notification } = remoteMessage;
        await notifee.displayNotification({
          title: notification.title || "New Notification",
          body: notification.body || "You have a new message!",
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            sound: 'default',
          },
        });
      };
    });
    return () => unsubscribe();
  }, []);

  // Handle background notifications
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      if (remoteMessage?.notification) {
        const { notification } = remoteMessage;
        await notifee.displayNotification({
          title: notification.title || "New Notification",
          body: notification.body || "You have a new message!",
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            sound: 'default',
          },
        });
      };
    });
  }, []);

  return (
    <NavigationContainer>
      {isNetworkOkay ? <DrawerNavigator /> : <NoInternet />}
    </NavigationContainer>
  );
};

export default App;
