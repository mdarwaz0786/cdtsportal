import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../Context/auth.context.js';
import { useRefresh } from "../../../Context/refresh.context.js";
import { API_BASE_URL } from "@env";
import axios from 'axios';
import formatDate from './formatDate.js';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";

const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return styles.approved;
    case 'rejected':
      return styles.rejected;
    case 'pending':
      return styles.pending;
    default:
      return {};
  };
};

const LeaveBalance = () => {
  const { team, validToken } = useAuth();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [employeeId, setEmployeeId] = useState(team?._id);
  const [recentRequests, setRecentRequests] = useState([]);
  const navigation = useNavigation();
  const { refreshKey, refreshPage } = useRefresh();

  useEffect(() => {
    if (team) {
      setEmployeeId(team?._id);
    };
  }, [team]);

  const fetchLeaveBalance = async (employeeId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/v1/leave/leaveBalance/${employeeId}`, {
        headers: {
          Authorization: validToken,
        },
      });
      setLeave(res?.data);
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
    };
  };

  const fetchLeaveApproval = async (employeeId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/v1/leaveApproval/employee-leaveApproval/${employeeId}`, {
        headers: {
          Authorization: validToken,
        },
      });
      if (res?.data?.success) {
        setRecentRequests(res?.data?.data);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (employeeId) {
      fetchLeaveBalance(employeeId);
      fetchLeaveApproval(employeeId);
    };
  }, [employeeId, refreshKey]);

  const circleSize = 90;
  const total = leave?.totalEntitled || 1;
  const remaining = leave?.balance < 0 ? 0 : leave?.balance;
  const degree = (remaining / total) * 360;

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
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
        <Text style={styles.headerTitle}>Leave Dashboard</Text>
      </View>

      {
        loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ffb300" />
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.circleContainer}>
                <View style={[styles.progressWrapper, { width: circleSize, height: circleSize }]}>
                  <View style={[
                    styles.backgroundCircle,
                    { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }
                  ]} />
                  <View style={[
                    styles.progressSlice,
                    {
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleSize / 2,
                      transform: [{ rotate: `${degree}deg` }],
                    }
                  ]} />
                  <View style={[
                    styles.innerCircle,
                    {
                      width: circleSize - 30,
                      height: circleSize - 30,
                      borderRadius: (circleSize - 30) / 2
                    }
                  ]}>
                    <Text style={styles.remainingText}>{leave?.balance}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.stats}>
                <Text style={styles.balanceLabel}>Leave Balance</Text>
                <Text style={[styles.statsText, { marginBottom: 1 }]}>Used   {leave?.totalTaken}</Text>
                <Text style={styles.statsText}>Remaining    {leave?.balance}</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate("LeaveApply")}>
                <Text style={styles.buttonText}>Apply Leave</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate("LeaveLedger")}>
                <Text style={styles.buttonTextSecondary}>View Ledger</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.subHeading}>Recent Requests</Text>
            {
              recentRequests?.length === 0 ? (
                <View style={styles.centeredView}>
                  <Text style={styles.notFoundText}>No Data.</Text>
                </View>
              ) : (
                <FlatList
                  data={recentRequests}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.requestItem}>
                      <View>
                        <Text style={styles.dateText}>{formatDate(item?.startDate)} To {formatDate(item?.endDate)}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail">
                          {(item?.reason || '').length > 40 ? item?.reason.slice(0, 40) + '...' : item?.reason}
                        </Text>
                      </View>
                      <Text style={[styles.statusText, getStatusStyle(item?.leaveStatus)]}>{item?.leaveStatus}</Text>
                    </View>
                  )}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              )
            }
          </View>
        )
      }
    </>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
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
  },
  card: {
    margin: 10,
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  circleContainer: {
    alignItems: 'center',
  },
  progressWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    borderWidth: 10,
    borderColor: '#66a3e0',
  },
  progressSlice: {
    position: 'absolute',
    borderWidth: 5,
    borderColor: '#007BFF',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  innerCircle: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  balanceLabel: {
    marginBottom: 5,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  stats: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  statsText: {
    fontSize: 14,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonSecondary: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  buttonTextSecondary: {
    color: '#000',
    fontWeight: '500',
  },
  subHeading: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 0,
  },
  requestItem: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.6,
    borderColor: '#ccc',
  },
  dateText: {
    fontWeight: '500',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  approved: {
    color: 'green',
  },
  rejected: {
    color: 'red',
  },
  pending: {
    color: '#d08700',
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

export default LeaveBalance;

