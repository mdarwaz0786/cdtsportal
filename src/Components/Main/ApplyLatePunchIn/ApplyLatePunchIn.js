import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { useAuth } from "../../../Context/auth.context.js";

const ApplyLatePunchIn = ({ navigation }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const { validToken, team } = useAuth();

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    setIsDatePickerVisible(false);
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
  };

  const showTimePicker = () => {
    setIsTimePickerVisible(true);
  };

  const onTimeChange = (event, selectedTime) => {
    setIsTimePickerVisible(false);
    if (event.type === "set" && selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleSubmit = async () => {
    if (!date || !time) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = time.toTimeString().substring(0, 5);

    const latePunchInData = {
      attendanceDate: formattedDate,
      employee: team?._id,
      punchInTime: formattedTime,
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/latePunchIn/create-latePunchIn`,
        latePunchInData,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setDate(new Date());
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error:", error.message);
      Toast.show({ type: "error", text1: error?.response?.data?.message || "Try again" });
    }
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
        <Text style={styles.headerTitle}>Apply Late Punch In</Text>
      </View>

      <View style={styles.container}>
        <Text style={{ marginBottom: 5, color: "#555" }}>
          Attendance Date <Text style={{ color: "red" }}>*</Text>
        </Text>
        {/* Date Picker */}
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={showDatePicker}>
          <Text style={{ color: "#777" }}> {date ? date.toISOString().split("T")[0] : "Select date"}</Text>
        </TouchableOpacity>

        {isDatePickerVisible && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Text style={{ marginBottom: 5, color: "#555" }}>
          Punch In Time <Text style={{ color: "red" }}>*</Text>
        </Text>
        {/* Time Picker */}
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={showTimePicker}
        >
          <Text style={{ color: "#777" }}>{time ? time.toTimeString().substring(0, 5) : "Select time"}</Text>
        </TouchableOpacity>
        {isTimePickerVisible && (
          <DateTimePicker
            value={time || new Date()}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "#777",
  },
  dateInput: {
    paddingVertical: 10,
    paddingLeft: 15,
    color: "#777",
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

export default ApplyLatePunchIn;
