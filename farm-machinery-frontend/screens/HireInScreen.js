// screens/HireInScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/styles"; // Assuming constants are defined
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

const HireInScreen = () => {
  const [selectedMachineValue, setSelectedMachineValue] = useState("tractor");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Farm Operation</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedMachineValue}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMachineValue(itemValue)}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Tractor" value="tractor" />
          <Picker.Item label="Combine" value="combine" />
          <Picker.Item label="Drone" value="drone" />
        </Picker>
      </View>
      <Text style={[styles.title, { marginTop: SIZES.MARGIN_LARGE }]}>
        Machinery
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedMachineValue}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMachineValue(itemValue)}
          itemStyle={styles.pickerItem}
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
    padding: SIZES.PADDING,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD, // Modern bold font
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_LARGE
  },
  pickerContainer: {
    width: "80%",
    height: Platform.OS === "ios" ? 200 : 50,
    backgroundColor: COLORS.INPUT_BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  picker: {
    width: "100%",
    height: "100%",
  },
  pickerItem: {
    color: COLORS.TEXT,
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR, // Modern regular font
  },
});

export default HireInScreen;
