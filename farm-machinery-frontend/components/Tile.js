import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../constants/styles"; // Adjust the import path as necessary

const Tile = ({ title, description, icon, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${description}`}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={GLOBAL_STYLES.tileDescription}>{description}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SECONDARY, 
    borderWidth: 1,
    borderColor: COLORS.BORDER, 
    borderRadius: SIZES.BORDER_RADIUS, 
    padding: SIZES.PADDING, 
    width: "95%", 
    marginVertical: SIZES.MARGIN_SMALL, 
  },
  tilePressed: {
    backgroundColor: "rgba(0, 0, 0, 0.05)", // Light gray when pressed
  },
  iconContainer: {
    marginRight: SIZES.MARGIN_MEDIUM, // Space between icon and text
  },
  textContainer: {
    flex: 1, // Takes up remaining space
  },
  title: {
    fontSize: SIZES.BUTTON_TEXT, // 18, suitable for titles
    fontFamily: FONTS.BOLD, // Bold font for emphasis
    fontWeight: "bold", // Bold font for emphasis
    color: COLORS.PRIMARY, // Dark gray text
  },
});

export default Tile;
