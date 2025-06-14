import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import formatTimeWithAmPm from "../../../Helper/formatTimeWithAmPm.js";
import formatTimeToHoursMinutes from "../../../Helper/formatTimeToHoursMinutes.js";
import getGreeting from "../../../Helper/generateGreeting.js";
import isWithinOfficeLocation from "./utils/isWithinOfiiceLocation.js";
import getUserLocation from "./utils/getUerLocation.js";
import getAttendanceData from "./utils/getAttendanceData.js";
import formatDate from "../../../Helper/formatDate.js";

const Home = () => {
  const navigation = useNavigation();
  const { team, validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [attendance, setAttendance] = useState([]);
  const [monthlyStatistic, setMonthlyStatistic] = useState();
  const [currentMonth, setCurrentMonth] = useState();
  const [currentDate, setCurrentDate] = useState();
  const [employeeId, setEmployeeId] = useState();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (team) {
      setEmployeeId(team?._id);

      const istDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      setCurrentDate(istDate);
      setCurrentMonth(istDate.slice(0, 7));
    };
  }, [team]);

  // Fetch attendance and monthly statistic
  const fetchData = useCallback(async () => {
    if (employeeId && validToken) {
      await fetchAttendance();
      await fetchMonthlyStatistic();
    };
  }, [employeeId, validToken, currentDate, currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // Fetch today's attedance
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = { date: currentDate, employeeId };
      const response = await axios.get(`${API_BASE_URL}/api/v1/newAttendance/all-newAttendance`, {
        params,
        headers: { Authorization: validToken },
      });

      if (response?.data?.success) {
        setAttendance(response?.data?.attendance);
      };
    } catch (error) {
      console.log("Error:", error?.response?.data?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  // Fetch monthly statistic
  const fetchMonthlyStatistic = async () => {
    try {
      setLoading(true);
      const params = { month: currentMonth, employeeId };
      const response = await axios.get(`${API_BASE_URL}/api/v1/newAttendance/monthly-newStatistic`, {
        params,
        headers: { Authorization: validToken },
      });

      if (response?.data?.success) {
        setMonthlyStatistic(response?.data?.monthlyStatics);
      };
    } catch (error) {
      console.log("Error:", error?.response?.data?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  // Handle punch attendance
  const handlePunchAction = useCallback(async (actionType) => {
    try {
      const position = await getUserLocation();

      if (!position) {
        Toast.show({ type: "error", text1: "Location permission is required to proceed." });
        return;
      };

      const { latitude, longitude } = position;

      const isWithinOffice = await isWithinOfficeLocation(latitude, longitude, validToken);

      if (!isWithinOffice) {
        Toast.show({ type: "error", text1: "Attendance can only be marked in office." });
        return;
      };

      const { time, date, employeeId } = getAttendanceData(team);

      if (!time || !date || !employeeId) {
        Toast.show({ type: "error", text1: "Please try agian" });
        return;
      };

      const requestData = actionType === "punchIn"
        ? { employee: employeeId, attendanceDate: date, punchInTime: time, punchInLaitude: latitude, punchInLongitude: longitude }
        : { employee: employeeId, attendanceDate: date, punchOutTime: time, PunchOutLaitude: latitude, PunchOutLongitude: longitude };

      const apiMethod = actionType === "punchIn"
        ? "post"
        : "put";

      const apiEndpoint = actionType === "punchIn"
        ? "create-newAttendance"
        : "update-newAttendance";

      const successMessage = actionType === "punchIn"
        ? "Punch in successful"
        : "Punch out successful";

      await processAttendance(apiMethod, apiEndpoint, requestData, successMessage, validToken);
    } catch (error) {
      Toast.show({ type: "error", text1: error.message || "Please try again" });
    };
  }, [validToken, team]);

  // Process attendance API request
  const processAttendance = async (method, endpoint, data, successMessage, validToken) => {
    try {
      const axiosConfig = {
        method,
        url: `${API_BASE_URL}/api/v1/newAttendance/${endpoint}`,
        data,
        headers: { Authorization: validToken },
      };

      const response = await axios(axiosConfig);

      if (response?.data?.success) {
        refreshPage();
        Toast.show({ type: "success", text1: successMessage });
      };
    } catch (error) {
      Toast.show({ type: "error", text1: error?.response?.data?.message || "Please try again" });
    };
  };

  // Navigate to my attendance screen
  const navigateToMyAttendance = () => {
    navigation.navigate("MyAttendance", { id: employeeId });
  };

  // Navigate to apply leave screen
  const navigateToApplyLeaveRequest = () => {
    navigation.navigate("ApplyLeaveRequest");
  };

  // Refresh page
  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  // Monthly Statistic data
  const statistics = useMemo(() => [
    { label: " Month", value: formatDate(monthlyStatistic?.month) || "-", icon: "📅" },
    { label: "Total Days in This Month", value: monthlyStatistic?.totalDaysInMonth || 0, icon: "📆" },
    { label: "Company's Working Days", value: monthlyStatistic?.companyWorkingDays || 0, icon: "💼" },
    { label: "Company's Working Hours", value: formatTimeToHoursMinutes(monthlyStatistic?.companyWorkingHours) || "00:00", icon: "🏢" },
    { label: "Holidays", value: monthlyStatistic?.totalHolidays || 0, icon: "🎉" },
    { label: "Sundays", value: monthlyStatistic?.totalSundays || 0, icon: "☀️" },
    { label: "Present Days", value: monthlyStatistic?.employeePresentDays || 0, icon: "✅" },
    { label: "Half Days", value: monthlyStatistic?.employeeHalfDays || 0, icon: "🌓" },
    { label: "Comp Off Days", value: monthlyStatistic?.employeeCompOffDays || 0, icon: "🏖️" },
    { label: "Absent Days", value: monthlyStatistic?.employeeAbsentDays || 0, icon: "❌" },
    { label: "Leave Days", value: monthlyStatistic?.employeeLeaveDays || 0, icon: "🏖️" },
    { label: "Late In Days", value: monthlyStatistic?.employeeLateInDays || 0, icon: "⏰" },
    { label: "Total Hours Worked", value: `${formatTimeToHoursMinutes(monthlyStatistic?.employeeWorkingHours) || "00:00"} / ${formatTimeToHoursMinutes(monthlyStatistic?.employeeRequiredWorkingHours) || "00:00"}`, icon: "🕒" },
    { label: "Avgerage Punch In Time", value: formatTimeWithAmPm(monthlyStatistic?.averagePunchInTime) || "-", icon: "🔔" },
    { label: "Avgerage Punch Out Time", value: formatTimeWithAmPm(monthlyStatistic?.averagePunchOutTime) || "-", icon: "🔕" },
  ], [monthlyStatistic]);

  return (
    <>
      {/* Header Card with Profile Icon and Punch Buttons non scrollable */}
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileContainer}>
            <Image
              style={styles.profileIcon}
              source={require("../../../Assets/user-icon.png")}
            />
            <View>
              <Text style={styles.employeeName}>{team?.name}</Text>
              <Text style={styles.positionText}>{team?.role?.name}</Text>
            </View>
          </TouchableOpacity>
          {loading ? (
            <View
              style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
              <ActivityIndicator size={30} color="#ffb300" />
            </View>
          ) : (
            <View style={styles.punchButtons}>
              {!attendance[0]?.punchIn ? (
                <TouchableOpacity
                  style={[styles.punchButton, styles.punchInButton]}
                  onPress={() => handlePunchAction("punchIn")}>
                  <Text style={styles.punchButtonText}>Punch In</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.punchButton, styles.punchOutButton]}
                  onPress={() => handlePunchAction("punchOut")}>
                  <Text style={styles.punchButtonText}>Punch Out</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Greeting and current date */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {team?.name?.split(" ", 1)[0]}!
          </Text>
          <Text style={styles.dateText}>{(new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)).toDateString()}</Text>
        </View>

        {/* Today's Activity */}
        <View style={styles.activitySection}>
          <Text style={[styles.sectionTitle, styles.activityTitle,]}>Today’s Activity</Text>
          <Text style={{ marginTop: -3, color: "#777" }}>
            <Text style={{ color: attendance[0]?.punchIn ? "green" : "red" }}>
              {attendance[0]?.punchIn ? "✓" : "✗"}
            </Text>{" "}
            {formatTimeWithAmPm(attendance[0]?.punchInTime)}
            {attendance[0]?.punchIn ? " - Punch In" : " Punch In"}
          </Text>
          <Text style={{ color: "#777" }}>
            <Text
              style={{ color: attendance[0]?.punchOut ? "green" : "red" }}>
              {attendance[0]?.punchOut ? "✓" : "✗"}
            </Text>{" "}
            {formatTimeWithAmPm(attendance[0]?.punchOutTime)}
            {attendance[0]?.punchOut ? " - Punch Out" : " Punch Out"}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={navigateToMyAttendance}>
            <Icon name="history" size={20} style={{ color: "#777" }} />
            <Text style={styles.quickActionText}>My Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={navigateToApplyLeaveRequest}>
            <Icon name="file-text-o" size={20} style={{ color: "#777" }} />
            <Text style={styles.quickActionText}>Apply Leave</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Today’s Summary</Text>
          <Text style={{ marginTop: -1, color: "#777" }}>
            Total Hours Worked:{" "}
            {formatTimeToHoursMinutes(attendance[0]?.hoursWorked) || "0"}
          </Text>
          <Text style={{ color: "#777" }}>Break Time: 01:45 PM To 02:30 PM</Text>
        </View>

        {/* Monthly Statistics */}
        <View style={styles.monthlyStats}>
          <Text style={[styles.sectionTitle, styles.staticTitle]}>Monthly Statistics</Text>
          {statistics?.map((item, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.iconPlaceholder}>{item.icon}</Text>
              <View style={styles.textContainer}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#f3f4f6",
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 15,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 8,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: "500",
    marginRight: 10,
    color: "#777",
  },
  positionText: {
    color: "#777",
    fontSize: 12,
  },
  punchButtons: {
    flexDirection: "row",
  },
  punchButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  punchInButton: {
    backgroundColor: "#ffb300",
  },
  punchOutButton: {
    backgroundColor: "#ffb300",
  },
  markedButton: {
    backgroundColor: "#28a745",
  },
  punchButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  greetingContainer: {
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#777",
  },
  dateText: {
    color: "#777",
    fontSize: 13,
  },
  activitySection: {
    padding: 15,
    backgroundColor: "#d9e3f0",
    borderRadius: 10,
    marginTop: 2,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#777",
  },
  activityTitle: {
    paddingBottom: 7,
    marginTop: -5,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  quickActionButton: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#d9e3f0",
    padding: 15,
    borderRadius: 10,
    width: "47%",
  },
  quickActionText: {
    fontSize: 14,
    marginTop: 5,
    color: "#777",
  },
  summary: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 1,
  },
  summaryTitle: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
    marginBottom: 5,
    marginTop: -5,
  },
  monthlyStats: {
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 16,
  },
  staticTitle: {
    paddingLeft: 16,
    paddingBottom: 10,
  },
  statItem: {
    paddingLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#d9e2ec",
    textAlign: "center",
    lineHeight: 32,
    fontSize: 18,
    marginRight: 12,
    color: "#333",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#777",
  },
  value: {
    fontSize: 14,
    fontWeight: "400",
    color: "#4a90e2",
  },
});

export default Home;
