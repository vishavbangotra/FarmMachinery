import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles"; // Adjust the import path as necessary
import { OPERATIONS } from "../../Info/MachineryInfo";

const MachineryScreen = ({ navigation, route }) => {
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const { operation } = route.params;

  const machinery = OPERATIONS[operation];

  return (
    <View style={styles.container}>
      <Text style={GLOBAL_STYLES.header}>Select Machinery for {operation}</Text>
      <FlatList
        data={machinery}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              selectedMachinery === item && GLOBAL_STYLES.selectedTile,
            ]}
            onPress={() => setSelectedMachinery(item)}
          >
            <Text
              style={[
                styles.itemText,
                selectedMachinery === item && GLOBAL_STYLES.selectedTileTitle,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
      <TouchableOpacity
        style={[styles.button, !selectedMachinery && styles.buttonDisabled]}
        onPress={() =>
          selectedMachinery &&
          navigation.navigate("DistanceSlider", {
            machinery: selectedMachinery,
          })
        }
        disabled={!selectedMachinery}
      >
        <Text style={styles.buttonText}>Next to Distance Slider</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.PADDING, // 20
    backgroundColor: COLORS.BACKGROUND, // rgb(245, 246, 241)
  },
  title: {
    fontSize: SIZES.TITLE, // 32
    fontFamily: FONTS.BOLD, // Platform-specific bold font
    color: COLORS.TEXT, // rgb(51, 51, 51)
    marginBottom: SIZES.MARGIN_LARGE, // 20
  },
  item: {
    flex: 1,
    padding: SIZES.PADDING, // 20
    backgroundColor: COLORS.INPUT_BG, // rgb(255, 255, 255)
    margin: SIZES.MARGIN_SMALL, // 2
    borderRadius: SIZES.BORDER_RADIUS, // 8
    borderWidth: 1,
    borderColor: COLORS.BORDER, // rgb(164, 191, 166)
    alignItems: "center",
    justifyContent: "center",
  },
  selectedItem: {
    borderColor: COLORS.PRIMARY, // rgb(76, 175, 80)
  },
  itemText: {
    fontSize: SIZES.INFO_TEXT, // 16
    fontFamily: FONTS.REGULAR, // Platform-specific regular font
    color: COLORS.TEXT, // rgb(51, 51, 51)
  },
  button: {
    backgroundColor: COLORS.PRIMARY, // rgb(76, 175, 80)
    padding: SIZES.PADDING, // 20
    borderRadius: SIZES.BORDER_RADIUS, // 8
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: COLORS.PLACEHOLDER, // rgb(138, 154, 134)
  },
  buttonText: {
    color: COLORS.BACKGROUND, // rgb(245, 246, 241)
    fontSize: SIZES.BUTTON_TEXT, // 18
    fontFamily: FONTS.BOLD, // Platform-specific bold font
  },
});

export default MachineryScreen;
