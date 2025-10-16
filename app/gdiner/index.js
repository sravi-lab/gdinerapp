import { ScrollView, Text, View, VStack } from "native-base";
import { StyleSheet, RefreshControl } from "react-native";
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (socketstate) {
      cmd.sendCommand("join", { id: user.regdno });
    }
  }, [socketstate]);

  // 🔹 Filter cafe list based on search query
  const filteredCafes = cafe_list?.data?.filter((cafe) =>
    cafe.mess_name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const onRefresh = () => {
    setRefreshing(true);
    cmd.sendCommand("getcafelist", { getlist: "getlist", campus: user.campus });
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title={"G-Diner"} />
      
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View className="px-4 pt-4">
          <SearchBar setSearch={setSearch} />
        </View>

        {/* Banners */}
        <View className="mb-4">
          <Banners />
        </View>

        {/* Cafes Section */}
        <View className="px-4 mb-4">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Available Cafes
          </Text>
          
          {cafe_list.loader ? (
            <VStack space={3}>
              {[1, 2, 3, 4].map((item) => (
                <View key={item} className="bg-white rounded-xl p-4 shadow-sm">
                  <View className="flex-row">
                    <View className="flex-1 space-y-2">
                      <View className="h-4 bg-gray-200 rounded animate-pulse" />
                      <View className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                      <View className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </View>
                    <View className="w-24 h-20 bg-gray-200 rounded-lg animate-pulse ml-4" />
                  </View>
                </View>
              ))}
            </VStack>
          ) : (
            <CafeLists list={{ cafe_list: filteredCafes }} />
          )}
        </View>

        {/* Bottom spacing for fixed bottom bar */}
        <View className="h-20" />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0">
        <BottomBar />
      </View>
    </View>
  );
};

export default GdinerRoot;