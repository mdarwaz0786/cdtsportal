import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import DeviceInfo from "react-native-device-info";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { Platform } from "react-native";

const ForceUpdateContext = createContext();

export const ForceUpdateProvider = ({ children }) => {
  const [fetchingAppVersion, setFetchingAppVersion] = useState(false);
  const [appSetting, setAppSetting] = useState(null);
  const appVersion = DeviceInfo.getVersion();

  const fetchAppSetting = async () => {
    try {
      setFetchingAppVersion(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/appSetting/app-appSetting`);
      if (response?.data?.success) {
        setAppSetting(response?.data?.data?.[0] || null);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setFetchingAppVersion(false);
    };
  };

  useEffect(() => {
    fetchAppSetting();
  }, []);

  const isUpdateRequired = useMemo(() => {
    if (fetchingAppVersion || !appSetting) return false;
    if (appSetting?.status === "Disable") return false;

    if (Platform.OS === "ios") {
      return appSetting?.iosAppVersion && appSetting?.iosAppVersion !== appVersion;
    } else if (Platform.OS === "android") {
      return appSetting?.appVersion && appSetting?.appVersion !== appVersion;
    };

    return false;
  }, [fetchingAppVersion, appSetting, appVersion]);

  return (
    <ForceUpdateContext.Provider value={{ isUpdateRequired, appVersion, appSetting }}>
      {children}
    </ForceUpdateContext.Provider>
  );
};

export const useForceUpdate = () => useContext(ForceUpdateContext);
