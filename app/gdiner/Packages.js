import React, { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Box, Skeleton, VStack, HStack, Image, Heading, Text, Button } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { updatePackages } from "../../Store/Dinerdataslice";
import Header1 from "../gdinercomponents/Header1";
import SocketContext from "../gdinercomponents/Connections/Socket";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const Packages = () => {
  const ctx = useContext(SocketContext);
  const packages = useSelector((state) => state.dinerdata.packages);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    dispatch(updatePackages({ loader: false, packages: [] }));
    ctx.sendCommand("Get Packages", { type: "packages" });

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
   return (
    <>
      <Header1 title="Packages" path="/gdiner" />
      <Box flex={1} p={4} bg="gray.100">
        {loading ? (
          <VStack space={4}>
            {[...Array(3)].map((_, index) => (
              <Box key={index} bg="white" p={4} borderRadius="md" shadow={2}>
                <HStack space={3} alignItems="center">
                  <Skeleton h="50px" w="50px" borderRadius="md" />
                  <VStack flex={1} space={2}>
                    <Skeleton h="15px" w="70%" />
                    <Skeleton h="10px" w="50%" />
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        ) : (
          <FlatList
            data={packages.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Box bg="#f3e5cb" p={2} borderRadius="md"  mb={3} alignItems="center">
                <Image
                  source={{ uri: item.image }}
                  alt={item.package}
                  width="100%"
                  height={180}
                 borderRadius={"md"}
                  resizeMode="cover"
                />
                <HStack justifyContent="space-between" alignItems="center" mt={2} w={"100%"}>
                  <VStack  >
                  <Heading size="sm" textAlign="left" color={"#007367"}>{item.package}</Heading>
                  <Text fontSize="sm" fontWeight="bold"  color={"#999"} mt={1}>Location : {item.mess_name}</Text>

                  <Text fontSize="sm" fontWeight="bold"  color={"#999"} mt={1}>Price : ₹{item.amount}</Text>
                </VStack>
                  <Button
                    onPress={() => {
                       router.push({
  pathname: "gdiner/PackageDetails",
  params: { package: JSON.stringify(item) },
});
                    }}
                    bg="#007367"
                    _text={{ color: "white" }}
                    borderRadius="md"
                  >
                    Buy Package
                  </Button></HStack>
               
              </Box>
            )}
          />
        )}
      </Box>
    </>
  );
};

export default Packages;
