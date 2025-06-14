import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../Context/auth.context.js";
import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

const Login = ({ navigation }) => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClientLogin, setIsClientLogin] = useState(false);
  const { storeToken } = useAuth();
  const userType = isClientLogin ? "Client" : "Employee";

  const handleLogin = async () => {
    setLoading(true);
    try {
      const endpoint = isClientLogin
        ? `${API_BASE_URL}/api/v1/customer/login-customer`
        : `${API_BASE_URL}/api/v1/team/login-team`;

      const loginField = isClientLogin ? "mobile" : "employeeId";
      const fcmToken = await AsyncStorage.getItem("fcmToken");

      const response = await axios.post(endpoint, {
        [loginField]: loginId,
        password,
        fcmToken,
      });

      if (response?.data?.success) {
        setLoginId("");
        setPassword("");
        const token = response?.data?.token;
        storeToken(token, userType);
        Toast.show({ type: "success", text1: "Login Successful" });
        navigation.navigate("Home");
      } else {
        Toast.show({ type: "error", text1: "Login failed. Please try again." });
      };
    } catch (error) {
      Toast.show({ type: "error", text1: error?.response?.data?.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    };
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../Assets/logo.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.heading}>Login</Text>
      <Text style={styles.subheading}>
        {isClientLogin
          ? "Login using your mobile number and password."
          : "Login using your employee ID and password."}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {isClientLogin
            ? "Mobile Number"
            : "Employee ID"}
          <Text style={styles.required}> *</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={loginId}
          onChangeText={setLoginId}
          autoComplete="off"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Password <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoComplete="off"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffb300" />
      ) : (
        <Button title="Login" onPress={handleLogin} color="#ffb300" />
      )}

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsClientLogin(!isClientLogin)}
      >
        <Text style={styles.switchText}>
          {isClientLogin
            ? "Login as Employee"
            : "Login as Client"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: "40%",
    resizeMode: "contain",
  },
  heading: {
    fontSize: 22,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subheading: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 3,
    color: "#333",
  },
  required: {
    color: "red",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    color: "#555",
    fontSize: 13,
    paddingLeft: 15,
  },
  switchButton: {
    marginVertical: 30,
    alignItems: "center",
  },
  switchText: {
    color: "#ffb300",
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline"
  },
});

export default Login;
