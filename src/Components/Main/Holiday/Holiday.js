import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import Calender from "react-native-vector-icons/MaterialCommunityIcons";
import { useRefresh } from "../../../Context/refresh.context.js";
import formatDate from "../../../Helper/formatDate.js";

const Holiday = ({ navigation }) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshKey, refreshPage } = useRefresh();
  const { validToken, team } = useAuth();

  const fetchAllHoliday = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/api/v1/holiday/byMonth-holiday`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setHolidays(response?.data?.data);
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
      fetchAllHoliday();
    };
  }, [validToken, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const renderHolidayItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.notificationCard}
        onPress={() =>
          (team?.role?.name.toLowerCase() === "admin" || team?.role?.name.toLowerCase() === "hr") &&
          navigation.navigate('EditHoliday', { id: item?._id })
        }>
        <View style={styles.cardHeader}>
          <Calender name="calendar" size={18} color="#ffb300" style={styles.icon} />
          <Text style={[styles.cardTitle, { marginRight: 20 }]}>{formatDate(item?.date)}</Text>
          <Text style={styles.cardTitle}>{item?.reason}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMonthGroup = ({ item }) => {
    return (
      <View style={styles.monthGroup}>
        <Text style={styles.monthTitle}>{item?.monthName}</Text>
        <FlatList
          data={item?.holidays}
          renderItem={renderHolidayItem}
          keyExtractor={(holiday) => holiday?._id}
        />
      </View>
    );
  };

  return (
    <>
      <View style={styles.header}>
        <Icon style={styles.backIcon} name="arrow-left" size={20} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Holiday</Text>
        {
          (team?.role?.name.toLowerCase() === "admin" || team?.role?.name.toLowerCase() === "hr") && (
            <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate("AddHoliday")}>
              <Text style={styles.buttonAddText}>Add New Holiday</Text>
            </TouchableOpacity>
          )
        }
      </View>

      <View style={styles.container}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#ffb300" />
          </View>
        ) : holidays?.length === 0 ? (
          <View style={styles.centeredView}>
            <Text style={styles.noHolidaysText}>Holiday not found</Text>
          </View>
        ) : (
          <FlatList
            data={holidays}
            renderItem={renderMonthGroup}
            keyExtractor={(item) => item?.monthName}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
  },
  backIcon: {
    flex: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  buttonAdd: {
    flex: 1,
    backgroundColor: "#ffb300",
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonAddText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 12,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  notificationCard: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#555",
  },
  noHolidaysText: {
    fontSize: 14,
    color: "#777",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  monthGroup: {
    marginBottom: 10,
  },
  monthTitle: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 8,
    color: "#333",
  },
});

export default Holiday;
