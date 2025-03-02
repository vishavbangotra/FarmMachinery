import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, FONTS } from "../constants/styles"; // Adjust the import path as necessary

// MachineryTile Component
const MachineryTile = ({ machinery, isSelected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tile, isSelected && styles.tileSelected]}
    >
      <Text style={styles.tileText}>{machinery.name}</Text>
    </Pressable>
  );
};

const AddMachineryScreen = () => {
  // Dummy machinery data
  const machineryData = [
    { id: "1", name: "Tractor" },
    { id: "2", name: "Harvester" },
    { id: "3", name: "Plow" },
    { id: "4", name: "Seeder" },
    { id: "5", name: "Sprayer" },
    { id: "6", name: "Baler" },
  ];

  // State to track the selected machinery
  const [selectedId, setSelectedId] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={machineryData}
        numColumns={2}
        renderItem={({ item }) => (
          <MachineryTile
            machinery={item}
            isSelected={item.id === selectedId}
            onPress={() => setSelectedId(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={
            selectedId
              ? () => console.log("Next pressed with", selectedId)
              : null
          }
          style={[
            styles.nextButton,
            { backgroundColor: selectedId ? COLORS.PRIMARY : "gray" },
          ]}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AddMachineryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tile: {
    backgroundColor: COLORS.INPUT_BG || "#f5f5f5", // Fallback color if constants are unavailable
    borderWidth: 1,
    borderColor: COLORS.BORDER || "#ccc",
    borderRadius: SIZES.BORDER_RADIUS || 8,
    padding: 20,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tileSelected: {
    borderColor: COLORS.PRIMARY || "#00cc00", // Fallback to green if PRIMARY is unavailable
  },
  tileText: {
    fontSize: SIZES.BUTTON_TEXT || 16,
    fontFamily: FONTS.BOLD || "Arial", // Fallback font
    color: COLORS.TEXT || "#333",
  },
  buttonContainer: {
    padding: 10,
  },
  nextButton: {
    padding: 15,
    alignItems: "center",
    margin: 20,
    borderRadius: SIZES.BORDER_RADIUS || 8,
  },
  nextButtonText: {
    color: "white",
    fontSize: SIZES.BUTTON_TEXT || 16,
    fontFamily: FONTS.BOLD || "Arial",
  },
});
