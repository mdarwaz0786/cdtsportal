import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";

const Settings = ({ navigation }) => {
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [office, setOffice] = useState([]);
  const [popupVisible, setPopupVisible] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [officeToDelete, setOfficeToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOfficeLocation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/officeLocation/all-officeLocation`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setOffice(response?.data?.officeLocation);
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
      fetchOfficeLocation();
    };
  }, [validToken, refreshKey]);

  const handleDelete = async () => {
    if (confirmationText.toLowerCase() === "yes" && officeToDelete) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/api/v1/officeLocation/delete-officeLocation/${officeToDelete}`,
          {
            headers: {
              Authorization: validToken,
            },
          },
        );

        if (response?.data?.success) {
          fetchOfficeLocation();
          Toast.show({ type: "success", text1: "Deleted successfully" });
        };
      } catch (error) {
        console.log("Error:", error.message);
      } finally {
        setConfirmationVisible(false);
        setPopupVisible(null);
        setOfficeToDelete(null);
        setConfirmationText("");
      };
    } else {
      alert('Please type "yes" to confirm deletion.');
    };
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const renderOfficeCard = (item) => (
    <View style={styles.card} key={item?._id}>
      <View style={styles.cardHeader}>
        {item?.logo ? (
          <Image source={{ uri: item?.logo }} style={styles.logo} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Logo</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() =>
            setPopupVisible(popupVisible === item?._id ? null : item?._id)
          }>
          <Icon name="more-vertical" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Unique Code: </Text>{item?.uniqueCode}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Company Name: </Text>{item?.name}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>GST Number: </Text>{item?.GSTNumber}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Website Link: </Text>{item?.websiteLink}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Email ID: </Text>{item?.email}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Contact Number: </Text>{item?.contact}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>No Reply Email: </Text>{item?.noReplyEmail}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>No Reply Email App Password: </Text>{item?.noReplyEmailAppPassword}</Text>
      <Text style={{ textAlign: "center", marginTop: 20, marginBottom: 5, color: "#333", fontWeight: "500" }}>Bank Detail</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Account Number: </Text>{item?.accountNumber}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>IFSC Code: </Text>{item?.IFSCCode}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Account Name: </Text>{item?.accountName}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Account Type: </Text>{item?.accountType}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Bank Name: </Text>{item?.bankName}</Text>
      <Text style={{ textAlign: "center", marginTop: 20, marginBottom: 5, color: "#333", fontWeight: "500" }}>Location Detail</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Latitude: </Text>{item?.latitude}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Longitude: </Text>{item?.longitude}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Attendance Raduis: </Text>{item?.attendanceRadius} meters</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Address Line 1: </Text>{item?.addressLine1}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Address Line 2: </Text>{item?.addressLine2}</Text>
      <Text style={styles.cardDetail}><Text style={styles.cardLabel}>Address Line 3: </Text>{item?.addressLine3}</Text>

      {/* Popup for Edit/Delete */}
      {popupVisible === item?._id && (
        <View style={styles.popup}>
          <TouchableOpacity
            style={styles.popupOption}
            onPress={() => {
              setPopupVisible(null);
              navigation.navigate("EditOffice", { id: item?._id });
            }}>
            <Text style={styles.popupOptionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.popupOption, styles.deleteOption]}
            onPress={() => {
              setOfficeToDelete(item?._id);
              setConfirmationVisible(true);
            }}>
            <Text style={styles.popupOptionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.container}>
        {/* Add New Office Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddOffice")}>
          <Text style={styles.addButtonText}>Add New Office</Text>
        </TouchableOpacity>

        {/* Office Locations */}
        <Text style={styles.pageTitle}>Our Offices</Text>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#ffb300" />
          </View>
        ) : office?.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#777" }}>Office not found.</Text>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            <Pressable onPress={() => setPopupVisible(null)}>
              {office?.map(item => renderOfficeCard(item))}
            </Pressable>
          </ScrollView>
        )}
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={confirmationVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setConfirmationVisible(false);
          setConfirmationText("");
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Type <Text style={styles.modalHighlight}>"yes"</Text> to confirm
              the deletion.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={confirmationText}
              onChangeText={setConfirmationText}
              placeholderTextColor="#777"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDelete}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setConfirmationVisible(false);
                  setPopupVisible(null);
                  setConfirmationText("");
                }}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  placeholder: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 12,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  addButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  pageTitle: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 8,
    textAlign: "center",
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    paddingTop: 5,
    marginBottom: 13,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: "stretch",
  },
  cardDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  cardLabel: {
    color: "#333",
  },
  popup: {
    position: "absolute",
    top: 50,
    right: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  popupOption: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  popupOptionText: {
    fontSize: 14,
    color: "#555",
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    paddingTop: 12,
    alignItems: "center",
  },
  modalText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  modalHighlight: {
    fontWeight: "500",
    color: "#ffb300",
  },
  modalInput: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#777"
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: "#ffb300",
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default Settings;
