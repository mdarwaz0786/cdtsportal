import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../../Context/auth.context.js';
import { API_BASE_URL } from "@env";
import Icon from "react-native-vector-icons/Feather";
import { useRefresh } from '../../../Context/refresh.context.js';

const LeaveLedger = ({ navigation }) => {
  const { team, validToken } = useAuth();
  const [leaveData, setLeaveData] = useState(null);
  const { refreshKey, refreshPage } = useRefresh();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [employeeId, setEmployeeId] = useState(team?._id);

  useEffect(() => {
    if (team) {
      setEmployeeId(team?._id);
    };
  }, [team]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/v1/leave/leaveBalance/${employeeId}`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (res?.data?.success) {
        setLeaveData(res?.data);
      };
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (validToken) {
      fetchLeaveData();
    };
  }, [validToken, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const formatMonthYear = (monthStr) => {
    const date = new Date(`${monthStr}-01`);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    return formattedDate;
  };


  let runningBalance = 0;

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
            {leaveData?.summary?.map((month) => {
              const monthTitle = formatMonthYear(month?.month);
              const creditDate = `${month?.month}-01`;

              // Prepare entries
              const entries = [];

              // Credited entry
              runningBalance += month?.leavesAdded;
              entries.push({
                date: formatDate(creditDate),
                type: 'Credited',
                count: month?.leavesAdded,
                balance: runningBalance,
              });

              // Debited entries
              month?.leaveDates?.forEach((date) => {
                runningBalance -= 1;
                entries.push({
                  date: formatDate(date),
                  type: 'Debited',
                  count: 1,
                  balance: runningBalance,
                });
              });

              return (
                <View key={month.month} style={styles.monthBlock}>
                  <Text style={styles.monthTitle}>{monthTitle}</Text>

                  <View style={styles.table}>
                    <View style={[styles.row, styles.headerRow]}>
                      <Text style={[styles.cell, { flex: 2, color: "#555", fontWeight: "500" }]}>Date</Text>
                      <Text style={[styles.cell, { color: "#555", fontWeight: "500" }]}>Type</Text>
                      <Text style={[styles.cell, { color: "#555", fontWeight: "500" }]}>Count</Text>
                      <Text style={[styles.cell, { color: "#555", fontWeight: "500" }]}>Balance</Text>
                    </View>

                    {entries.map((entry, idx) => (
                      <View key={idx} style={styles.row}>
                        <Text style={[styles.cell, { flex: 2 }]}>{entry.date}</Text>
                        <Text style={[styles.cell, entry.type === 'Debited' ? styles.debit : styles.credit]}>{entry.type}</Text>
                        <Text style={styles.cell}>{entry.count}</Text>
                        <Text style={styles.cell}>{entry.balance}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}

            <View style={styles.footer}>
              <Text style={styles.label}>Total Credited: {leaveData?.totalEntitled}</Text>
              <Text style={styles.label}>Total Debited: {leaveData?.totalTaken}</Text>
              <Text style={styles.label}>Final Balance: {leaveData?.balance}</Text>
            </View>
          </ScrollView>
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
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  monthBlock: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 5,
  },
  headerRow: {
    backgroundColor: '#ddd',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  credit: {
    color: 'green',
    fontWeight: '500',
  },
  debit: {
    color: 'red',
    fontWeight: '500',
  },
  footer: {
    marginTop: 0,
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginVertical: 4,
    fontSize: 14,
    color: '#555'
  },
});

export default LeaveLedger;

