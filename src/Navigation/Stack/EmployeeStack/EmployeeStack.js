import React, { Suspense, lazy } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";

// Lazy load the screens
const EmployeeScreen = lazy(() => import("../../../Screens/Employee/EmployeeScreen.js"));
const SalaryScreen = lazy(() => import("../../../Screens/Salary/SalaryScreen.js"));
const PaySalaryScreen = lazy(() => import("../../../Screens/Salary/PaySalaryScreen.js"));
const AttendanceScreen = lazy(() => import("../../../Screens/Attendance/AttendanceScreen.js"));

// Create a Stack Navigator
const Stack = createStackNavigator();

const EmployeeStack = () => {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <Stack.Navigator
        initialRouteName="Employee"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Employee" component={EmployeeScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="Salary" component={SalaryScreen} />
        <Stack.Screen name="PaySalary" component={PaySalaryScreen} />
      </Stack.Navigator>
    </Suspense>
  );
};

export default EmployeeStack;
