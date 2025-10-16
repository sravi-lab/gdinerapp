import { Icon, Input } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const CommonSearchBar = (props) => {
  return (
    <View style={styles.box}>
      <Input
        placeholder="Search"
        variant="filled"
        width="100%"
        borderRadius="20"
        py="2"
        px="5"
        fontSize={16}
        onChangeText={(text) => props.setSearch(text)}
        InputRightElement={
          <Icon
            mr="5"
            size="6"
            color="gray.400"
            as={<Ionicons name="search" />}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 15,
  },
});

export default CommonSearchBar;
