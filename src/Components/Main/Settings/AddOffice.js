import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { useAuth } from "../../../Context/auth.context.js";
import getUserLocation from "../Home/utils/getUerLocation.js";

const AddOffice = ({ navigation }) => {
  const [uniqueCode, setUniqueCode] = useState("");
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [attendanceRadius, setAttendanceRadius] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [noReplyEmail, setNoReplyEmail] = useState("");
  const [noReplyEmailAppPassword, setNoReplyEmailAppPassword] = useState("");
  const [GSTNumber, setGSTNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [bankName, setBankName] = useState("");
  const [IFSCCode, setIFSCCode] = useState("");
  const { validToken } = useAuth();

  async function fetchLatLong() {
    const position = await getUserLocation();

    if (!position) {
      Toast.show({ type: "error", text1: "Please enable location" });
      return;
    };

    const { latitude, longitude } = position;

    setLatitude(String(latitude));
    setLongitude(String(longitude));
  };

  useEffect(() => {
    fetchLatLong();
  }, []);

  const selectLogo = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          Toast.show({ type: "info", text1: "Image selection cancelled" });
        } else if (response.errorCode) {
          Toast.show({ type: "error", text1: "Image selection error" });
        } else {
          setLogo(response.assets[0]);
        };
      },
    );
  };

  const handleSubmit = async () => {
    if (
      !uniqueCode ||
      !name ||
      !email ||
      !contact ||
      !latitude ||
      !longitude ||
      !attendanceRadius ||
      !addressLine1 ||
      !addressLine2 ||
      !addressLine3 ||
      !GSTNumber ||
      !noReplyEmail ||
      !noReplyEmailAppPassword ||
      !accountName ||
      !accountNumber ||
      !accountType ||
      !bankName ||
      !IFSCCode ||
      !websiteLink
    ) {
      Toast.show({ type: "error", text1: "All fields are required." });
      return;
    };

    const formData = new FormData();
    formData.append("uniqueCode", uniqueCode);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("attendanceRadius", attendanceRadius);
    formData.append("addressLine1", addressLine1);
    formData.append("addressLine2", addressLine2);
    formData.append("addressLine3", addressLine3);
    formData.append("GSTNumber", GSTNumber);
    formData.append("noReplyEmail", noReplyEmail);
    formData.append("noReplyEmailAppPassword", noReplyEmailAppPassword);
    formData.append("bankName", bankName);
    formData.append("IFSCCode", IFSCCode);
    formData.append("accountName", accountName);
    formData.append("accountNumber", accountNumber);
    formData.append("accountType", accountType);
    formData.append("websiteLink", websiteLink);

    // Append logo
    if (logo && logo.uri) {
      formData.append("logo", {
        uri: logo.uri,
        type: logo.type,
        name: logo.fileName,
      });
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/officeLocation/create-officeLocation`,
        formData,
        {
          headers: {
            Authorization: validToken,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.success) {
        setName("");
        setLogo(null);
        setEmail("");
        setContact("");
        setLatitude("");
        setLongitude("");
        setAttendanceRadius("");
        setAddressLine1("");
        setAddressLine2("");
        setAddressLine3("");
        setNoReplyEmail("");
        setNoReplyEmailAppPassword("");
        setGSTNumber("");
        setAccountName("");
        setAccountNumber("");
        setAccountType("");
        setBankName("");
        setIFSCCode("");
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      };
    } catch (error) {
      console.log("Error:", error.message);
      Toast.show({ type: "error", text1: error.response?.data?.message || "An error occurred" });
    };
  };

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
        <Text style={styles.headerTitle}>Add Office</Text>
        <TouchableOpacity style={styles.buttonReset} onPress={fetchLatLong}>
          <Text style={styles.buttonResetText}>Reset Location</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.container}>
          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Unique Code <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={uniqueCode}
              onChangeText={setUniqueCode}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Company Name <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Website Link <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={websiteLink}
              onChangeText={setWebsiteLink}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              GST Number <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={GSTNumber}
              onChangeText={setGSTNumber}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>Upload Logo <Text style={{ color: "red" }}>*</Text></Text>
            <TouchableOpacity onPress={selectLogo} style={styles.logoButton}>
              <Text style={styles.logoButtonText}></Text>
            </TouchableOpacity>
          </View>

          {logo && (
            <Image source={{ uri: logo.uri }} style={styles.logoPreview} />
          )}

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Email ID <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Contact Number <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={contact}
              onChangeText={setContact}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              No Reply Email <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={noReplyEmail}
              onChangeText={setNoReplyEmail}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              No Reply Email App Password <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={noReplyEmailAppPassword}
              onChangeText={setNoReplyEmailAppPassword}
              style={styles.input}
            />
          </View>

          <Text style={{ textAlign: "center", marginTop: 20, marginBottom: 5, color: "#333", fontWeight: "500" }}>Bank Detail</Text>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Account Number <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              IFSC Code <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={IFSCCode}
              onChangeText={setIFSCCode}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Account Name <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={accountName}
              onChangeText={setAccountName}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Account Number <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Account Type <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={accountType}
              onChangeText={setAccountType}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Bank Name <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={bankName}
              onChangeText={setBankName}
              style={styles.input}
            />
          </View>

          <Text style={{ textAlign: "center", marginTop: 20, marginBottom: 5, color: "#333", fontWeight: "500" }}>Location Detail</Text>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Latitude <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={latitude}
              onChangeText={setLatitude}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Longitude <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={longitude}
              onChangeText={setLongitude}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Attendance Radius (in meters) <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={attendanceRadius}
              onChangeText={setAttendanceRadius}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Address Line 1 <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={addressLine1}
              onChangeText={setAddressLine1}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Address Line 2 <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput
              value={addressLine2}
              onChangeText={setAddressLine2}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Address Line 3 <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput
              value={addressLine3}
              onChangeText={setAddressLine3}
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  buttonReset: {
    backgroundColor: "#ffb300",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonResetText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
  input: {
    padding: 16,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#777",
  },
  logoButton: {
    backgroundColor: "#fff",
    padding: 10,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 12,
  },
  logoButtonText: {
    color: "#777",
    fontWeight: "400",
  },
  logoPreview: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default AddOffice;
