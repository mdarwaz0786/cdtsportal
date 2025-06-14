import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  RefreshControl,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";
import { ActivityIndicator } from "react-native-paper";

const ApplyCompOff = ({ navigation }) => {
  const { validToken, team } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [employee, setEmployee] = useState();
  const [date, setDate] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSingleEmployee = async (employeeId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/team/single-team/${employeeId}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setEmployee(response?.data?.team);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (team && validToken) {
      fetchSingleEmployee(team?._id);
    };
  }, [team, validToken, refreshKey]);

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    setIsDatePickerVisible(false);
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    };
  };

  const handleSubmit = async () => {
    if (!date) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    };

    if (!selectedDate) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    };

    const compOffData = {
      date: selectedDate,
      attendanceDate: date.toISOString().split("T")[0],
      employee: team?._id,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/compOff/create-compOff`,
        compOffData,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setDate(null);
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      };
    } catch (error) {
      console.log("Error:", error.message);
      Toast.show({ type: "error", text1: error?.response?.data?.message || "Try again" });
    };
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

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
        <Text style={styles.headerTitle}>Apply Comp Off</Text>
      </View>
      {
        loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#ffb300" />
          </View>
        ) : (
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Worked Date <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              {/* Worked Date Picker */}
              <Picker
                selectedValue={selectedDate}
                onValueChange={(itemValue) => setSelectedDate(itemValue)}
                style={styles.picker}
              >
                <Picker.Item style={styles.pickerItem} label="Select date" value="" />
                {
                  employee?.eligibleCompOffDate?.map((value) => (
                    <Picker.Item style={styles.pickerItem} key={value?._id} label={value?.date} value={value?.date} />
                  ))
                }
              </Picker>
            </View>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Comp Off Date <Text style={{ color: "red" }}>*</Text>
            </Text>
            {/* Comp Off Date Picker */}
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={showDatePicker}
            >
              <Text style={{ color: "#666" }}>{date ? date.toISOString().split("T")[0] : "Select date"}</Text>
            </TouchableOpacity>
            {isDatePickerVisible && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        )
      }
    </>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  input: {
    paddingVertical: 5,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#777",
  },
  dateInput: {
    paddingVertical: 10,
    paddingLeft: 15,
    color: "#777",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: "#fff",
    height: 45,
    justifyContent: Platform.OS === "android" ? "center" : "flex-end",
    paddingLeft: 8,
  },
  picker: {
    color: "#555",
  },
  pickerItem: {
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default ApplyCompOff;
