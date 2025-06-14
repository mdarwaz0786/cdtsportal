import React, { Suspense, lazy } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";

// Lazy load the screens
const TicketScreen = lazy(() => import("../../../Screens/Ticket/TicketScreen.js"));
const TicketDetailScreen = lazy(() => import("../../../Screens/Ticket/TicketDetailScreen.js"));
const AddTicketScreen = lazy(() => import("../../../Screens/Ticket/AddTicketScreen.js"));

// Create a Stack Navigator
const Stack = createStackNavigator();

const TicketStack = () => {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <Stack.Navigator
        initialRouteName="Ticket"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Ticket" component={TicketScreen} />
        <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
        <Stack.Screen name="AddTicket" component={AddTicketScreen} />
      </Stack.Navigator>
    </Suspense>
  );
};

export default TicketStack;