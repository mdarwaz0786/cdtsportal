import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from "@env";
import { useAuth } from '../../../Context/auth.context.js';
import formatDate from '../../../Helper/formatDate.js';
import { useRefresh } from '../../../Context/refresh.context.js';
import { ActivityIndicator } from 'react-native-paper';

const Notification = () => {
  const { validToken, team } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshKey, refreshPage } = useRefresh();
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchNotifications = async (page, isRefreshing = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      };

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/notification/notificationByEmployee`,
        {
          params: { employeeId: team?._id, page, limit },
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        const notificationsData = response?.data?.data || [];

        setNotifications((prev) => (isRefreshing ? notificationsData : [...prev, ...notificationsData]));
        setHasMore(notificationsData?.length === limit);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    };
  };

  useEffect(() => {
    if (validToken && team) {
      fetchNotifications(page, true);
    };
  }, [validToken, team, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
    setPage(1);
    fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    };
  };

  const renderNotificationItem = ({ item }) => {
    return (
      <View style={styles.notificationContainer}>
        <Text style={styles.message}>{item?.message}</Text>
        <Text style={styles.date}>{formatDate(item?.date)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="small" color="#ffb300" />
        </View>
      ) : notifications?.length === 0 ? (
        <View style={styles.centeredView}>
          <Text style={styles.notFoundText}>No notifications available.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item?._id}
          ListEmptyComponent={<Text style={styles.emptyText}>No notifications available.</Text>}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMore ? (
              <View style={{ marginVertical: 16, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#ffb300" />
              </View>
            ) : null
          }
        />
      )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  notificationContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
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

export default Notification;
