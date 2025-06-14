import React, { Suspense, lazy } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";

// Lazy load the screens
const ProjectScreen = lazy(() => import("../../../Screens/Project/ProjectScreen.js"));
const SingleProjectScreen = lazy(() => import("../../../Screens/Project/SingleProjectScreen.js"));

// Create a Stack Navigator
const Stack = createStackNavigator();

const ProjectStack = () => {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <Stack.Navigator
        initialRouteName="Project"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Project" component={ProjectScreen} />
        <Stack.Screen name="ProjectDetail" component={SingleProjectScreen} />
      </Stack.Navigator>
    </Suspense>
  );
};

export default ProjectStack;
