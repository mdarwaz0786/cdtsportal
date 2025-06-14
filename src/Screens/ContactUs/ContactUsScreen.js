import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import { WebView } from "react-native-webview";
import axios from "axios";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";

const ContactUsScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");

  const initialURL = "https://www.google.com/maps/place/Code+Diffusion+-+Mobile+Application+Development+Company+in+Delhi/@28.6290378,77.0703847,2542m/data=!3m3!1e3!4b1!5s0x396421a66a15b5f7:0x171170d419f52b5f!4m6!3m5!1s0x390d053a2359d897:0x7ade773a38d4c83d!8m2!3d28.6290194!4d77.0806845!16s%2Fg%2F11c2p478_s?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D";

  const handleContactPress = (url) => {
    Linking.openURL(url);
  };

  const openGoogleMaps = () => {
    Linking.openURL(initialURL);
  };

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !message.trim() ||
      !selectedServiceType
    ) {
      Toast.show({ type: "error", text1: "All fields are required." });
      return;
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/enquiry/create-enquiry`, { name, email, mobile, message, serviceType: selectedServiceType },
      );

      if (response?.data?.success) {
        setName("");
        setEmail("");
        setMobile("");
        setMessage("");
        setSelectedServiceType("");
        Toast.show({ type: "success", text1: "Submitted successfully" });
        navigation.goBack();
      };
    } catch (error) {
      console.log("Error:", error.message);
      Toast.show({ type: "error", text1: error?.response?.data?.message || "An error occurred" });
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
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.description}>
          Have questions or want to start a project? We're here to help!
        </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter Name"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          placeholder="Enter Mobile"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
        />
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={selectedServiceType}
            onValueChange={(itemValue) => {
              if (itemValue) setSelectedServiceType(itemValue);
            }}
          >
            <Picker.Item label="Service Type" value={null} />
            <Picker.Item label="Web Designing" value="Web Designing" />
            <Picker.Item label="Web Development" value="Web Development" />
            <Picker.Item label="E-Commerce Solution" value="E-Commerce Solution" />
            <Picker.Item label="Mobile Application" value="Mobile Application" />
            <Picker.Item label="Social Media Optimization" value="Social Media Optimization" />
            <Picker.Item label="Industrial Training" value="Industrial Training" />
          </Picker>
        </View>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={message}
          onChangeText={setMessage}
          placeholder="Enter Message"
          placeholderTextColor="#aaa"
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Get in Touch</Text>
          <TouchableOpacity onPress={openGoogleMaps}>
            <Text style={styles.contactText}>📍 Plot no 24, 2nd floor Sewak park Dwarka more New delhi - 110059</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleContactPress('mailto:info@codediffusion.in')}>
            <Text style={styles.contactText}>📩 info@codediffusion.in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleContactPress('tel:+91-7827114607')}>
            <Text style={styles.contactText}>📞 +91-7827114607</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleContactPress('https://www.codediffusion.in')}>
            <Text style={styles.contactText}>🌍 www.codediffusion.in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapWrapper}>
          <View style={styles.mapContainer}>
            <WebView
              source={{ uri: initialURL }}
              nestedScrollEnabled={true}
              style={{ flex: 1 }}
              onShouldStartLoadWithRequest={(event) => {
                const { url } = event;
                if (!url.includes(initialURL)) {
                  Linking.openURL(url);
                  return false;
                };
                return true;
              }}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
    paddingTop: 10,
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
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    color: "#777",
    padding: 8,
    paddingLeft: 16,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
    paddingLeft: 16,
    paddingTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: "#fff",
    width: "100%",
    height: 45,
    justifyContent: Platform.OS === "android" ? "center" : "flex-end",
    paddingLeft: 8,
  },
  picker: {
    color: "#999",
  },
  pickerItem: {
    color: "#999",
  },
  button: {
    backgroundColor: "#ffb300",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  contactSection: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 12,
    paddingLeft: 16,
    marginTop: 30,
    borderRadius: 10
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  contactText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  mapWrapper: {
    width: "100%",
    height: 500,
    marginTop: 30,
    borderRadius: 10,
    overflow: "hidden",
  },
  mapContainer: {
    flex: 1,
  },
});

export default ContactUsScreen;
