import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../Context/auth.context.js";
import axios from "axios";
import { API_BASE_URL } from "@env";

const ApplyLeaveRequest = ({ navigation }) => {
  const [reason, setReason] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
  const { validToken, team } = useAuth();

  const showStartDatePicker = () => {
    setIsStartDatePickerVisible(true);
  };

  const onStartDateChange = (event, selectedDate) => {
    setIsStartDatePickerVisible(false);
    if (event.type === "set" && selectedDate) {
      setStartDate(selectedDate);
    };
  };

  const showEndDatePicker = () => {
    setIsEndDatePickerVisible(true);
  };

  const onEndDateChange = (event, selectedDate) => {
    setIsEndDatePickerVisible(false);
    if (event.type === "set" && selectedDate) {
      setEndDate(selectedDate);
    };
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    };

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/leaveApproval/create-leaveApproval`,
        { employee: team?._id, startDate: formattedStartDate, endDate: formattedEndDate, reason },
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setReason();
        setStartDate(new Date());
        setEndDate(new Date());
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error while applying leave:", error.message);
      Toast.show({ type: "error", text1: error?.response?.data?.message || "Submission failed" });
    };
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
        <Text style={styles.headerTitle}>Apply Leave</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={{ marginBottom: 5, color: "#555" }}>
          Start Date <Text style={{ color: "red" }}>*</Text>
        </Text>
        {/* Start Date Picker */}
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={showStartDatePicker}
        >
          <Text style={{ color: "#777" }}>{startDate ? startDate.toISOString().split("T")[0] : "Select start date"}</Text>
        </TouchableOpacity>
        {isStartDatePickerVisible && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

        <Text style={{ marginBottom: 5, color: "#555" }}>
          End Date <Text style={{ color: "red" }}>*</Text>
        </Text>
        {/* End Date Picker */}
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={showEndDatePicker}
        >
          <Text style={{ color: "#777" }}>{endDate ? endDate.toISOString().split("T")[0] : "Select end date"}</Text>
        </TouchableOpacity>
        {isEndDatePickerVisible && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}

        {/* Reason */}
        <Text style={{ marginBottom: 5, color: "#555" }}>
          Reason <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write leave reason"
          placeholderTextColor="#777"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 100, marginBottom: 20, color: "#555" }}>
          <Text style={{ color: "red" }}>*</Text> Note: For single day leave select same date in start and end.
        </Text>
      </ScrollView>
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
  picker: {
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#777",
    borderWidth: 1,
    borderColor: "#fff",
  },
  pickerItem: {
    backgroundColor: "#fff",
    color: "#555",
    fontSize: 14,
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
  textArea: {
    height: 150,
    textAlignVertical: "top",
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

export default ApplyLeaveRequest;
