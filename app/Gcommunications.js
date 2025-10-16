import { Button, HStack, Text, View, Menu, Pressable, Icon, FlatList, Spinner, ScrollView } from "native-base";
import Header from "../components/Header";
import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { APIURl1, MOBILEAPI, MOBILEAPIKEY } from "../utilities/Apiurl";
import axios from "axios";
import moment from "moment";
import { Actionsheet, useDisclose } from "native-base";
import CommonSearchBar from "../components/CommonSearchBar";
import NotificationPermission from "../components/NotificationPermission";
const Gcommunications = () => {
  const [selectedFilter, setSelectedFilter] = useState("Filter Alerts");
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const user = useSelector((state) => state.appdata.user);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const url = `${MOBILEAPI}/getcommunications`;

     
      if(user.role === "Parent"){
        var user_id = user.parent_mobile;
      }else if(user.role === "staff"){
        var user_id = user.regdno;  
      }else{
        var user_id = user.regdno;  
      }

      const response = await axios.post(
        url,
        { user_id:user_id },
        { headers: { Authorization: `Bearer ${MOBILEAPIKEY}` } }
      );

      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    const searchLower = search.toLowerCase();
    const titleLower = item.title?.toLowerCase() || "";
    const messageLower = item.message?.toLowerCase() || "";
  
    if (activeTab === "Unread" && item.status !== 1) return false;
    if (activeTab === "Read" && item.status !== 2) return false;
    if (selectedFilter !== "Filter Alerts" && item.category !== selectedFilter) return false;
    
    // Apply search filter
    if (search && !titleLower.includes(searchLower) && !messageLower.includes(searchLower)) return false;
  
    return true;
  });
  
  const getIcon = (type) => {
    const iconStyle = {
      size: 24,
      color: "#007367",
    };

    switch (type) {
      case "Event":
        return <Ionicons name="calendar" {...iconStyle} />;
      case "Announcement":
        return <MaterialIcons name="campaign" {...iconStyle} />;
      case "Proceedings":
        return <FontAwesome5 name="file-alt" {...iconStyle} />;
      case "Circular":
        return <Ionicons name="document-text" {...iconStyle} />;
      default:
        return <Ionicons name="notifications" {...iconStyle} />;
    }
  };
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  const handleNotificationPress = async (item) => {
    
    setSelectedNotification(item);
    onOpen();
  
    if (item.status === 1) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === item.id ? { ...n, status: 2 } : n
        )
      );
      try {
        const response = await axios.post(
          `${MOBILEAPI}/updatenotificationstatus`,
          { id: item.id },
          { headers: { Authorization: `Bearer ${MOBILEAPIKEY}` } }
        );
       
        if (response.data.success) {
          // setNotifications((prev) =>
          //   prev.map((n) =>
          //     n.id === item.id ? { ...n, status: 1 } : n
          //   )
          // );
        }
      } catch (error) {
        console.error("Error updating notification:", error.message);
      }
    }
  };

  return (
    <>
      <Header
        title="Notifications"
        rightComponent={
          <TouchableOpacity onPress={fetchNotifications} style={{ padding: 10 }}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        }
      />

      <View style={styles.main}>
        <View style={styles.body}>
          {/* Filter Buttons */}
          <HStack space={3} alignItems="center"   paddingHorizontal={15} paddingTop={15}>
            <Button
              variant="solid"
              style={[styles.button, activeTab === "All" && styles.activeButton]}
              onPress={() => setActiveTab("All")}
              _text={activeTab === "All" ? styles.activeButtonText : styles.buttonText}
            >
              All
            </Button>
            <Button
              variant="solid"
              style={[styles.button, activeTab === "Read" && styles.activeButton]}
              onPress={() => setActiveTab("Read")}
              _text={activeTab === "Read" ? styles.activeButtonText : styles.buttonText}
            >
              Read
            </Button>
            <Button
              variant="solid"
              style={[styles.button, activeTab === "Unread" && styles.activeButton]}
              onPress={() => setActiveTab("Unread")}
              _text={activeTab === "Unread" ? styles.activeButtonText : styles.buttonText}
            >
              Unread
            </Button>

            {/* <Menu
              w="190"
              trigger={(triggerProps) => (
                <Pressable {...triggerProps} style={[styles.button, styles.filterButton]}>
                  <Icon as={Ionicons} name="filter" size="sm" color="#007367" style={styles.filterIcon} />
                  <Text style={selectedFilter !== "Filter Alerts" ? styles.activeButtonText1 : styles.buttonText}>
                    {selectedFilter}
                  </Text>
                </Pressable>
              )}
            >
              <Menu.Item onPress={() => setSelectedFilter("Filter Alerts")}>All</Menu.Item>
              <Menu.Item onPress={() => setSelectedFilter("HRMS")}>HRMS</Menu.Item>
              <Menu.Item onPress={() => setSelectedFilter("EVENTS")}>EVENTS</Menu.Item>
              <Menu.Item onPress={() => setSelectedFilter("G-Learn")}>G-Learn</Menu.Item>
            </Menu> */}
          </HStack>
<CommonSearchBar setSearch={setSearch}/>
          {/* Notifications List */}

<NotificationPermission />


          {loading ? (
            <Spinner size="lg" color="#007367" mt={5} />
          ) : filteredNotifications.length > 0 ? (
            <FlatList
              data={filteredNotifications}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                 
                var addedOn = item.added_on ? moment(item.added_on).utcOffset(5 * 60 + 30) : null; // Convert to IST (UTC +5:30)
                let dateTime = "Unknown Date";
                
                if (addedOn) {
                  // Get the exact difference in hours and minutes
                  const hoursAgo = moment().diff(addedOn, 'hours');
                  const minutesAgo = moment().diff(addedOn, 'minutes');
                 
                  // If the time difference is greater than 22 hours, show the full date in 12-hour format
                  if (hoursAgo >= 22) {
                    dateTime = addedOn.format("DD MMM YYYY, hh:mm A"); // 12-hour format with AM/PM
                  } else {
                    dateTime = addedOn.fromNow();  // For times between 1 hour and 22 hours
                  }
                }
                
                  
                
                
              
                const bodyText = item.message ? (item.message.length > 40 ? `${item.message.slice(0, 40)}...` : item.message) : "No description";
                return (
                  <TouchableOpacity onPress={() => handleNotificationPress(item)}>
                  <View style={[styles.notificationCard, item.status === 1 && styles.unreadNotification]}>
                    <HStack alignItems="center" space={3}>
                      <View style={styles.iconContainer}>
                      {getIcon(item.type_of_communication)}
                      </View>
                      <View w={'85%'}>
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        <Text style={styles.notificationCategory}>
                          {bodyText}
                        </Text>
                        <Text style={styles.notificationTime}>{dateTime}</Text>
                      </View>
                    </HStack>
                  </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <Text style={styles.noNotifications}>No notifications found.</Text>
          )}
        </View>
      
        <Actionsheet isOpen={isOpen} onClose={onClose}>
  <Actionsheet.Content>
    {selectedNotification && (
      <ScrollView style={{ width: "100%", padding: 15,paddingBottom: 30 }}>
        {/* Notification Title */}
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#007367", marginBottom: 5 }}>
          {selectedNotification.title}
        </Text>

        {/* Notification Date-Time */}
        <Text style={{ fontSize: 14, color: "#555", marginBottom: 10 }}>
          {moment(selectedNotification.added_on).format("DD MMM YYYY, hh:mm A")}
        </Text>

        {/* Notification Body */}
        <Text style={{ fontSize: 16, color: "#999", lineHeight: 22,marginBottom: 10 }}>
          {selectedNotification.message}
        </Text>

        <Text style={{ fontSize: 14, color: "#333", lineHeight: 22 }}>
          {selectedNotification.data}
        </Text>

        {/* Links Section */}
        {selectedNotification.mainlinks &&
          selectedNotification.mainlinks.split(",").map((link, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => Linking.openURL(link.trim())}
              style={{
                marginTop: 10,
                padding: 10,
                borderColor: "#007367",
                borderRadius: 10,
                borderWidth:1
              }}
            >
              <Text style={{ color: "#007367", fontSize: 14, textAlign: "center" }}>
                Open Link {index + 1}
              </Text>
            </TouchableOpacity>
          ))}

        {/* Attachment (if available) */}
        {selectedNotification.attachment_url && (
          <TouchableOpacity
            onPress={() => Linking.openURL(selectedNotification.attachment_url)}
            style={{
              marginTop: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              backgroundColor: "#f8f8f8",
              borderRadius: 5,
            }}
          >
            <FontAwesome5 name="file-pdf" size={20} color="red" style={{ marginRight: 5 }} />
            <Text style={{ fontSize: 14, color: "#007367" }}>Download Attachment</Text>
          </TouchableOpacity>
        )}

        {/* Close Button */}
        <Button mt={4} colorScheme="primary" onPress={onClose} marginBottom={10}>
          Close
        </Button>
      </ScrollView>
    )}
  </Actionsheet.Content>
</Actionsheet>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#007367",
    flex: 1,
  },
  body: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
     
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 20,
    borderColor: "#007367",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 1,
    paddingVertical: 10,
    backgroundColor: "white",
    width: "31%",
   
  },
  activeButton: {
    backgroundColor: "#007367",
  },
  filterButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    marginRight: 5,
  },
  buttonText: {
    color: "#007367",
    fontWeight: "bold",
    fontSize: 12,
  },
  activeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  activeButtonText1: {
    color: "#007367",
    fontWeight: "bold",
  },
  notificationCard: {
    backgroundColor: "#f2f2f2",
    padding: 15,
     
    borderBottomWidth:1,
    borderBottomColor: "#ccc",
    
  },
  unreadNotification: {
    backgroundColor: "#fff",
    borderLeftColor: "#ff3b30",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007367",
    flexWrap: "wrap",        // allow text to wrap
    flexShrink: 1,           // allow shrinkage when needed
    lineHeight: 22,          // optional, improves readability
  },
  notificationCategory: {
    fontSize: 14,
    color: "#777",
    fontWeight: "bold",
  },
  notificationTime: {
    fontSize: 14,
    color: "#007367",
    marginTop: 5,
    width: "100%",
  },
  noNotifications: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
  iconContainer:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F4E4C9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  }
});

export default Gcommunications;
