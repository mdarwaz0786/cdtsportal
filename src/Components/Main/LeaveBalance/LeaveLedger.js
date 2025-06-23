import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../Context/auth.context.js';
import { useRefresh } from "../../../Context/refresh.context.js";
import { API_BASE_URL } from "@env";
import axios from 'axios';
import formatDate from './formatDate.js';
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

const LeaveLedger = ({ navigation }) => {
  const { team, validToken } = useAuth();
  const [employeeId, setEmployeeId] = useState(team?._id);
  const [loading, setLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);
  const { refreshKey, refreshPage } = useRefresh();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (team) {
      setEmployeeId(team?._id);
    };
  }, [team]);

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
      fetchLeaveApproval(employeeId);
    };
  }, [employeeId, refreshKey]);

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
        <Text style={styles.headerTitle}>Leave Ledger</Text>
      </View>
      {
        loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ffb300" />
          </View>
        ) : recentRequests?.length === 0 ? (
          <View style={styles.loaderContainer}>
            <Text style={styles.noDataText}>No leave ledger records found.</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.dateColumn]}>From Date</Text>
              <Text style={[styles.headerCell, styles.dateColumn]}>To Date</Text>
              <Text style={[styles.headerCell, styles.durationColumn]}>Duration</Text>
              <Text style={[styles.headerCell, styles.statusColumn]}>Status</Text>
            </View>
            <FlatList
              data={recentRequests}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={[styles.cell, styles.dateColumn]}>{formatDate(item?.startDate)}</Text>
                  <Text style={[styles.cell, styles.dateColumn]}>{formatDate(item?.endDate)}</Text>
                  <Text style={[styles.cell, styles.durationColumn]}>{item?.leaveDuration} Days</Text>
                  <Text style={[styles.cell, styles.statusColumn, getStatusStyle(item?.leaveStatus)]}>{item?.leaveStatus}</Text>
                </View>
              )}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </View>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
  },
  headerCell: {
    fontWeight: '600',
    fontSize: 14,
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  cell: {
    fontSize: 14,
    color: '#333',
  },
  dateColumn: {
    flex: 2.2,
  },
  durationColumn: {
    flex: 1.5,
  },
  statusColumn: {
    flex: 1.3,
  },
  approved: {
    color: 'green',
    fontWeight: '600',
  },
  rejected: {
    color: 'red',
    fontWeight: '600',
  },
  pending: {
    color: '#d08700',
    fontWeight: '600',
  },
  certificate: {
    color: '#0077b6',
    fontWeight: '600',
  },
  defaultStatus: {
    color: '#333',
  },
});

export default LeaveLedger;
