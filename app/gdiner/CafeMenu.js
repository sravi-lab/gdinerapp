import { FlatList } from "react-native";
import { HStack, ScrollView, Skeleton, Text, View } from "native-base";
import Header1 from "../gdinercomponents/Header1";
import SearchBar from "../gdinercomponents/SearchBar";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import CategoryTabs from "../gdinercomponents/CategoryTabs";
import ItemBox from "../gdinercomponents/ItemBox";
import CartBtn from "../gdinercomponents/CartBtn";

const CafeMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(true);

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
    <View flex={1}>
      <Header1 title={selected_mess.name} />
      <SearchBar setSearch={setSearch} />

      {/* Category Tabs with proper categories */}
      <View style={{ height: 55 }}>
      {menu_list.loader ? 
        
            <HStack space={2} h={20} pl={5}>
             <Skeleton   width={"30%"} borderRadius={15} />
             <Skeleton   width={"30%"} borderRadius={15} />
             <Skeleton   width={"30%"} borderRadius={15} />
             <Skeleton   width={"30%"} borderRadius={15} />
             </HStack>
         :
        <CategoryTabs 
          setSelectedCategory={setSelectedCategory} 
          selectedCategory={selectedCategory} 
          categories={categories}
        /> }
      </View>

      {/* FlatList for filtered items */}
      {menu_list.loader ? 
         <ScrollView>
         <HStack space={2} flexWrap="wrap" justifyContent="center" mt={5}>
            <Skeleton height={200} width={"45%"} borderRadius={10} />
            <Skeleton height={200}  width={"45%"}   borderRadius={10}/>
         </HStack>
         <HStack space={2} flexWrap="wrap" justifyContent="center" mt={5}>
            <Skeleton height={200} width={"45%"}  borderRadius={10}/>
            <Skeleton height={200}  width={"45%"}   borderRadius={10}/>
         </HStack>
         <HStack space={2} flexWrap="wrap" justifyContent="center" mt={5}>
            <Skeleton height={200} width={"45%"}  borderRadius={10}/>
            <Skeleton height={200}  width={"45%"}   borderRadius={10}/>
         </HStack>
         </ScrollView>
      :
      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({ item }) => <ItemBox item={item} />}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        ListEmptyComponent={<Text textAlign="center" mt={5}>No items found</Text>}
        
      /> }
      <CartBtn />
    </View>
  );
};

export default CafeMenu;
