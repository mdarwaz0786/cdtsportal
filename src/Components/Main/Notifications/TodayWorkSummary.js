import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from '../../../Context/refresh.context.js';
import axios from "axios";
import { API_BASE_URL } from "@env";

const TodayWorkSummary = () => {
  const [workSummary, setWorkSummary] = useState([]);
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTodayWorkSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/workSummary/today-workSummary`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setWorkSummary(response?.data?.data);
      };
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (validToken) {
      fetchTodayWorkSummary();
    };
  }, [validToken, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <Text style={styles.title}>Today's Work Summary</Text>
        {workSummary && (
          loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#ffb300" />
            </View>
          ) : workSummary?.length === 0 ? (
            <Text style={{ flex: 1, textAlign: "center", color: "#777" }}>
              Work summary not found for today.
            </Text>
          ) : (
            workSummary?.map((w) => (
              <View style={styles.card} key={w?._id}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{w?.employee?.name?.[0]}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{w?.employee?.name}</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.workDetailContainer}>
                    <Text style={styles.workDetailText}>
                      {w?.summary}
                    </Text>
                  </View>
                </View>
              </View>
            )))
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#FFF',
    padding: 10,
    paddingTop: 8,
    paddingBottom: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000',
    marginLeft: 10,
  },
  avatar: {
    backgroundColor: '#ffb300',
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '400',
  },
  divider: {
    marginTop: 8,
    marginBottom: -3,
    height: 1,
    backgroundColor: '#DDD',
  },
  workDetailContainer: {
    paddingVertical: 5,
  },
  workDetailText: {
    fontSize: 14,
    marginBottom: 1,
    color: '#555',
  },
  label: {
    fontWeight: '400',
    color: '#333',
    fontSize: 14,
  },
});

export default TodayWorkSummary;
