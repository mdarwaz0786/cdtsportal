import React, { Suspense, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import TodayAttendanceScreen from '../../../Screens/Notifications/TodayAttendanceScree.js';
import TodayWorkSummaryScreen from '../../../Screens/Notifications/TodayWorkSummaryScreen.js';
import UpcomingHolidaysScreen from '../../../Screens/Notifications/UpcomingHolidaysScreen.js';
import Icon from 'react-native-vector-icons/Ionicons';
import ApprovalRequestScreen from '../../../Screens/Notifications/ApprovalRequestScreen.js';
import NotificationScreen from '../../../Screens/Notifications/NotificationScreen.js';
import ClientNotificationScreen from '../../../Screens/Notifications/ClientNotificationScreen.js';
import { useAuth } from '../../../Context/auth.context.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

const NotificationHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={20} color='#ffb300' />
      </TouchableOpacity>
      <Text style={styles.headerText}>Notifications</Text>
    </View>
  );
};

const NotificationTopTab = () => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserType = async () => {
    try {
      const type = await AsyncStorage.getItem("userType");
      setUserType(type);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchUserType();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ffb300" />
      </View>
    );
  };

  const { team } = useAuth();
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <View style={{ flex: 1 }}>
        <NotificationHeader />
        <Tab.Navigator
          initialRouteName="TodayAttendance"
          backBehavior="history"
          screenOptions={{
            lazy: true,
            tabBarScrollEnabled: true,
            tabBarActiveTintColor: '#ffb300',
            tabBarInactiveTintColor: '#777',
            tabBarLabelStyle: {
              fontSize: 15,
              fontWeight: '400',
              textTransform: 'none',
            },
            tabBarStyle: {
              backgroundColor: '#fff',
              elevation: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0,
              shadowRadius: 0,
            },
            tabBarItemStyle: {
              width: "auto",
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#ffb300',
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          {
            (team?.role?.name?.toLowerCase() === "admin" || team?.role?.name?.toLowerCase() === "hr") && (
              <>
                <Tab.Screen
                  name="TodayAttendance"
                  component={TodayAttendanceScreen}
                  options={{ tabBarLabel: 'Attendance', }}
                />
                <Tab.Screen
                  name="TodayWorkSummary"
                  component={TodayWorkSummaryScreen}
                  options={{ tabBarLabel: 'Work Summary' }}
                />
                <Tab.Screen
                  name="ApprovalRequest"
                  component={ApprovalRequestScreen}
                  options={{ tabBarLabel: 'Approval' }}
                />
              </>
            )
          }
          {
            (userType === "Client") ? (
              <Tab.Screen
                name="Notification"
                component={ClientNotificationScreen}
                options={{ tabBarLabel: 'Message' }}
              />
            ) : (
              <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{ tabBarLabel: 'Message' }}
              />
            )
          }
          <Tab.Screen
            name="UpcomingHolidays"
            component={UpcomingHolidaysScreen}
            options={{ tabBarLabel: 'Holidays' }}
          />
        </Tab.Navigator>
      </View>
    </Suspense>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 12,
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffb300',
  },
});

export default NotificationTopTab;