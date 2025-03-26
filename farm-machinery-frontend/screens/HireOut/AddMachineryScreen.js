// screens/AddMachineryScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, FONTS } from "../../constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MACHINES = [
  { id: "tractor", title: "Tractor", icon: "tractor" },
  { id: "rotavator", title: "Rotavator", icon: "screwdriver" },
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

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedMachineId;
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => setSelectedMachineId(item.id)}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={28}
          color={isSelected ? COLORS.PRIMARY : COLORS.TERTIARY}
          style={styles.icon}
        />
        <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Select Your Machinery</Text>
      <FlatList
        data={MACHINES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={[styles.nextButton, {marginBottom: SIZES.MARGIN_LARGE}]} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SIZES.PADDING,
    paddingTop: SIZES.MARGIN_LARGE,
  },
  header: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    textAlign: "center",
    marginBottom: SIZES.MARGIN_LARGE,
  },
  listContainer: {
    paddingBottom: SIZES.MARGIN_LARGE,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.INPUT_BG,
    padding: SIZES.PADDING,
    borderRadius: SIZES.BORDER_RADIUS,
    marginBottom: SIZES.MARGIN_MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.BACKGROUND,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  selectedCard: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
  },
  icon: {
    marginRight: SIZES.MARGIN_SMALL,
  },
  cardText: {
    fontSize: SIZES.BODY,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.TERTIARY,
  },
  selectedCardText: {
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
  },
  nextButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SIZES.MARGIN_MEDIUM,
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
