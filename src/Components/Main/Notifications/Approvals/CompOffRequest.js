import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../../../Context/auth.context.js';
import { useRefresh } from '../../../../Context/refresh.context.js';
import { API_BASE_URL } from "@env";
import Toast from "react-native-toast-message";
import formatDate from '../../../../Helper/formatDate.js';

const CompOffRequest = () => {
  const { validToken, team } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [compOffRequests, setCompOffRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/compOff/pending-compOff`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setCompOffRequests(response?.data?.data);
      };
    } catch (error) {
      console.log('Error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (validToken) {
      fetchPendingRequests();
    };
  }, [validToken, refreshKey]);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/v1/compOff/update-compOff/${requestId}`,
        { status: newStatus, approvedBy: team?._id },
        { headers: { Authorization: validToken } },
      );

      if (response?.data?.success) {
        fetchPendingRequests();
        Toast.show({ type: "success", text1: "Updated successful" });
      };
    } catch (error) {
      Toast.show({ type: "error", text1: error?.response?.data?.message || "Error while updating" });
      console.log('Error:', error?.response?.data?.message || "Error while updating");
    };
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.requestItem}>
        <Text style={styles.employeeName}>{item?.employee?.name}</Text>
        <Text style={styles.date}>Worked Date: {formatDate(item?.date)}</Text>
        <Text style={styles.date}>Comp Off Date: {formatDate(item?.attendanceDate)}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={item?.status}
            onValueChange={(newStatus) => handleStatusChange(item?._id, newStatus)}
            style={styles.picker}
          >
            <Picker.Item style={styles.pickerItem} label="Pending" value="Pending" />
            <Picker.Item style={styles.pickerItem} label="Approved" value="Approved" />
            <Picker.Item style={styles.pickerItem} label="Rejected" value="Rejected" />
          </Picker>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      ) : compOffRequests?.length === 0 ? (
        <View style={styles.centeredView}>
          <Text style={styles.notFoundText}>No comp off request at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={compOffRequests}
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
    padding: 1,
  },
  requestItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginVertical: 1,
  },
  pickerContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 35,
    justifyContent: 'center',
    paddingLeft: 10,
    width: '45%',
  },
  picker: {
    color: '#555',
  },
  pickerItem: {
    fontSize: 14,
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

export default CompOffRequest;
