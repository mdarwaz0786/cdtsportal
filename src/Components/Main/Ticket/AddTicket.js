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
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { useAuth } from "../../../Context/auth.context.js";

const AddTicket = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [project, setProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [image, setImage] = useState(null);
  const { validToken } = useAuth();

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/project/all-project`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setProject(response?.data?.project);
      };
    } catch (error) {
      console.log("Error:", error?.message || "Unknown Error");
    };
  };

  useEffect(() => {
    if (validToken) {
      fetchProject();
    };
  }, [validToken]);

  const selectImage = () => {
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
          setImage(response.assets[0]);
        };
      },
    );
  };

  const handleSubmit = async () => {
    if (!title || !description || !priority || !ticketType) {
      Toast.show({ type: "error", text1: "All fields are required." });
      return;
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", priority);
    formData.append("ticketType", ticketType);
    formData.append("projectId", selectedProject);

    if (image && image.uri) {
      formData.append("image", {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/ticket/create-ticket`,
        formData,
        {
          headers: {
            Authorization: validToken,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.success) {
        setTitle("");
        setPriority("");
        setTicketType("");
        setSelectedProject("");
        setImage(null);
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
        <Text style={styles.headerTitle}>Raise Ticket</Text>
      </View>

      <ScrollView>
        <View style={styles.container}>
          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Ticket Title <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
              placeholderTextColor="#777"
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Ticket Type <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ticketType}
                onValueChange={(itemValue) => setTicketType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item style={styles.pickerItem} label="Select type" value="" />
                <Picker.Item style={styles.pickerItem} label="Bug" value="Bug" />
                <Picker.Item style={styles.pickerItem} label="Feature Request" value="Feature Request" />
                <Picker.Item style={styles.pickerItem} label="Improvement" value="Improvement" />
                <Picker.Item style={styles.pickerItem} label="Task" value="Task" />
                <Picker.Item style={styles.pickerItem} label="Support" value="Support" />
                <Picker.Item style={styles.pickerItem} label="Incident" value="Incident" />
              </Picker>
            </View>
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Ticket Priority <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={priority}
                onValueChange={(itemValue) => setPriority(itemValue)}
                style={styles.picker}
              >
                <Picker.Item style={styles.pickerItem} label="Select priority" value="" />
                <Picker.Item style={styles.pickerItem} label="Low" value="Low" />
                <Picker.Item style={styles.pickerItem} label="Medium" value="Medium" />
                <Picker.Item style={styles.pickerItem} label="High" value="High" />
              </Picker>
            </View>
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Project Name <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedProject}
                onValueChange={(itemValue) => setSelectedProject(itemValue)}
                style={styles.picker}
              >
                <Picker.Item style={styles.pickerItem} label="Select project" value="" />
                {
                  project?.map((p) => (
                    <Picker.Item style={styles.pickerItem} key={p?._id} label={p?.projectName} value={p?._id} />
                  ))
                }
              </Picker>
            </View>
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>
              Description <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              placeholder="write description"
              placeholderTextColor="#777"
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text style={{ marginBottom: 5, color: "#555" }}>Upload Image</Text>
            <TouchableOpacity onPress={selectImage} style={styles.imageButton}>
              <Text style={styles.imageButtonText}></Text>
            </TouchableOpacity>
          </View>

          {image && (
            <Image source={{ uri: image?.uri }} style={styles.imagePreview} />
          )}

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
    color: "#555",
  },
  textArea: {
    height: 150,
    borderRadius: 5,
    textAlignVertical: "top",
    color: "#555"
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: "#fff",
    height: 45,
    justifyContent: Platform.OS === "android" ? "center" : "flex-end",
    paddingLeft: 8,
  },
  picker: {
    color: "#777",
  },
  pickerItem: {
    fontSize: 14,
  },
  imageButton: {
    backgroundColor: "#fff",
    padding: 10,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 12,
  },
  imageButtonText: {
    color: "#333",
    fontWeight: "400",
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default AddTicket;
