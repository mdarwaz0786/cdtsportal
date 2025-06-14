import React, { createContext, useState, useEffect, useContext } from "react";
import NetInfo from "@react-native-community/netinfo";

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [hasInternet, setHasInternet] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setHasInternet(state.isInternetReachable);
    });
    return () => unsubscribe();
  }, []);

  const isNetworkOkay = isConnected && hasInternet;

  return (
    <NetworkContext.Provider value={{ isNetworkOkay, isConnected, hasInternet }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
