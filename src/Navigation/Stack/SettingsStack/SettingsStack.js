import React, { Suspense, lazy } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";

// Lazy load the screens
const SettingsScreen = lazy(() => import("../../../Screens/Settings/SettingsScreen.js"));
const AddOfficeScreen = lazy(() => import("../../../Screens/Settings/AddOfficeScreen.js"));
const EditOfficeScreen = lazy(() => import("../../../Screens/Settings/EditOfficeScreen.js"));

// Create a Stack Navigator
const Stack = createStackNavigator();

const SettingsStack = () => {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <Stack.Navigator
        initialRouteName="Settings"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AddOffice" component={AddOfficeScreen} />
        <Stack.Screen name="EditOffice" component={EditOfficeScreen} />
      </Stack.Navigator>
    </Suspense>
  );
};

export default SettingsStack;
