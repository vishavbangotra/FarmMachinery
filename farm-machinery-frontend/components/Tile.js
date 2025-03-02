import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/styles"; // Adjust the import path as necessary

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
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.INPUT_BG, // White background
    borderWidth: 1,
    borderColor: COLORS.BORDER, // Subtle green border
    borderRadius: SIZES.BORDER_RADIUS, // Rounded corners
    padding: SIZES.PADDING, // Consistent padding
    width: "95%", // 80% of the screen width
    marginVertical: SIZES.MARGIN_SMALL, // Small vertical spacing between tiles
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
    color: COLORS.TEXT, // Dark gray text
  },
  description: {
    fontSize: SIZES.INFO_TEXT, // 16, suitable for descriptions
    fontFamily: FONTS.REGULAR, // Regular font for readability
    color: COLORS.PLACEHOLDER, // Gray-green for less prominence
  },
});

export default Tile;
