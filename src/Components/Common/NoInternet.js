import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useNetwork } from "../../Context/network.context.js";

const NoInternet = () => {
  const navigation = useNavigation();
  const { isNetworkOkay } = useNetwork();

  useEffect(() => {
    if (isNetworkOkay) {
      navigation.goBack();
    };
  }, [isNetworkOkay, navigation]);

  const handleRetry = () => {
    if (isNetworkOkay) {
      navigation.goBack();
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📡</Text>
      </View>
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Oops! It seems like you’re offline. Please check your connection and try again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0f7fa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
    color: "#00796b",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#00796b",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default NoInternet;
