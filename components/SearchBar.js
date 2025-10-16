import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import { Button, HStack, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = (props) => {
  const [search, setSearch] = useState("");
  
  const handlePress = () => {
    if (search.length >= 4) {
      props.fetchProfiles(search);
    } else {
      alert("Please enter at least 4 characters to search.");
    }
  };
  
  return (
    <HStack style={styles.card}>
      <TextInput
        placeholder="Search by employee ID/ Name"
        style={styles.input}
        value={search}
        onChangeText={(text) => setSearch(text)}
        placeholderTextColor="#9CA3AF"
      />
      <Button 
        leftIcon 
        style={styles.button} 
        bg={"#005C52"} 
        onPress={handlePress}
        borderRadius={8}
        _pressed={{ bg: "#004A42" }}
      >
        <Icon as={Ionicons} name="search" size={"md"} color={"white"} />
      </Button>
    </HStack>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    display: "flex",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    elevation: 1,
    borderRadius: 12,
    
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
    alignItems: "center",
  },
  input: {
    width: "85%",
    height: 44,
    paddingLeft: 16,
    fontSize: 16,
    color: "#374151",
    borderRadius: 8,
  },
  button: {
    width: "15%",
    height: 44,
    marginLeft: 4,
  },
});

export default SearchBar;