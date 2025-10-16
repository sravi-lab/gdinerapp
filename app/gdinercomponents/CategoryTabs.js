import { HStack, ScrollView, Button, Text } from "native-base";
import { useSelector } from "react-redux";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Fab } from 'native-base';

const CategoryTabs = ({setSelectedCategory,selectedCategory}) => {
  const menu_list = useSelector((state) => state.dinerdata.menu_list);
 

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} mb={5} >
      <HStack space={2} paddingHorizontal={15}  >
        
        {/* "All" Category Button */}
        <Button
          onPress={() => setSelectedCategory("All")}
          variant={selectedCategory === "All" ? "solid" : "outline"}
          style={selectedCategory === "All" ? styles.selectedButton : styles.button}
        >
          <Text style={selectedCategory === "All" ? styles.selectedBtnText : styles.btnText}>
            All
          </Text>
        </Button>

        {/* Dynamic Categories */}
        {menu_list?.data?.map((item, index) => (
          <Button
            key={index}
            onPress={() => setSelectedCategory(item.category)}
            variant={selectedCategory === item.category ? "solid" : "outline"}
            style={selectedCategory === item.category ? styles.selectedButton : styles.button}
          >
            <Text style={selectedCategory === item.category ? styles.selectedBtnText : styles.btnText}>
              {item.category}
            </Text>
          </Button>
        ))}
      </HStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 15,
    borderColor: "#ccc",
  },
  selectedButton: {
    borderRadius: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 15,
    backgroundColor: "#007467",
  },
  btnText: {
    fontSize: 12,
    paddingHorizontal: 10,
    color: "#007467",
    height:22,
    textTransform:"capitalize"
  },
  selectedBtnText: {
    fontSize: 12,
    paddingHorizontal: 10,
    color: "#fff",
    height:22,
     textTransform:"capitalize"
  },
});

export default CategoryTabs;
