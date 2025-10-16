import { FlatList } from "react-native";
import { HStack, ScrollView, Skeleton, Text, View } from "native-base";
import Header1 from "./Header1";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import CategoryTabs from "./CategoryTabs";
import ItemBox from "./ItemBox";
import CartBtn from "./CartBtn";

const CafeMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const menu_list = useSelector((state) => state.dinerdata.menu_list);
  const selected_mess = useSelector((state) => state.dinerdata.selected_mess);
 
  // Extract unique categories from menu_list
  const categories = useMemo(() => {
    if (!menu_list?.data) return [];
    return ["All", ...menu_list.data.map((category) => category.category)];
  }, [menu_list]);

  // Get all items and filter based on selected category
  const filteredItems = useMemo(() => {
    if (!menu_list?.data) return [];
    
    let items =
      selectedCategory === "All"
        ? menu_list.data.flatMap((category) => category.items)
        : menu_list.data.find((cat) => cat.category === selectedCategory)?.items || [];

    // Apply search filter
    if (search.trim() !== "") {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return items;
  }, [selectedCategory, search, menu_list]);

  return (
    <View className="flex-1 bg-gray-50">
      <Header1 title={selected_mess.name} />
      
      {/* Search Bar */}
      <View className="px-4 pt-4">
        <SearchBar setSearch={setSearch} />
      </View>

      {/* Category Tabs */}
      <View className="h-16 mb-2">
        {menu_list.loader ? (
          <HStack space={2} className="px-4 py-2">
            <Skeleton width="24" height="10" borderRadius="20" />
            <Skeleton width="24" height="10" borderRadius="20" />
            <Skeleton width="24" height="10" borderRadius="20" />
            <Skeleton width="24" height="10" borderRadius="20" />
          </HStack>
        ) : (
          <CategoryTabs 
            setSelectedCategory={setSelectedCategory} 
            selectedCategory={selectedCategory} 
            categories={categories}
          />
        )}
      </View>

      {/* Menu Items Grid */}
      <View className="flex-1 px-4">
        {menu_list.loader ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <View key={item} className="w-[48%] mb-4">
                  <View className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <Skeleton height="48" width="100%" />
                    <View className="p-3 space-y-2">
                      <Skeleton height="4" width="80%" />
                      <Skeleton height="3" width="60%" />
                      <Skeleton height="4" width="40%" />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            renderItem={({ item }) => <ItemBox item={item} />}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-gray-500 text-lg">No items found</Text>
                <Text className="text-gray-400 text-sm mt-2">Try adjusting your search or category</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        )}
      </View>

      {/* Floating Cart Button */}
      <View className="absolute bottom-6 right-6">
        <CartBtn />
      </View>
    </View>
  );
};

export default CafeMenu;