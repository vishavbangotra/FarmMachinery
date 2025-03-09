// screens/ManageMachineryScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { COLORS, SIZES, FONTS } from "../../constants/styles";
import myMachinery from "../../dummy_data/myMachinery";

const ManageMachineryScreen = () => {
  const [machineries, setMachineries] = useState(myMachinery);

  // Update a machinery item's field (status or hourly rate)
  const updateMachinery = (id, field, value) => {
    setMachineries((prev) =>
      prev.map((machinery) =>
        machinery.id === id ? { ...machinery, [field]: value } : machinery
      )
    );
  };

  // Remove a machinery item with confirmation
  const removeMachinery = (id, title) => {
    Alert.alert(
      "Confirm Removal",
      `Are you sure you want to remove "${title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setMachineries((prev) => prev.filter((m) => m.id !== id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const statusOptions = ["active", "inactive", "engaged"];
  const statusLabels = ["Active", "Inactive", "Engaged"]; // For display purposes

  const renderItem = ({ item }) => {
    const selectedIndex = statusOptions.indexOf(item.status);

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemType}>Type: {item.type}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <SegmentedControl
            values={statusLabels}
            selectedIndex={selectedIndex}
            onChange={(event) => {
              const newStatus =
                statusOptions[event.nativeEvent.selectedSegmentIndex];
              updateMachinery(item.id, "status", newStatus);
            }}
            style={styles.segmentedControl}
            tintColor={COLORS.TERTIARY}
            activeTextColor={COLORS.WHITE}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Hourly Rate:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(item.hourlyRate)}
            onChangeText={(text) =>
              updateMachinery(item.id, "hourlyRate", text)
            }
          />
        </View>

        <TouchableOpacity
          style={[styles.removeButton, { width: "auto", alignSelf: "flex-end" }]}
          onPress={() => removeMachinery(item.id, item.title)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Manage Machinery</Text>
      <FlatList
        data={machineries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
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
    color: COLORS.PRIMARY,
    marginBottom: SIZES.MARGIN_LARGE,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginBottom: 8,
  },
  itemType: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: COLORS.SECONDARY,
    marginRight: 8,
  },
  segmentedControl: {
    flex: 1,
    height: 40,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  removeButton: {
    backgroundColor: 'darkred',
    padding: 10,
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ManageMachineryScreen;
