import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../Context/auth.context.js";
import axios from "axios";
import { API_BASE_URL } from "@env";

const AddWorkSummary = ({ navigation }) => {
  const [summary, setSummary] = useState("");
  const { validToken, team } = useAuth();

  const handleSubmit = async () => {
    if (!summary) {
      Toast.show({ type: "error", text1: "Work summary should not be empty" });
      return;
    };

    const formattedDate = new Date().toISOString().split("T")[0];

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/workSummary/create-workSummary`,
        { employee: team?._id, summary, date: formattedDate },
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setSummary("");
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      };
    } catch (error) {
      console.log(error.message);
      Toast.show({ type: "error", text1: error?.response?.data?.message || "Submission failed" });
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
        <Text style={styles.headerTitle}>Write Work Summary</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={{ marginBottom: 10, color: "#333" }}>
          Work Summary <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={summary}
          placeholder="write summary here..."
          placeholderTextColor="#aaa"
          onChangeText={setSummary}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
  input: {
    height: 50,
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#555",
    justifyContent: "center"
  },
  textArea: {
    height: 150,
    borderRadius: 5,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default AddWorkSummary;
