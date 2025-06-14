import Geolocation from "react-native-geolocation-service";
import requestLocationPermission from "./requestLocationPermission.js";
import Toast from "react-native-toast-message";

// Get current location of the user
const getUserLocation = async () => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    Toast.show({ type: "error", text1: "Location permission is required to proceed." });
    return null;
  };

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        console.log(error.code, error.message);
        reject(new Error(error.message));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
};

export default getUserLocation;
