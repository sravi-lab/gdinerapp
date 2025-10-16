import { ScrollView, Skeleton, Text, View, VStack } from "native-base";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import Header from "../gdinercomponents/Header";
import SearchBar from "../gdinercomponents/SearchBar";
import Banners from "../gdinercomponents/Banners";
import CafeLists from "../gdinercomponents/CafeLists";
import BottomBar from "../gdinercomponents/BottomBar";
import SocketContext from "../gdinercomponents/Connections/Socket";

const GdinerRoot = () => {
  const cmd = useContext(SocketContext);
  const user = useSelector((state) => state.appdata.user);
  const socketstate = useSelector((state) => state.dinerdata.socketstate);
  const cafe_list = useSelector((state) => state.dinerdata.cafe_list);

  // 🔹 Search state
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (socketstate) {
      cmd.sendCommand("join", { id: user.regdno });
    }
  }, [socketstate]);

  // 🔹 Filter cafe list based on search query
  const filteredCafes = cafe_list?.data?.filter((cafe) =>
    cafe.mess_name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <View style={styles.container}>
      <Header title={"G-Diner"} />
      <SearchBar setSearch={setSearch} />
      <Banners />
      <Text style={styles.heading}>Cafes</Text>

      {/* Scrollable content */}
      <ScrollView style={styles.scrollView}>
        {cafe_list.loader ? (
           <VStack space={2}>
            <Skeleton height={100} w={"91%"} marginX={15} borderRadius={10}/>
            <Skeleton height={100} w={"91%"} marginX={15} borderRadius={10}/> 
            <Skeleton height={100} w={"91%"} marginX={15} borderRadius={10}/>
            <Skeleton height={100} w={"91%"} marginX={15} borderRadius={10}/> 

           </VStack>
        ) : (
          <CafeLists list={{ cafe_list: filteredCafes }} />
        )}
        
      </ScrollView>

      {/* Fixed BottomBar */}
      <View style={styles.bottomBarContainer}>
        <BottomBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the parent view takes full height
  },
  heading: {
    fontSize: 20,
    fontWeight: "500",
    padding: 15,
    paddingBottom:0
  },
  scrollView: {
    flex: 1, // Makes the content scrollable while keeping BottomBar fixed
    marginBottom: 60, // Prevents content from going behind BottomBar
  },
  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff", // Adjust if needed
    elevation: 5, // For shadow effect on Android
  },
});

export default GdinerRoot;
