import { View, Text, StyleSheet } from "react-native";
import React from "react";

const LoadingB = () => {
  return (
    <View style={styles.container}>
      <Text mt={3} fontSize="lg" bold style={styles.text}>
        Loading...
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007367",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
});
export default LoadingB;
