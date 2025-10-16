import React, { useState } from "react";
import { Box, VStack, Text, Pressable, Center } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { updateCart, updateLocation } from "../../Store/Appdataslice";
import { useRouter } from "expo-router";
import { getLocationInfo } from "../../utilities/Apiurl";
import { resetState } from "../../Store/Dinerdataslice";

const campuses = [
  { code: "VSP", name: "Visakhapatnam" },
  { code: "HYD", name: "Hyderabad" },
  { code: "BLR", name: "Bengaluru" }
];

const CampusSelection = () => {
  const location = useSelector((state) => state.appdata.location);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [selectedCampus, setSelectedCampus] = useState(location?.code || ""); // Store selected campus code

  const onCampusSelect = async (campus) => {
    dispatch(resetState()); // Reset
    dispatch(updateCart({reset:1}));
    setSelectedCampus(campus.code); // Update selected campus
    const locationData = await getLocationInfo(campus.code);
    dispatch(updateLocation({ ...locationData }));
    router.push("/gdiner");
  };

  return (
    <Center flex={1} bg="#007367">
      <Box bg="white" p="4" rounded="lg" shadow="2" w="80%" alignSelf="center">
        {/* Heading */}
        <Text fontSize="lg" fontWeight="bold" mb="3" textAlign="center">
          Select Campus
        </Text>

        {/* Campus List */}
        <VStack space={3}>
          {campuses.map((campus) => (
            <Pressable
              key={campus.code}
              onPress={() => onCampusSelect(campus)}
              _pressed={{ bg: "gray.300" }} // Light press effect
            >
              <Box 
                p="4" 
                rounded="md" 
                bg={selectedCampus === campus.code ? "teal.500" : "gray.100"} // Highlight selected
              >
                <Text 
                  fontSize="md" 
                  textAlign="center" 
                  color={selectedCampus === campus.code ? "white" : "black"}
                >
                  {campus.name}
                </Text>
              </Box>
            </Pressable>
          ))}
        </VStack>
      </Box>
    </Center>
  );
};

export default CampusSelection;
