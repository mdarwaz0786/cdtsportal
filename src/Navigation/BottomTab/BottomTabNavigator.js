import React, { Suspense, lazy, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../Context/auth.context.js";
import HomeScreen from "../../Screens/Home/HomeScreen.js";
import ClientHomeScreen from "../../Screens/ClientHome/ClientHomeScreen.js";

// Lazy load the screens
const NotificationTobTab = lazy(() => import("../TopTab/NotificationTopTab/NotificationTopTab.js"),);
const CustomDrawerNavigator = lazy(() => import("../Drawer/CustomDrawerNavigator.js"));
const ProfileScreen = lazy(() => import("../../Screens/Profile/ProfileScreen.js"));
const ClientProfileScreen = lazy(() => import("../../Screens/ClientProfile/ClientProfileScreen.js"));
const LoginScreen = lazy(() => import("../../Screens/Auth/LoginScreen.js"));
const ServiceScreen = lazy(() => import("../../Screens/Service/ServiceScreen.js"));

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { isLoggedIn, isLoading, userType } = useAuth();

  const icons = {
    Home: "home-outline",
    Profile: "person-outline",
    Notifications: "notifications-outline",
    Service: "briefcase-outline",
    Menu: "menu-outline",
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ffb300" />
      </View>
    );
  };

  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <Tab.Navigator
        initialRouteName="Home"
        backBehavior="history"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            const iconName = icons[route.name];
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ffb300",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 65,
            backgroundColor: "#fff",
            paddingBottom: 8,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: "400",
          },
        })}>
        {
          (userType === "Employee") ? (
            <Tab.Screen name="Home" component={HomeScreen} />
          ) : (
            <Tab.Screen name="Home" component={ClientHomeScreen} />
          )
        }
        {
          (!isLoggedIn) ? (
            <Tab.Screen name="Profile" component={LoginScreen} options={{ tabBarLabel: "Login" }} />
          ) : (userType === "Employee") ? (
            <Tab.Screen name="Profile" component={ProfileScreen} />
          ) : (
            <Tab.Screen name="Profile" component={ClientProfileScreen} />
          )
        }
        {
          (userType === "Employee") ? (
            <Tab.Screen name="Notifications" component={NotificationTobTab} />
          ) : (
            <Tab.Screen name="Service" component={ServiceScreen} />
          )
        }
        <Tab.Screen name="Menu" component={CustomDrawerNavigator} />
      </Tab.Navigator>
    </Suspense>
  );
};

export default BottomTabNavigator;
