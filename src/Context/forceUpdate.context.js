import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import DeviceInfo from "react-native-device-info";
import { API_BASE_URL } from "@env";
import axios from "axios";

const ForceUpdateContext = createContext();

export const ForceUpdateProvider = ({ children }) => {
  const [fetchingAppVersion, setFetchingAppVersion] = useState(true);
  const [appSetting, setAppSetting] = useState([]);
  const appVersion = DeviceInfo.getVersion();

  const fetchAppSetting = async () => {
    try {
      setFetchingAppVersion(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/appSetting/app-appSetting`);
      if (response?.data?.success) {
        setAppSetting(response?.data?.data);
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
    const serverVersion = appSetting?.[0]?.appVersion;
    return !fetchingAppVersion && !!serverVersion && serverVersion !== appVersion;
  }, [fetchingAppVersion, appSetting, appVersion]);

  return (
    <ForceUpdateContext.Provider value={{ isUpdateRequired, appVersion, appSetting }}>
      {children}
    </ForceUpdateContext.Provider>
  );
};

export const useForceUpdate = () => useContext(ForceUpdateContext);