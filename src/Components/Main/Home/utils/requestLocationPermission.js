import { PermissionsAndroid, Alert, Linking } from "react-native";

// Get location permission from user
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "This app needs access to your location to provide location-based features.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        "Permission Required",
        "Location permission is required to use this feature. Please enable it in the app settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    } else {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to use this feature. Please try again.",
      );
      return false;
    };
  } catch (error) {
    return false;
  };
};

export default requestLocationPermission;
