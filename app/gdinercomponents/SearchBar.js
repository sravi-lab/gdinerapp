import { Icon, Input } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const SearchBar = (props) => {
  return (
    <View className="mb-4">
      <Input
        placeholder="Search for food, restaurants..."
        variant="filled"
        width="100%"
        borderRadius="12"
        py="3"
        px="4"
        fontSize={16}
        onChangeText={(text) => props.setSearch(text)}
        bg="white"
        borderColor="gray.200"
        _focus={{
          borderColor: "primary.500",
          bg: "white"
        }}
        InputRightElement={
          <Icon
            mr="4"
            size="5"
            color="gray.400"
            as={<Ionicons name="search" />}
          />
        }
      />
    </View>
  );
};

export default SearchBar;