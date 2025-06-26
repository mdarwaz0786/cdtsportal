import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import { useForceUpdate } from '../../Context/forceUpdate.context.js';

const ForceUpdate = () => {
  const { appSetting } = useForceUpdate();

  const appStoreLink = appSetting?.[0]?.appStoreLink;
  const playStoreLink = appSetting?.[0]?.playStoreLink;

  const handleUpdate = () => {
    const url = Platform.OS === 'android' ? playStoreLink : appStoreLink;
    if (url) {
      Linking.openURL(url);
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🚀 Update Required</Text>
        <Text style={styles.message}>
          A new version of the app is available. Please update to continue
          using the app without interruptions.
        </Text>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateText}>Update Now</Text>
        </TouchableOpacity>
        <Text style={styles.versionNote}>
          You can always find the latest version on the store.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 16,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 14,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  updateButton: {
    backgroundColor: '#ffb300',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 10,
    marginBottom: 12,
  },
  updateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionNote: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ForceUpdate;
