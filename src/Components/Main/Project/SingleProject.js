import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useAuth } from "../../../Context/auth.context.js";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { useRefresh } from "../../../Context/refresh.context";
import { ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../../../Helper/formatDate.js";

const SingleProject = ({ route }) => {
  const id = route?.params?.id;
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const navigation = useNavigation();
  const [projectDetails, setProjectDetails] = useState("");
  const [totalReceived, setTotalReceived] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProject = async (id) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/project/single-project/${id}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setProjectDetails(response?.data?.project);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  const fetchInvoiceDetails = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/invoice/byProject/${id}`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setTotalReceived(response?.data?.totalReceived);
      };
    } catch (error) {
      if (error?.response?.data?.success === false) {
        setTotalReceived("");
      };
    };
  };

  useEffect(() => {
    if (id && validToken) {
      fetchProject(id);
      fetchInvoiceDetails(id);
    };
  }, [refreshKey, validToken, id]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const renderDetail = (label, value) => (
    <View style={styles.detailCard}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || "NA"}</Text>
    </View>
  );

  return (
    <>
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>{projectDetails?.projectName}</Text>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="small" color="#ffb300" />
        </View>
      ) : projectDetails === "" ? (
        <Text style={{ textAlign: "center", color: "#777" }}>
          No project.
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Overview</Text>
            <View style={styles.grid}>
              {renderDetail("Project ID", projectDetails?.projectId)}
              {renderDetail("Client Name", projectDetails?.customer?.name)}
              {renderDetail("Project Type", projectDetails?.projectType?.name)}
              {renderDetail("Project Status", projectDetails?.projectStatus?.status)}
              {renderDetail("Project Priority", projectDetails?.projectPriority?.name)}
              {renderDetail("Project Category", projectDetails?.projectCategory?.name)}
              {renderDetail("Technology Used", projectDetails?.technology?.map((t) => t?.name).join(', '))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timeline & Budget</Text>
            <View style={styles.grid}>
              {renderDetail("Total Hours", projectDetails?.totalHour)}
              {renderDetail("Project Cost", (parseFloat(projectDetails?.projectPrice)).toFixed(2))}
              {renderDetail("Amount Received", (parseFloat(totalReceived)).toFixed(2) || 0)}
              {renderDetail("Due Amount", (parseFloat(projectDetails?.projectPrice) - parseFloat(totalReceived)).toFixed(2))}
              {renderDetail("Project Deadline", formatDate(projectDetails?.projectDeadline))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team Management</Text>
            <View style={styles.grid}>
              {renderDetail("Responsible Person", projectDetails?.responsiblePerson?.map((member) => member?.name).join(', '))}
              {renderDetail("Team Leader", projectDetails?.teamLeader?.map((member) => member?.name).join(', '))}
            </View>
          </View>
        </ScrollView>
      )}
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
    paddingBottom: 10,
  },
  section: {
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 12,
    color: "#333",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailCard: {
    width: "48.5%",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  detailLabel: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    color: "#555",
  },
});

export default SingleProject;
