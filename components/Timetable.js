import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider, ScrollView } from "native-base";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";

const TimeTable = () => {
  const timetabledata = useSelector((state) => state.appdata.timetable);
  
  function convertToTimetable(data) {
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const result = [];
  
    const extractTime = (timeSlot) => {
      const [start] = timeSlot.split(" to ");
      return start;
    };
  
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;  
    };
  
    daysOfWeek.forEach((day) => {
      if (data[day] && data[day].length > 0) {
        const slots = data[day]
          .map((entry) => {
            return {
              time: `${entry.timeslots}`,
              subject: `${entry.subject_name}`,
              code: `${entry.subjecT_CODE}`,
              faculty: `${entry.emp_name}`
            };
          })
          .sort((a, b) => timeToMinutes(extractTime(a.time)) - timeToMinutes(extractTime(b.time)));  
  
        result.push({
          day: day.charAt(0).toUpperCase() + day.slice(1),  
          slots: slots,
        });
      } else {
        result.push({
          day: day.charAt(0).toUpperCase() + day.slice(1),
          slots: [],  
        });
      }
    });
  
    return result;
  }
  
  const timetableData = convertToTimetable(timetabledata);
   
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
  const today = new Date();
  let todayslectDay = weekday[today.getDay()];
 
  const [selectedDay, setSelectedDay] = useState(todayslectDay);

  const renderSlot = ({ item }) => (
    <View style={styles.slot}>
      <View style={styles.slotHeader}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.codeContainer}>
          <Text style={styles.code}>{item.code}</Text>
        </View>
      </View>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.faculty}>{item.faculty}</Text>
    </View>
  );

  const renderDaySelector = ({ item }) => {
    const isSelected = selectedDay === item.day;
    const dayAbbr = item.day.charAt(0) + item.day.charAt(1) + item.day.charAt(2);
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedDay(item.day)}
        style={styles.dayButton}
        activeOpacity={0.8}
      >
        <View style={[styles.dayContainer, isSelected && styles.selectedDay]}>
          <Text style={[styles.dayLabel, !isSelected && styles.inactiveDayText]}>
            {dayAbbr}
          </Text>
          {isSelected && <View style={styles.selectedIndicator} />}
        </View>
      </TouchableOpacity>
    );
  };

  const selectedData = timetableData.find((day) => day.day === selectedDay);
 
  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <View style={styles.container}>
          <View style={styles.layout}>
            {/* Day Selector */}
            <View style={styles.daySelectorContainer}>
              <FlatList
                horizontal
                data={timetableData}
                renderItem={renderDaySelector}
                keyExtractor={(item) => item.day}
                showsHorizontalScrollIndicator={false}
                style={styles.daySelectorList}
                contentContainerStyle={styles.daySelectorContent}
              />
            </View>

            {/* Slots Container */}
            <View style={styles.slotsContainer}>
              <View style={styles.dayTitleContainer}>
                <Text style={styles.dayTitle}>{selectedDay}</Text>
                <Text style={styles.slotCount}>
                  {selectedData.slots.length} {selectedData.slots.length === 1 ? 'class' : 'classes'}
                </Text>
              </View>
              
              <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {selectedData.slots.length > 0 ? (
                  <FlatList
                    nestedScrollEnabled
                    data={selectedData.slots}
                    renderItem={renderSlot}
                    keyExtractor={(slot, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                ) : (
                  <View style={styles.noSlotsContainer}>
                    <Text style={styles.noSlotsText}>No classes scheduled</Text>
                    <Text style={styles.noSlotsSubText}>Enjoy your free day!</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  layout: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  
  // Day Selector Styles
  daySelectorContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 12,
  },
  daySelectorList: {
    flexGrow: 0,
  },
  daySelectorContent: {
    paddingHorizontal: 4,
  },
  dayButton: {
    marginHorizontal: 4,
  },
  dayContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    alignItems: "center",
    minWidth: 60,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  selectedDay: {
    backgroundColor: "#007367",
    borderColor: "#007367",
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  inactiveDayText: {
    color: "#64748b",
  },
  selectedIndicator: {
    width: 3,
    height: 3,
    backgroundColor: "#ffffff",
    borderRadius: 1.5,
    marginTop: 3,
  },
  
  // Slots Container Styles
  slotsContainer: {
    flex: 1,
  },
  dayTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007367",
  },
  slotCount: {
    fontSize: 12,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden",
  },
  
  // Scroll View Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  separator: {
    height: 6,
  },
  
  // Slot Styles
  slot: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#007367",
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  timeContainer: {
    backgroundColor: "#e6f7f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  time: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007367",
  },
  codeContainer: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  code: {
    fontSize: 10,
    fontWeight: "500",
    color: "#166534",
  },
  subject: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 3,
    lineHeight: 20,
  },
  faculty: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  
  // No Slots Styles
  noSlotsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  noSlotsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 6,
  },
  noSlotsSubText: {
    fontSize: 12,
    color: "#94a3b8",
  },
});

export default TimeTable;