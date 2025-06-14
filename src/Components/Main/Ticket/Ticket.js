import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../../Context/auth.context.js";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { useRefresh } from "../../../Context/refresh.context";
import { ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";

const Ticket = () => {
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const navigation = useNavigation();
  const [ticket, setTicket] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/ticket/all-ticket`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setTicket(response?.data?.tickets);
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
      fetchTicket();
    };
  }, [refreshKey, validToken]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("TicketDetail", { id: item?._id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item?.title[0]}</Text>
        </View>
        <View>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.subtitle}>{item?.createdBy?.name}</Text>
        </View>
      </View>
      <View>
      </View>
      <Text style={styles.bottomText}>Status: {item?.status}</Text>
      <Text style={styles.bottomText}>Project: {item?.project?.projectName}</Text>
      <Text style={styles.bottomText}>Created At: {(new Date(item?.createdAt))?.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</Text>
      <Text style={styles.bottomText}>Last Updated: {(new Date(item?.updatedAt))?.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.header}>
        <Icon style={styles.backIcon} name="arrow-left" size={20} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Ticket</Text>
        <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate("AddTicket")}>
          <Text style={styles.buttonAddText}>Raise New Ticket</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#ffb300" />
          </View>
        ) : ticket?.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#555" }}>
            No ticket.
          </Text>
        ) : (
          <FlatList
            data={ticket}
            renderItem={renderItem}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={{ paddingBottom: 16 }}
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
    paddingHorizontal: 5,
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
    marginTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: "#ffb300",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555"
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  bottomText: {
    marginTop: 1,
    fontWeight: "400",
    color: "#555",
  },
});

export default Ticket;