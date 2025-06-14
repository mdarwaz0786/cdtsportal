import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/auth.context.js";
import Logo from "../../Assets/logo.png";

const CustomDrawerNavigator = ({ navigation }) => {
  const { team, isLoggedIn, isLoading, logOutTeam, userType } = useAuth();
  const fieldPermissions = team?.role?.permissions?.attendance?.fields;

  const handleLogout = () => {
    logOutTeam();
    navigation.navigate("Home");
  };

  const drawerItems = [
    {
      label: "Employee",
      icon: "person-outline",
      route: "EmployeeStack",
      resetScreen: "Employee",
      show: fieldPermissions?.employee?.show,
    },
    {
      label: "Holiday",
      icon: "sunny-outline",
      route: "HolidayStack",
      resetScreen: "Holiday",
      show: fieldPermissions?.holiday?.show,
    },
    {
      label: "Settings",
      icon: "settings-outline",
      route: "SettingsStack",
      resetScreen: "Settings",
      show: fieldPermissions?.settings?.show,
    },
    {
      label: "Salary Slip",
      icon: "receipt-outline",
      route: "SalarySlip",
      show: fieldPermissions?.salarySlip?.show,
    },
    {
      label: "Leave Balance",
      icon: "wallet-outline",
      route: "LeaveBalance",
      show: fieldPermissions?.leaveBalance?.show,
    },
    {
      label: "Write Work Summary",
      icon: "create-outline",
      route: "AddWorkSummary",
      show: fieldPermissions?.writeWorkSummary?.show,
    },
    {
      label: "Apply For Leave",
      icon: "calendar-outline",
      route: "ApplyLeaveRequest",
      show: fieldPermissions?.applyLeave?.show,
    },
    {
      label: "Apply For Missed Punch Out",
      icon: "time-outline",
      route: "ApplyMissedPunchOut",
      show: fieldPermissions?.applyMissedPunchOut?.show,
    },
    {
      label: "Apply For Late Punch In",
      icon: "alarm-outline",
      route: "ApplyLatePunchIn",
      show: fieldPermissions?.applyLatePunchIn?.show,
    },
    {
      label: "Apply For Comp Off",
      icon: "bed-outline",
      route: "ApplyCompOff",
      show: fieldPermissions?.applyCompOff?.show,
    },
    {
      label: "Project",
      icon: "folder-open-outline",
      route: "ProjectStack",
      show: fieldPermissions?.project?.show,
    },
    {
      label: "Tax Invoice",
      icon: "file-tray-outline",
      route: "TaxInvoice",
      show: fieldPermissions?.taxInvoice?.show,
    },
    {
      label: "Proforma Invoice",
      icon: "document-text-outline",
      route: "ProformaInvoice",
      show: fieldPermissions?.proformaInvoice?.show,
    },
    {
      label: "Ticket",
      icon: "chatbubble-outline",
      route: "TicketStack",
      show: fieldPermissions?.ticket?.show,
    },
    {
      label: "Service",
      icon: "briefcase-outline",
      route: "Service",
      show: (userType === "Employee" && isLoggedIn) ? true : false,
    },
    {
      label: "About Us",
      icon: "information-circle-outline",
      route: "About",
      show: true,
    },
    {
      label: "Contact Us",
      icon: "call-outline",
      route: "Contact",
      show: true,
    },
    {
      label: "Help & Support",
      icon: "help-circle-outline",
      route: "Help",
      show: true,
    },
  ];

  // Filter drawer items based on the permission
  const visibleDrawerItems = drawerItems.filter((item) => item.show);

  const handleNavigation = (item) => {
    if (item.resetScreen) {
      navigation.navigate(item.route, { screen: item.resetScreen });
    } else {
      navigation.navigate(item.route);
    };
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ffb300" />
      </View>
    );
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={Logo} style={styles.logo} />
        </TouchableOpacity>
        {isLoggedIn && (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="log-out-outline" size={24} color="#ffb300" />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.sidebar}>
          {visibleDrawerItems.map((item, index) => (
            <View key={index}>
              <View style={styles.separator} />
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleNavigation(item)}>
                <Icon name={item.icon} size={22} color="#ffb300" />
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingLeft: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
    paddingTop: 10,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  logoutButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  sidebar: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingVertical: 12,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#777",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
});

export default CustomDrawerNavigator;
