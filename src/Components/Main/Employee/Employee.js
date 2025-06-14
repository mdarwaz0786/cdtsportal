import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";
import Icon from "react-native-vector-icons/Feather";

const Employee = ({ navigation }) => {
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visiblePopupId, setVisiblePopupId] = useState(null);

  // Fetch all employees
  const fetchAllEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/team/all-team`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setEmployees(response?.data?.team);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (validToken) {
      fetchAllEmployees();
    };
  }, [validToken, refreshKey]);

  const navigateToAttendance = (id) => {
    navigation.navigate("Attendance", { id });
  };

  const navigateToSalary = (id) => {
    navigation.navigate("Salary", { id });
  };

  const handleBackgroundPress = () => {
    setVisiblePopupId(null);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const renderEmployeeItem = ({ item }) => (
    <View style={styles.employeeCard}>
      <View style={styles.heading}>
        <TouchableOpacity
          style={styles.nameRoleContainer}
          onPress={() =>
            navigateToAttendance(item?._id)
          }>
          <Text style={styles.employeeName}>{item?.name}</Text>
          <Text style={styles.employeeRole}>{item?.designation?.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() =>
            setVisiblePopupId(visiblePopupId === item?._id ? null : item?._id)
          }>
          <Icon name="more-vertical" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {visiblePopupId === item?._id && (
        <View style={styles.popupMenu}>
          <TouchableOpacity
            onPress={() => {
              setVisiblePopupId(null);
              navigateToAttendance(item?._id);
            }}
            style={styles.popupOption}>
            <Text style={styles.popupOptionText}>Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setVisiblePopupId(null);
              navigateToSalary(item?._id);
            }}
            style={styles.popupOption}>
            <Text style={styles.popupOptionText}>Salary</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Employee</Text>
      </View>

      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={styles.container}>
          {loading ? (
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#ffb300" />
            </View>
          ) : employees?.length === 0 ? (
            <View style={styles.centeredView}>
              <Text style={styles.notFoundText}>Employee not found.</Text>
            </View>
          ) : (
            <FlatList
              data={employees}
              renderItem={renderEmployeeItem}
              keyExtractor={item => item?._id}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  employeeCard: {
    backgroundColor: "#ffffff",
    padding: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    zIndex: 1,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameRoleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
    marginRight: 10,
  },
  employeeRole: {
    fontSize: 13,
    color: "#777",
  },
  optionsButton: {
    paddingVertical: 5,
  },
  popupMenu: {
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: "absolute",
    top: -12,
    right: 60,
    height: 60,
    zIndex: 9999,
  },
  popupOption: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  popupOptionText: {
    fontSize: 14,
    color: "#555",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 14,
    color: "#777",
  },
});

export default Employee;
