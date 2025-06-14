import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "@env";
import formatDate from "../../../Helper/formatDate.js";

const SalarySlip = ({ route }) => {
  const id = route?.params?.id;
  const navigation = useNavigation();
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [employee, setEmployee] = useState("");
  const [salary, setSalary] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const istDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const [month, setMonth] = useState((istDate.slice(5, 7)) - 1);
  const [year, setYear] = useState(istDate.slice(0, 4));

  const fetchSingleEmployee = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/team/single-team/${id}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setEmployee(response?.data?.team);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setRefreshing(false);
    };
  };

  const fetchMonthlySalary = async () => {
    try {
      setLoading(true);

      const params = {};

      if (month) {
        const formattedMonth = month.toString().padStart(2, "0");
        params.month = `${year}-${formattedMonth}`;
      };

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/salary/monthly-salary`,
        {
          params,
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setSalary(response?.data?.salaryData);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (id && month && year && validToken) {
      fetchMonthlySalary();
      fetchSingleEmployee(id);
    };
  }, [id, month, year, validToken, refreshKey]);

  const resetFilters = () => {
    setYear(istDate.slice(0, 4));
    setMonth((istDate.slice(5, 7)) - 1);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const joiningYear = new Date(employee?.joining).getFullYear();
  const employeeSalary = salary?.filter((s) => s?.employeeId === id);

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
        <Text style={styles.headerTitle}>Salary</Text>
        <TouchableOpacity style={styles.buttonReset} onPress={resetFilters}>
          <Text style={styles.buttonResetText}>Reset Filter</Text>
        </TouchableOpacity>
      </View>

      {
        loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#ffb300" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            {/* Filter Section */}
            <View style={styles.pickerRow}>
              {/* Year Picker */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={year}
                  onValueChange={itemValue => setYear(itemValue)}
                  style={styles.picker}>
                  {Array.from({ length: year - joiningYear + 1 }, (_, index) => {
                    const yearOption = year - index;
                    return (
                      <Picker.Item
                        key={yearOption}
                        label={String(yearOption)}
                        value={yearOption}
                        style={styles.pickerItem}
                      />
                    );
                  })}
                </Picker>
              </View>

              {/* Month Picker */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={month.toString()}
                  onValueChange={itemValue => setMonth(itemValue)}
                  style={styles.picker}
                >
                  {monthNames?.map((month, index) => (
                    <Picker.Item
                      key={index}
                      label={month}
                      value={(index + 1).toString()}
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Employee Name */}
            <View style={styles.headerContainer}>
              <Text style={{ fontSize: 14, fontWeight: "400", color: "#333" }}>{employee?.name}</Text>
            </View>

            {employeeSalary?.map((s, i) => (
              <View key={i} style={[styles.container, { marginBottom: 15 }]}>
                <Text style={{ textAlign: "center", color: "#333", marginBottom: 5 }}>Attendance Summary</Text>
                <Text style={styles.salaryText}>Month: {formatDate(s?.month)}</Text>
                <Text style={styles.salaryText}>Total Days in Month: {s?.totalDaysInMonth} Days</Text>
                <Text style={styles.salaryText}>Total Holidays: {s?.totalHolidays} Days</Text>
                <Text style={styles.salaryText}>Total Sundays: {s?.totalSundays} Days</Text>
                <Text style={styles.salaryText}>Total Present Days: {s?.totalPresent} Days</Text>
                <Text style={styles.salaryText}>Total Half Days: {s?.totalHalfDays} Days</Text>
                <Text style={styles.salaryText}>Total Absent Days: {s?.totalAbsent} Days</Text>
                <Text style={styles.salaryText}>Total Comp Off Days: {s?.totalCompOff} Days</Text>
                <Text style={styles.salaryText}>Total Leave Days: {s?.totalOnLeave} Days</Text>
              </View>
            ))}

            {employeeSalary?.map((s, i) => (
              <View key={i} style={styles.container}>
                <Text style={{ textAlign: "center", color: "#333", marginBottom: 5 }}>Salary Calculation</Text>
                <Text style={styles.salaryText}>Company's working Days: {s?.companyWorkingDays} Days</Text>
                <Text style={styles.salaryText}>Company's working Hours: {s?.companyWorkingHours}</Text>
                <Text style={styles.salaryText}>Employee's working Hours: {s?.employeeHoursWorked}</Text>
                <Text style={styles.salaryText}>Shortfall Hours: {s?.employeeHoursShortfall}</Text>
                <Text style={styles.salaryText}>Working Hours/Day: {s?.workingHoursPerDay}</Text>
                <Text style={styles.salaryText}>Total Deduction Days: {s?.deductionDays} Days</Text>
                <Text style={styles.salaryText}>Daily Salary: ₹{s?.dailySalary}</Text>
                <Text style={styles.salaryText}>Total Salary Deducted: ₹{s?.totalDeduction}</Text>
                <Text style={styles.salaryText}>Total Salary: ₹{s?.totalSalary}</Text>
                <Text style={styles.salaryText}>Monthly Salary: ₹{s?.monthlySalary}</Text>
                <TouchableOpacity
                  onPress={() => s?.salaryPaid === false && navigation.navigate("PaySalary", {
                    employee: s?.employeeId,
                    month: month,
                    year: year,
                    totalSalary: s?.totalSalary
                  })}
                  style={styles.button}>
                  <Text style={styles.buttonText}>{s?.salaryPaid === false ? "Pay Salary" : "Paid"}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )
      }
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
  scrollViewContent: {
    padding: 10,
    paddingTop: 0,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
    height: 45,
    width: 165,
    justifyContent: Platform.OS === "android" ? "center" : "flex-end",
    paddingLeft: 8,
  },
  picker: {
    color: "#555",
  },
  pickerItem: {
    fontSize: 14,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  container: {
    backgroundColor: "#fff",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  salaryText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  button: {
    backgroundColor: "#ffb300",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default SalarySlip;
