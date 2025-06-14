import "react-native-gesture-handler";
import "react-native-reanimated";
import { AppRegistry, StatusBar, StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./App.js";
import { name as appName } from "./app.json";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./src/Context/auth.context.js";
import { RefreshProvider } from "./src/Context/refresh.context.js";
import { NetworkProvider } from "./src/Context/network.context.js";

// Custom Toast Configuration
const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.toastWrapper]}>
      <View style={[styles.toastContainer, styles.successToast]}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={[styles.toastWrapper]}>
      <View style={[styles.toastContainer, styles.errorToast]}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
      </View>
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View style={[styles.toastWrapper]}>
      <View style={[styles.toastContainer, styles.infoToast]}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
      </View>
    </View>
  ),
};

const Main = () => (
  <SafeAreaProvider>
    <AuthProvider>
      <RefreshProvider>
        <NetworkProvider>
          <PaperProvider>
            <App />
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
            <Toast config={toastConfig} />
          </PaperProvider>
        </NetworkProvider>
      </RefreshProvider>
    </AuthProvider>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  toastWrapper: {
    position: "absolute",
    top: 48,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toastContainer: {
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    maxWidth: "100%",
    alignItems: "center",
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 5,
  },
  toastMessage: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  successToast: {
    backgroundColor: "#4caf50",
  },
  errorToast: {
    backgroundColor: "#f44336",
  },
  infoToast: {
    backgroundColor: "#2196f3",
  },
});

AppRegistry.registerComponent(appName, () => Main);
