import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../../../Context/auth.context.js";

const Logout = (props) => {
  const { logOutTeam } = useAuth();

  const performLogout = () => {
    setTimeout(async () => {
      await logOutTeam();
      props.navigation.navigate("Home");
    }, 1000);
  };

  useEffect(() => {
    performLogout();
  }, [logOutTeam]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffb300" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default Logout;
