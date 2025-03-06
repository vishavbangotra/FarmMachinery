// screens/AddMachineryScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Sample machine data with title and description
const MACHINES = [
  {
    id: "tractor",
    title: "Tractor",
    description: "Versatile for plowing and towing",
  },
  {
    id: "combine",
    title: "Combine",
    description: "Harvests crops efficiently",
  },
  {
    id: "drone",
    title: "Drone",
    description: "Precision farming and monitoring",
  },
];

const AddMachineryScreen = ({ navigation }) => {
  const [selectedMachineId, setSelectedMachineId] = useState("tractor");

  const handleNextPress = () => {
    const selectedMachine = MACHINES.find(
      (machine) => machine.id === selectedMachineId
    );
    navigation.navigate("AddMachineryDetailScreen", {
      machineryTitle: selectedMachine.title,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Select Your Machinery</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {MACHINES.map((machine) => (
          <TouchableOpacity
            key={machine.id}
            style={[
              GLOBAL_STYLES.tile,
              selectedMachineId === machine.id && GLOBAL_STYLES.selectedTile,
            ]}
            onPress={() => setSelectedMachineId(machine.id)}
          >
            <Text
              style={[
                GLOBAL_STYLES.tileTitle,
                selectedMachineId === machine.id && GLOBAL_STYLES.selectedTileTitle,
              ]}
            >
              {machine.title}
            </Text>
            <Text
              style={[
                GLOBAL_STYLES.tileDescription,
                selectedMachineId === machine.id &&
                  GLOBAL_STYLES.selectedTileDescription,
              ]}
            >
              {machine.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SIZES.PADDING,
  },
  header: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_LARGE,
    textAlign: "center",
  },
  scrollContainer: {
    paddingBottom: SIZES.MARGIN_LARGE,
  },
  nextButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SIZES.MARGIN_MEDIUM,
    paddingHorizontal: SIZES.PADDING,
    borderRadius: SIZES.BORDER_RADIUS,
    alignItems: "center",
    marginTop: SIZES.MARGIN_LARGE,
  },
  nextButtonText: {
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.INPUT_BG,
  },
});

export default AddMachineryScreen;
