import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../../Context/auth.context.js";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { useRefresh } from "../../../Context/refresh.context";
import { ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";

const Project = () => {
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const navigation = useNavigation();
  const [project, setProject] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchProject = async (page, isRefreshing = false) => {
    try {

      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      };

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/project/all-project?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        const newProjects = response?.data?.project || [];
        setProject((prev) => (isRefreshing ? newProjects : [...prev, ...newProjects]));
        setHasMore(newProjects?.length === limit);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    };
  };

  useEffect(() => {
    if (validToken) {
      fetchProject(page, true);
    };
  }, [refreshKey, validToken]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
    setPage(1);
    fetchProject(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProject(nextPage);
    };
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ProjectDetail", { id: item?._id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item?.projectName[0]}</Text>
        </View>
        <View>
          <Text style={styles.projectTitle}>{item?.projectName}</Text>
          <Text style={styles.projectSubtitle}>{item?.customer?.name}</Text>
        </View>
      </View>
      <Text style={styles.bottomText}>Project Status: {item?.projectStatus?.status || "NA"}</Text>
      <Text style={styles.bottomText}>Project Deadline: {item?.projectDeadline || "NA"}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Projects</Text>
      </View>

      <View style={styles.container}>
        {loading && project?.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#ffb300" />
          </View>
        ) : project?.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#777" }}>No project.</Text>
        ) : (
          <FlatList
            data={project}
            renderItem={renderItem}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={{ paddingBottom: 16 }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              loadingMore ? (
                <View style={{ marginVertical: 16, alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#ffb300" />
                </View>
              ) : null
            }
          />
        )}
      </View>
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
  },
  card: {
    backgroundColor: "#fff",
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: "#ffb300",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555"
  },
  projectSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  bottomText: {
    marginTop: 1,
    fontWeight: "400",
    color: "#555",
  },
});

export default Project;