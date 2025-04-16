import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";

const MachineryScreen = ({ navigation }) => {
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const machinery = [
    "Tractor",
    "Rotavator",
    "Harvester",
    "Land Leveller",
    "Seed Drill",
  ];

  const handleSelectMachinery = (item) => {
    setSelectedMachinery(item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const openStartDatePicker = () => {
    setShowStartDatePicker(true);
  };

  const openEndDatePicker = () => {
    setShowEndDatePicker(true);
  };

  const formatDate = (date) => date.toLocaleDateString();

  const isValidDateRange = startDate && endDate && endDate > startDate;

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
      {selectedMachinery === item && (
        <Icon
          name="check"
          size={20}
          color={COLORS.PRIMARY}
          style={styles.checkIcon}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Machinery</Text>
      <View style={styles.dateSection}>
        <View>
          <TouchableOpacity
            onPress={openStartDatePicker}
            style={styles.dateButton}
          >
            <View style={styles.dateButtonContent}>
              <Icon
                name="calendar"
                size={20}
                color={COLORS.PRIMARY}
                style={{ marginRight: SIZES.MARGIN_SMALL }}
              />
              <Text style={styles.dateText}>
                {startDate ? formatDate(startDate) : "Select Start Date"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={openEndDatePicker}
            style={styles.dateButton}
          >
            <View style={styles.dateButtonContent}>
              <Icon
                name="calendar"
                size={20}
                color={COLORS.PRIMARY}
                style={{ marginRight: SIZES.MARGIN_SMALL }}
              />
              <Text style={styles.dateText}>
                {endDate ? formatDate(endDate) : "Select End Date"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {startDate && endDate && !isValidDateRange && (
          <Text style={styles.errorText}>
            End date must be after start date
          </Text>
        )}
      </View>
      <FlatList
        data={machinery}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={[
          styles.button,
          (!selectedMachinery || !startDate || !endDate || !isValidDateRange) &&
            styles.buttonDisabled,
        ]}
        onPress={() =>
          navigation.navigate("Map", {
            machinery: selectedMachinery,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          })
        }
        disabled={
          !selectedMachinery || !startDate || !endDate || !isValidDateRange
        }
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}
    </SafeAreaView>
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
    color: COLORS.TEXT_LIGHT,
    marginBottom: SIZES.MARGIN_LARGE,
    textAlign: "center",
  },
  dateSection: {
    marginBottom: SIZES.MARGIN_LARGE,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateLabel: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_LIGHT,
    marginRight: SIZES.MARGIN_SMALL,
  },
  dateButton: {
    padding: SIZES.PADDING_SM,
    borderRadius: SIZES.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  dateButtonContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  dateText: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.PRIMARY,
  },
  errorText: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.ACCENT,
    marginTop: SIZES.MARGIN_SMALL,
  },
  listContainer: {
    paddingBottom: SIZES.MARGIN_LARGE,
  },
  item: {
    flex: 1,
    padding: SIZES.PADDING,
    backgroundColor: COLORS.PRIMARY,
    margin: SIZES.MARGIN_SMALL,
    borderRadius: SIZES.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedItem: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: "#E6F7E6",
  },
  itemText: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_LIGHT,
  },
  selectedItemText: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.BOLD,
  },
  checkIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: SIZES.PADDING,
    borderRadius: SIZES.BORDER_RADIUS,
    alignItems: "center",
    marginTop: SIZES.MARGIN_LARGE,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonDisabled: {
    backgroundColor: COLORS.TEXT_SECONDARY,
  },
  buttonText: {
    color: COLORS.ON_PRIMARY,
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
  },
});

export default MachineryScreen;

