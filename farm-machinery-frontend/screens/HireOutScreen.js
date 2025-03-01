// screens/Home.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/styles";

const HireOutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to AgriTech Hire Out</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: SIZES.TITLE,
    fontWeight: FONTS.BOLD,
    color: COLORS.SECONDARY,
  },
});

export default HireOutScreen;
