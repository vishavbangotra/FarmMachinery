// screens/HireInScreen.js
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker"; // Updated import

const HireInScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>I am looking for a..</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={""}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => console.log(itemValue)}
        >
          <Picker.Item label="Tractor" value="tractor" />
          <Picker.Item label="Combine" value="combine" />
          <Picker.Item label="Drone" value="drone" />
        </Picker>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 10,
    alignItems: "center", // Center items for better layout
  },
  title: {
    fontSize: SIZES.TITLE,
    fontWeight: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginBottom: 20, // Add spacing below the title
  },
  pickerContainer: {
    width: "80%", // Control the width of the picker
    backgroundColor: COLORS.PRIMARY, // Background for visibility
    borderRadius: SIZES.BORDER_RADIUS, // Rounded corners
    overflow: "hidden", // Prevent overflow issues
  },
  picker: {
    height: Platform.OS === "ios" ? 200 : 50, // Adjust height for iOS
    width: "100%", // Full width within container
  },
});

export default HireInScreen;