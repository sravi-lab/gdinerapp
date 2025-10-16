import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, HStack, Icon, Select, CheckIcon } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const months = [
  { label: "JAN", value: "01" },
  { label: "FEB", value: "02" },
  { label: "MAR", value: "03" },
  { label: "APR", value: "04" },
  { label: "MAY", value: "05" },
  { label: "JUN", value: "06" },
  { label: "JUL", value: "07" },
  { label: "AUG", value: "08" },
  { label: "SEP", value: "09" },
  { label: "OCT", value: "10" },
  { label: "NOV", value: "11" },
  { label: "DEC", value: "12" },
];

const getLastYears = (count) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => currentYear - i);
};

const PayslipFilter = (props) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const years = getLastYears(8); // Get the last 8 years

  const handlePress = () => {
    if (selectedMonth && selectedYear) {
      // Call the fetchProfiles function from props with month and year
      props.fetchProfiles(selectedMonth, selectedYear);
    } else {
      Alert.alert("Please select both month and year");
    }
  };

  return (
    <HStack style={styles.card} space={3} alignItems="center">
      <Select
        placeholder="Month"
        selectedValue={selectedMonth}
        minWidth="30%"
        accessibilityLabel="Select Month"
        onValueChange={(value) => setSelectedMonth(value)}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="3" />,
        }}
        
      >
        {months.map((month) => (
          <Select.Item key={month.value} label={month.label} value={month.value} />
        ))}
      </Select>

      <Select
        placeholder="Year"
        selectedValue={selectedYear}
        minWidth="30%"
        accessibilityLabel="Select Year"
        onValueChange={(value) => setSelectedYear(value)}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="3" />,
        }}
        
      >
        {years.map((year) => (
          <Select.Item key={year} label={`${year}`} value={`${year}`}  />
        ))}
      </Select>

      <Button
        leftIcon={<Icon as={Ionicons} name="search" size={"md"} color={"white"} />}
        onPress={handlePress}
        bg={"#005C52"}
      >
        Search
      </Button>
    </HStack>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    display: "flex",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 9 },
    padding: 10,
    borderRadius: 8,
    width:"100%"
  },
});

export default PayslipFilter;
