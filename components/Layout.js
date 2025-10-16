import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Layout = ({ children, customStyle }) => {
  return <View style={[styles.container, customStyle]}>{children}</View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
});
export default Layout;
