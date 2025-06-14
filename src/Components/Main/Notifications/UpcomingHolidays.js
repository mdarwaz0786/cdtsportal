import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Calender from "react-native-vector-icons/MaterialCommunityIcons";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";
import formatDate from "../../../Helper/formatDate.js";
import axios from "axios";

const UpcomingHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();

  // Fetch upcoming holiday
  const fetchUpcomingHoliday = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/holiday/upcoming-holiday`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setHolidays(response?.data?.holiday);
      }
    } catch (error) {
      console.log("Error while fetching upcoming holiday:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (validToken) {
      fetchUpcomingHoliday();
    }
  }, [validToken, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.cardHeader}>
        <Calender
          name="calendar"
          size={22}
          color="#ffb300"
          style={styles.icon}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item?.reason}</Text>
          <Text style={styles.cardDate}>{formatDate(item?.date)}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>
        The office will be closed on {formatDate(item?.date)} for {item?.reason}.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Holidays</Text>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      ) : holidays?.length === 0 ? (
        <View style={styles.centeredView}>
          <Text style={styles.notFoundText}>No upcoming holidays at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={holidays}
          renderItem={renderItem}
          keyExtractor={(item) => item?._id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  icon: {
    marginRight: 8,
  },
  cardContent: {
    flex: 1,
    marginBottom: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333",
  },
  cardDate: {
    fontSize: 13,
    color: "#888",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
  },
  notFoundText: {
    fontSize: 14,
    color: "#777",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UpcomingHolidays;
