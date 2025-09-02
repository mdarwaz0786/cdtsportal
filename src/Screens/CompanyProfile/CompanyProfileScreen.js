import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../Context/auth.context.js";
import Icon from "react-native-vector-icons/Ionicons";

const CompanyProfileScreen = ({ navigation }) => {
  const { team, isLoggedIn, logOutTeam } = useAuth();

  const handleLogout = () => {
    logOutTeam();
    navigation.navigate("Home");
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
      >
        <View style={styles.detailsCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {team?.companyName[0]?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{team?.companyName}</Text>
            <Text style={styles.designation}>{team?.role?.name}</Text>
          </View>
          {isLoggedIn && (
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Icon name="log-out-outline" size={24} color="#ffb300" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoCard}>
          <DetailRow label="Mobile" value={team?.mobile} />
          <DetailRow label="Email" value={team?.email} />
        </View>
      </ScrollView>
    </>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}: </Text>
    <Text style={styles.detailValue}>{value || "NA"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  avatarContainer: {
    height: 35,
    width: 35,
    borderRadius: 30,
    backgroundColor: "#ffb300",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
  },
  designation: {
    fontSize: 14,
    color: "#6c757d",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: "#333",
  },
  detailValue: {
    fontSize: 14,
    color: "#555",
  },
  editButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  modalContainer: {
    marginTop: 50,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 12,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  modalHeader: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 3,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: "#555",
    backgroundColor: "#fff",
  },
  dateInput: {
    paddingVertical: 12,
    paddingLeft: 15,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default CompanyProfileScreen;
