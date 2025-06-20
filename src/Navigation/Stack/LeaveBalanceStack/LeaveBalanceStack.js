import React, { Suspense, lazy } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import LeaveBalance from "../../../Components/Main/LeaveBalance/LeaveBalance.js";
import LeaveLedger from "../../../Components/Main/LeaveBalance/LeaveLedger.js";

// Create a Stack Navigator
const Stack = createStackNavigator();

const LeaveBalanceStack = () => {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <Stack.Navigator
        initialRouteName="LeaveBalance"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LeaveBalance" component={LeaveBalance} />
        <Stack.Screen name="LeaveLedger" component={LeaveLedger} />
      </Stack.Navigator>
    </Suspense>
  );
};

export default LeaveBalanceStack;
