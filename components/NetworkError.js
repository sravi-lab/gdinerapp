import React from "react";
import { Button, Text, VStack, Center, Image } from "native-base";
import { StyleSheet } from "react-native";

const NetworkError = ({ onRetry,message }) => {
  return (
    <Center mt={20} bg="#f8f8f8" px={5} w={"100%"} >
     
      <Image
        source={require("../assets/networkerror.png")}  
        alt="Network Error"
         w={35}
         h={35}
        mb={5}
      />

       
      <VStack space={3} alignItems="center">
        <Text fontSize="xl" fontWeight="bold" color="gray.600">
          Something Went Wrong!
        </Text>
        <Text fontSize="md" color="gray.600" textAlign="center">
         {message}
        </Text>

         
        <Button  style={styles.btn} colorScheme={"red"} variant="outline" onPress={onRetry} px={10} mt={4}>
          Try Again
        </Button>
      </VStack>
    </Center>
  );
};
const styles = StyleSheet.create({
  
  btn: {
     borderColor:"#ff000080"
  },
});
export default NetworkError;
