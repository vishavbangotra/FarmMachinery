import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";
import * as Haptics from "expo-haptics"; // Optional: for haptic feedback
import { MACHINERY } from "../../Info/MachineryInfo"

const MachineryScreen = ({ navigation, route }) => {
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const machinery = MACHINERY

  const handleSelectMachinery = (item) => {
    setSelectedMachinery(item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Optional haptic feedback
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, selectedMachinery === item && styles.selectedItem]}
      onPress={() => handleSelectMachinery(item)}
    >
      <Text
        style={[
          styles.itemText,
          selectedMachinery === item && styles.selectedItemText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Machinery for Hire</Text>
      <FlatList
        data={machinery}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={[styles.button, !selectedMachinery && styles.buttonDisabled]}
        onPress={() =>
          selectedMachinery &&
          navigation.navigate("Map", { machinery: selectedMachinery })
        }
        disabled={!selectedMachinery}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.PADDING,
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
    marginBottom: SIZES.MARGIN_LARGE,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: SIZES.MARGIN_LARGE,
  },
  item: {
    flex: 1,
    padding: SIZES.PADDING,
    backgroundColor: COLORS.INPUT_BG,
    margin: SIZES.MARGIN_SMALL,
    borderRadius: SIZES.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedItem: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: "#E6F7E6", // Light green for selected state
  },
  itemText: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
  },
  selectedItemText: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.BOLD,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: SIZES.PADDING,
    borderRadius: SIZES.BORDER_RADIUS,
    alignItems: "center",
    marginTop: SIZES.MARGIN_LARGE,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonDisabled: {
    backgroundColor: COLORS.PLACEHOLDER,
  },
  buttonText: {
    color: COLORS.BACKGROUND,
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
  },
});

export default MachineryScreen;
