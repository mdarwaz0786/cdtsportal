import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform, Alert } from "react-native";

export async function requestUserPermission() {
  try {
    if (Platform.OS === "android") {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          await getFcmToken();
        } else {
          Alert.alert("Permission Required", "Notification permission denied.");
        };
      } else {
        await getFcmToken();
      };
    } else if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: true,
        sound: true,
      });

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        await getFcmToken();
      } else {
        Alert.alert(
          "Permission Required",
          "Notifications are disabled. Please enable them in Settings."
        );
      };
    };
  } catch (error) {
    console.log("Permission error:", error.message);
  };
};

const getFcmToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!!fcmToken) {
      return;
    } else {
      fcmToken = await messaging().getToken();
      await AsyncStorage.setItem('fcmToken', fcmToken);
    };
  } catch (error) {
    console.log('Error during generating fcm token:', error.message);
  };
};

