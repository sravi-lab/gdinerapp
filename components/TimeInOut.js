import React, { useEffect, useState } from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Box, VStack, HStack, Divider, Skeleton } from "native-base";
import { useSelector } from "react-redux";
import { STAFFKEY, STAFFURL } from "../utilities/Apiurl";

const { width: viewportWidth } = Dimensions.get("window");
export default function TimeInOut() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(1); // For tracking the active dot
    const user = useSelector((state) => state.appdata.user);
  
    const getBiometric = async () => {
      
      try {
        const response = await fetch(
          `${STAFFURL}/GetBiometric?userid=${user.regdno}`,
          {
            method: "GET",
            headers: {
              APIKey: STAFFKEY,
            },
          }
        );
        const result = await response.json();
 
        if (response.ok) {
              
          if (result.length > 0) {
            
            // Ensure Today and Previous Day data exist, add placeholders for missing ones
            const updatedData = [
              result.find((item) => item.dayType === "PreviousDay") || {
                dayType: "PreviousDay",
                firsT_PUNCH: "HOLIDAY",
                lasT_PUNCH: null,
                totalWorkingHours: "00:00",
              },
              result.find((item) => item.dayType === "ToDay") || {
                dayType: "ToDay",
                firsT_PUNCH: "HOLIDAY",
                lasT_PUNCH: null,
                totalWorkingHours: "00:00",
              }
            ];
            setData(updatedData);
          } else {
            // No data, show holiday for both days
            setData([
              {
                dayType: "ToDay",
                firsT_PUNCH: "HOLIDAY",
                lasT_PUNCH: null,
                totalWorkingHours: "00:00",
              },
              {
                dayType: "PreviousDay",
                firsT_PUNCH: "HOLIDAY",
                lasT_PUNCH: null,
                totalWorkingHours: "00:00",
              },
            ]);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching biometric data:", err);
      }
    };
  
    useEffect(() => {
      if (isLoading) {
        const intervalId = setInterval(() => {
          getBiometric();
        }, 1000);
        return () => clearInterval(intervalId);
      }
    }, [isLoading]);
    
    const renderItem = ({ item }) => (
      <Box
        bg="#ECF6FF"
        p="3"
        borderRadius="md"
        width={"92%"}
        alignSelf="center"
        style={{ marginLeft: "-40px", marginRight: "auto" }}
      >
       <Text fontSize="md" fontWeight="semibold"  >
         Biometric : {item.dayType === "ToDay" ? "Today" : "Yesterday"}
       </Text>
        {item.shiftCode!='GEN' ?  <View style={styles.holiday}><Text style={styles.holidaytext}>HOLIDAY</Text></View>: 
         <>
        <VStack mt="2">
          <HStack alignItems="center" justifyContent="space-between">
            <VStack alignItems="center">
              <Text fontSize="lg" fontWeight="bold" color="green.600" style={{width:"100%",minWidth:100}}>
               
                {item.firsT_PUNCH || "00:00"}
              </Text>
              <Text fontSize="sm" color="coolGray.600" fontWeight="semibold" style={{width:"100%",minWidth:100}}>
                Time In
              </Text>
            </VStack>
            <Divider
              orientation="vertical"
              bg="coolGray.300"
              thickness="2"
              height="12"
              mr={2}
            />
            <VStack alignItems="center">
              <Text fontSize="lg" fontWeight="bold" color="red.600" style={{width:"100%"}}>
                {item.lasT_PUNCH || "00:00"}
              </Text>
              <Text fontSize="sm" color="coolGray.600" fontWeight="semibold" style={{width:"100%",minWidth:100}}>
                Time Out
              </Text>
            </VStack>
            <Divider
              orientation="vertical"
              bg="coolGray.300"
              thickness="2"
              height="12"
              mr={2}
            />
            <VStack alignItems="center">
              <Text fontSize="lg" fontWeight="bold" style={{width:"100%",minWidth:100}}>
              {item.totalWorkingHours || "00:00"}
                
              </Text>
              <Text fontSize="sm" color="coolGray.600" fontWeight="semibold" style={{width:"100%",minWidth:100}}>
                Total Hrs
              </Text>
            </VStack>
          </HStack>
        </VStack></> }
      </Box>
    );
  
    return (
      <View style={styles.box}>
        {isLoading && <HStack space={5} w={"80%"} ml={"5%"}>
        <Skeleton w={"33%"} h={"70px"} startColor="gray.100"/>
        <Skeleton w={"33%"} h={"70px"} startColor="gray.100"/>
        <Skeleton w={"33%"} h={"70px"} startColor="gray.100"/>
        </HStack>}
        <Carousel
          data={data}
          renderItem={renderItem}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth * 0.9}
          loop={false}
          onSnapToItem={(index) => setActiveIndex(index)} // Track active index
          firstItem={1}
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={activeIndex}
          containerStyle={{ paddingVertical: 10 }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            backgroundColor: "black", // Set dot color to black
          }}
          inactiveDotStyle={{
            backgroundColor: "gray", // Inactive dot color (optional)
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    );
  }
  

const styles = StyleSheet.create({
    holiday:{
        
        alignItems:"center",
        justifyContent:"center",
        height:60,
        width:"100%",
    },
    holidaytext:{
      width:"100%",
      textAlign:"center"
    },
    box: {
    //   padding: 15,
    paddingVertical:15,
      width: "100%",
      backgroundColor: "#fff",
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      shadowColor: "rgba(0, 0, 0, 0.250980406999588)",
      shadowRadius: 50,
      shadowOffset: { width: 0, height: 9 },
      marginTop: -1,
      marginBottom: 20,
      minHeight:"100px"
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
  
  