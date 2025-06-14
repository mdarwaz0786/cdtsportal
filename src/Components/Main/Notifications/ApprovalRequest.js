import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LeaveRequest from './Approvals/LeaveRequest.js';
import CompOffRequest from './Approvals/CompOffRequest.js';
import PunchOutRequest from './Approvals/MissedPunchOut.js';
import PunchInRequest from './Approvals/LatePunchIn.js';

const ApprovalRequest = () => {
  const [activeRequestType, setActiveRequestType] = useState('compOff');

  const renderRequestComponent = () => {
    switch (activeRequestType) {
      case 'leave':
        return <LeaveRequest />;
      case 'compOff':
        return <CompOffRequest />;
      case 'punchOut':
        return <PunchOutRequest />;
      case 'punchIn':
        return <PunchInRequest />;
      default:
        return <Text style={styles.placeholderText}>Invalid Request Type</Text>;
    };
  };

  const approvalTypes = [
    { type: 'compOff', label: 'Comp Off' },
    { type: 'leave', label: 'Leave' },
    { type: 'punchOut', label: 'Punch Out' },
    { type: 'punchIn', label: 'Punch In' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {approvalTypes.map(({ type, label }) => (
            <TouchableOpacity
              key={type}
              style={[styles.toggleButton, activeRequestType === type && styles.activeButton]}
              onPress={() => setActiveRequestType(type)}
            >
              <Text style={[styles.buttonText, activeRequestType === type && styles.activeButtonText]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {renderRequestComponent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonWrapper: {
    paddingTop: 20,
  },
  scrollViewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    marginBottom: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#ffb300',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ffb300',
  },
  buttonText: {
    fontSize: 14,
    color: '#777',
  },
  activeButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
  },
  placeholderText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});

export default ApprovalRequest;
