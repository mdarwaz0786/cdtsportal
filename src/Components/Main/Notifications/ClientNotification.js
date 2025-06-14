import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const ClientNotification = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No notification available.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: "#555",
  },
});

export default ClientNotification;
