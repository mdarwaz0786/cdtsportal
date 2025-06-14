import React, { Suspense, lazy } from "react";
import { ActivityIndicator, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "../BottomTab/BottomTabNavigator.js";

// Lazy load the screens
const EmployeeStack = lazy(() => import("../Stack/EmployeeStack/EmployeeStack.js"));
const HolidayStack = lazy(() => import("../Stack/HolidayStack/HolidayStack.js"));
const SettingsStack = lazy(() => import("../Stack/SettingsStack/SettingsStack.js"));
const LeaveBalance = lazy(() => import("../../Components/Main/LeaveBalance/LeaveBalance.js"));
const AddWorkSummary = lazy(() => import("../../Components/Main/AddWorkSummary/AddWorkSummary.js"));
const SalarySlip = lazy(() => import("../../Components/Main/SalarySlip/SalarySlip.js"));
const ApplyLeaveRequestScreen = lazy(() => import("../../Screens/LeaveRequest/ApplyLeaveRequestSceeen.js"));
const MyAttendanceScreen = lazy(() => import("../../Components/Main/Attendance/MyAttendance.js"));
const ApplyMissedPunchOut = lazy(() => import("../../Components/Main/ApplyMissedPunchOut/ApplyMissedPunchout.js"));
const ApplyLatePunchIn = lazy(() => import("../../Components/Main/ApplyLatePunchIn/ApplyLatePunchIn.js"));
const ApplyCompOff = lazy(() => import("../../Components/Main/ApplyCompOff/ApplyCompOff.js"));
const ProjectStack = lazy(() => import("../Stack/ProjectStack/ProjectStack.js"));
const TaxInvoice = lazy(() => import("../../Components/Main/TaxInvoice/TaxInvoice.js"));
const ProformaInvoice = lazy(() => import("../../Components/Main/ProformaInvoive/ProformaInvoice.js"));
const TicketStack = lazy(() => import("../Stack/TicketStack/TicketStack.js"));
const ServiceScreen = lazy(() => import("../../Screens/Service/ServiceScreen.js"));
const ContactUsScreen = lazy(() => import("../../Screens/ContactUs/ContactUsScreen.js"));
const AboutUsScreen = lazy(() => import("../../Screens/AboutUs/AboutUsScreen.js"));
const HelpScreen = lazy(() => import("../../Screens/Help/HelpScreen.js"));
const LoginScreen = lazy(() => import("../../Screens/Auth/LoginScreen.js"));
const LogoutScreen = lazy(() => import("../../Screens/Auth/LogoutScreen.js"));

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <Drawer.Navigator
        initialRouteName="BottomTabNavigator"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          swipeEnabled: false,
        }}>
        <Drawer.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
        <Drawer.Screen name="EmployeeStack" component={EmployeeStack} />
        <Drawer.Screen name="HolidayStack" component={HolidayStack} />
        <Drawer.Screen name="SettingsStack" component={SettingsStack} />
        <Drawer.Screen name="LeaveBalance" component={LeaveBalance} />
        <Drawer.Screen name="AddWorkSummary" component={AddWorkSummary} />
        <Drawer.Screen name="SalarySlip" component={SalarySlip} />
        <Drawer.Screen name="ApplyLeaveRequest" component={ApplyLeaveRequestScreen} />
        <Drawer.Screen name="MyAttendance" component={MyAttendanceScreen} />
        <Drawer.Screen name="ApplyMissedPunchOut" component={ApplyMissedPunchOut} />
        <Drawer.Screen name="ApplyLatePunchIn" component={ApplyLatePunchIn} />
        <Drawer.Screen name="ApplyCompOff" component={ApplyCompOff} />
        <Drawer.Screen name="ProjectStack" component={ProjectStack} />
        <Drawer.Screen name="TaxInvoice" component={TaxInvoice} />
        <Drawer.Screen name="ProformaInvoice" component={ProformaInvoice} />
        <Drawer.Screen name="TicketStack" component={TicketStack} />
        <Drawer.Screen name="Service" component={ServiceScreen} />
        <Drawer.Screen name="About" component={AboutUsScreen} />
        <Drawer.Screen name="Contact" component={ContactUsScreen} />
        <Drawer.Screen name="Help" component={HelpScreen} />
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Logout" component={LogoutScreen} />
      </Drawer.Navigator>
    </Suspense>
  );
};

export default DrawerNavigator;
