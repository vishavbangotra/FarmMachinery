import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import Slider from "@react-native-community/slider";
import { COLORS, SIZES, FONTS } from "../constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";

const HireInScreen = () => {
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [radius, setRadius] = useState(10);

  const operations = [
    { id: "plowing", title: "Plowing", icon: "construct" },
    { id: "harvesting", title: "Harvesting", icon: "leaf" },
  ];

  const machineryByOperation = {
    plowing: [
      { id: "tractor", title: "Tractor", description: "For plowing fields" },
    ],
    harvesting: [
      { id: "combine", title: "Combine", description: "For harvesting crops" },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Hire Machinery</Text>
      <Text style={styles.subHeader}>
        Select an operation to hire machinery
      </Text>

      {/* Step 1: Select Operation */}
      {!selectedOperation && (
        <FlatList
          data={operations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.operationCard}
              onPress={() => setSelectedOperation(item.id)}
            >
              <Ionicons name={item.icon} size={50} color={COLORS.PRIMARY} />
              <Text style={styles.operationTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          numColumns={2}
          contentContainerStyle={styles.operationContainer}
        />
      )}

      {/* Step 2: Select Machinery */}
      {selectedOperation && !selectedMachinery && (
        <FlatList
          data={machineryByOperation[selectedOperation]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.machineryCard,
                selectedMachinery?.id === item.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedMachinery(item)}
            >
              <Text style={styles.machineryTitle}>{item.title}</Text>
              <Text style={styles.machineryDescription}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Step 3: Set Radius and Search */}
      {selectedMachinery && (
        <View style={styles.searchContainer}>
          <Text style={styles.subHeader}>Search Radius (km)</Text>
          <Slider
            minimumValue={1}
            maximumValue={50}
            step={1}
            value={radius}
            onValueChange={(value) => setRadius(value)}
            style={styles.slider}
            minimumTrackTintColor={COLORS.PRIMARY}
            maximumTrackTintColor={COLORS.BORDER}
            thumbTintColor={COLORS.PRIMARY}
          />
          <Text style={styles.radiusValue}>{radius} km</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: SIZES.HEADER, // Larger header size
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT, // Darker text color
    textAlign: "center",
    marginBottom: SIZES.MARGIN_SMALL,
  },
  subHeader: {
    fontSize: SIZES.SUBTITLE,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: SIZES.MARGIN_LARGE,
  },
  operationContainer: {
    justifyContent: "center",
  },
  operationCard: {
    flex: 1,
    backgroundColor: `${COLORS.PRIMARY}10`, // Subtle background tint
    padding: SIZES.PADDING,
    margin: SIZES.MARGIN_SMALL,
    borderRadius: SIZES.BORDER_RADIUS,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  operationTitle: {
    fontSize: SIZES.SUBTITLE, // Larger title size
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
    marginTop: SIZES.MARGIN_SMALL,
  },
  machineryCard: {
    backgroundColor: COLORS.INPUT_BG,
    padding: SIZES.PADDING,
    marginVertical: SIZES.MARGIN_SMALL,
    borderRadius: SIZES.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: `${COLORS.PRIMARY}20`, // Highlight selected state
  },
  machineryTitle: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
  },
  machineryDescription: {
    fontSize: SIZES.SMALL_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  searchContainer: {
    alignItems: "center",
  },
  slider: {
    width: "80%",
    height: 40,
  },
  radiusValue: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
    marginVertical: SIZES.MARGIN_SMALL,
  },
  searchButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SIZES.PADDING_SMALL,
    paddingHorizontal: SIZES.PADDING,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  searchButtonText: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.WHITE,
  },
});

export default HireInScreen;
