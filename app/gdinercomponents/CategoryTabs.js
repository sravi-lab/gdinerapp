import { HStack, ScrollView, Button, Text } from "native-base";
import { useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";

const CategoryTabs = ({ setSelectedCategory, selectedCategory }) => {
  const menu_list = useSelector((state) => state.dinerdata.menu_list);

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="mb-4"
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <HStack space={3}>
        {/* "All" Category Button */}
        <TouchableOpacity
          onPress={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full border ${
            selectedCategory === "All"
              ? "bg-primary-500 border-primary-500"
              : "bg-white border-gray-300"
          }`}
        >
          <Text className={`font-medium ${
            selectedCategory === "All" ? "text-white" : "text-gray-600"
          }`}>
            All
          </Text>
        </TouchableOpacity>

        {/* Dynamic Categories */}
        {menu_list?.data?.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedCategory(item.category)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === item.category
                ? "bg-primary-500 border-primary-500"
                : "bg-white border-gray-300"
            }`}
          >
            <Text className={`font-medium capitalize ${
              selectedCategory === item.category ? "text-white" : "text-gray-600"
            }`}>
              {item.category}
            </Text>
          </TouchableOpacity>
        ))}
      </HStack>
    </ScrollView>
  );
};

export default CategoryTabs;