import React, { createContext, useState, useContext } from "react";

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshPage = () => setRefreshKey((prev) => prev + 1);

  return (
    <RefreshContext.Provider value={{ refreshKey, refreshPage }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);
