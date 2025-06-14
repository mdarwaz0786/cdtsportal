import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [team, setTeam] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = !!token;
  const validToken = token ? `Bearer ${token}` : null;

  const storeToken = async (serverToken, user) => {
    try {
      await Promise.all([
        AsyncStorage.setItem("token", serverToken),
        AsyncStorage.setItem("userType", user),
      ]);
      initializeAuth();
    } catch (error) {
      Toast.show({ type: "error", text1: "Login failed. Please try again." });
    };
  };

  const logOutTeam = async () => {
    try {
      setToken(null);
      setTeam(null);
      setUserType(null);
      await Promise.all([
        AsyncStorage.removeItem("token"),
        AsyncStorage.removeItem("userType"),
        AsyncStorage.removeItem("team"),
      ]);
      Toast.show({ type: "success", text1: "Logout successful" });
      initializeAuth();
    } catch (error) {
      Toast.show({ type: "error", text1: "Logout failed. Please try again." });
    };
  };

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const [storedToken, storedUserType] = await AsyncStorage.multiGet(["token", "userType"]);
      if (storedToken[1] && storedUserType[1]) {
        setToken(storedToken[1]);
        setUserType(storedUserType[1])
        refreshTeamData(storedToken[1], storedUserType[1]);
      } else {
        setToken(null);
        setTeam(null);
        setUserType(null);
        Toast.show({ type: "info", text1: "Login to continue" });
      };
    } catch (error) {
      console.log("Error:", error?.message);
    } finally {
      setIsLoading(false);
    };
  };

  const refreshTeamData = async (token, user) => {
    try {
      let response;
      if (user === "Client") {
        response = await axios.get(`${API_BASE_URL}/api/v1/customer/loggedin-customer`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (user === "Employee") {
        response = await axios.get(`${API_BASE_URL}/api/v1/team/loggedin-team`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      };

      if (response?.data?.success) {
        const newTeam = response?.data?.team;
        setTeam(newTeam);
        await AsyncStorage.setItem("team", JSON.stringify(newTeam));
      };
    } catch (error) {
      console.log("Error while refreshing user data:", error?.response?.data?.message);
    };
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const value = {
    storeToken,
    logOutTeam,
    isLoggedIn,
    team,
    setTeam,
    isLoading,
    validToken,
    userType,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};