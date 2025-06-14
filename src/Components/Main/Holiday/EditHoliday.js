import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";

const EditHoliday = ({ navigation, route }) => {
  const id = route?.params?.id;
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();

  const fetchSingleHoliday = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/holiday/single-holiday/${id}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setDate(new Date(response?.data?.holiday?.date));
        setReason(response?.data?.holiday?.reason);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (id) {
      fetchSingleHoliday(id);
    }
  }, [id, refreshKey]);

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    setIsDatePickerVisible(false);
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    };
  };

  const handleSubmit = async (id) => {
    if (!reason) {
      Toast.show({ type: "error", text1: "Reason is required" });
      return;
    };

    if (!date) {
      Toast.show({ type: "error", text1: "Date is required" });
      return;
    };

    const holidayData = {
      reason,
      type: "Holiday",
      date: formatDate(date),
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/holiday/update-holiday/${id}`,
        holidayData,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setReason("");
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

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
        <Text style={styles.headerTitle}>Edit Holiday</Text>
      </View>

      {
        loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#ffb300" />
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
              Reason <Text style={{ color: "red" }}>*</Text>
            </Text>
            {/* Reason Input */}
            <TextInput
              value={reason}
              onChangeText={setReason}
              style={styles.input}
            />

            <Text style={{ marginBottom: 5, color: "#555" }}>
              Date <Text style={{ color: "red" }}>*</Text>
            </Text>
            {/* Date Picker */}
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={showDatePicker}
            >
              <Text style={{ color: "#777" }}>{date && date.toISOString().split("T")[0]}</Text>
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
            <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit(id)}>
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

export default EditHoliday;
