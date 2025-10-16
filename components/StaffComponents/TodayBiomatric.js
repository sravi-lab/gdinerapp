import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { Box, Divider, HStack, Skeleton } from "native-base";
import { useSelector } from "react-redux";
import { STAFFKEY, STAFFURL } from "../../utilities/Apiurl"; // Ensure STAFFKEY is defined
import axios from "axios";

const TodayBiomatric = () => {
  const user = useSelector((state) => state.appdata.user);
  const [biomatric, setBiomatric] = useState({});
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchBiomatric = async () => {
        setLoading(true);
      try {
        const live = `${STAFFURL}/GetBiometric?userid=${user.regdno}`;
       console.log(live)
        const response = await axios.get(live, {
          headers: {
             APIKey: STAFFKEY, // Use x-api-key for API key
          },
        });
setTimeout(()=>{
    setBiomatric(response.data);
    setLoading(false);
},100);
        
      } catch (err) {
        console.log(err);
        Alert.alert(err.message);
      }
    };

    fetchBiomatric();
  }, [user.regdno]);
console.log(biomatric);
  const formatTime = (time) => {
    return time ? time : "00:00"; // Default to "00:00" if no time is available
  };

  const calculateTotalHours = (timeDifference) => {
    return timeDifference ? timeDifference : "00:00"; // Assuming timeDifference is already in hours format
  };
 
  return (
    <>
      
        <Box style={styles.box}>
          <Text style={styles.heading}>Today Time In/Out</Text>
          <HStack justifyContent={"space-between"}>
            <View>
                {loading ?   <Skeleton  h={5} rounded={15} /> :
              <Text style={[styles.timeIn, styles.timecommon]}>
                {formatTime(biomatric.firsT_PUNCH)}
              </Text> }
              <Text style={styles.time}>Time In</Text>
            </View>
            <Divider
              bg="coolGray.300"
              thickness="2"
              mx="1"
              orientation="vertical"
              h={"80%"}
            />
            <View>
            {loading ?  <Skeleton  h={5} rounded={15} /> :
              <Text style={[styles.timeout, styles.timecommon]}>
                {formatTime(biomatric.lasT_PUNCH)}
              </Text>}
              <Text style={styles.time}>Time Out</Text>
            </View>
            <Divider
              bg="coolGray.300"
              thickness="2"
              mx="1"
               orientation="vertical"
               h={"80%"}
            />
            <View>
            {loading ?   <Skeleton  h={5} rounded={15} /> :
              <Text style={[styles.timeTotal, styles.timecommon]}>
                {calculateTotalHours(biomatric.timeDifference)}
              </Text>}
              <Text style={styles.time}>Total Hrs</Text>
            </View>
          </HStack>
        </Box>
     
    </>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 15,
    width: "100%",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.250980406999588)",
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 9 },
    marginTop: -85,
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    marginBottom: 14,
    fontWeight: "600",
  },
  timecommon: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 1,
  },
  timeIn: {
    color: "#00B15F",
  },
  timeout: {
    color: "#D73F28",
  },
  timeTotal: {
    color: "#005C52",
  },
  time: {
    fontSize: 14,
    marginBottom: 12,
    marginTop:3
  },
});

export default TodayBiomatric;
