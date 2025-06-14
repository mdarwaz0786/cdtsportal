import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import { API_BASE_URL } from "@env";
import Toast from "react-native-toast-message";
import { useAuth } from '../../../Context/auth.context.js';

const PaySalary = ({ route, navigation }) => {
  const { validToken } = useAuth();
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  const month = route?.params?.month;
  const year = route?.params?.year;
  const totalSalary = route?.params?.totalSalary;
  const employee = route?.params?.employee;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!totalSalary || !month || !year || !employee || !transactionId) {
        return Toast.show({ type: "error", text1: "Enter Transaction ID" });
      };

      const response = await axios.post(`${API_BASE_URL}/api/v1/salary/create-salary`,
        {
          transactionId: transactionId,
          amountPaid: totalSalary,
          month,
          year,
          employee: employee,
          salaryPaid: true,
        },
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setTransactionId("");
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      };
    } catch (error) {
      Toast.show({ type: "success", text1: error?.response?.data?.message || "Error while submitting" });
    } finally {
      setLoading(false);
    };
  };

  return (
    <>
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Pay Salary</Text>
      </View>

      <View style={styles.container}>
        <Text style={{ marginBottom: 5, color: "#555" }}>
          Transaction ID <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          value={transactionId}
          onChangeText={setTransactionId}
          style={styles.input}
        />
        {
          loading ? (
            <Text style={{ textAlign: "center", color: "#555" }}>Salary slip is creating and sending to employee, please wait...</Text>
          ) : (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Pay Now</Text>
            </TouchableOpacity>
          )
        }
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
    paddingBottom: 12,
    paddingTop: 8,
  },
  input: {
    padding: 16,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#777",
  },
  submitButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default PaySalary;