import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";

const MachinerySearchDetailScreen = ({ route }) => {
  const { item } = route.params;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

  const showStartPicker = () => setStartPickerVisibility(true);
  const hideStartPicker = () => setStartPickerVisibility(false);
  const handleConfirmStart = (date) => {
    setStartDate(date);
    hideStartPicker();
  };

  const showEndPicker = () => setEndPickerVisibility(true);
  const hideEndPicker = () => setEndPickerVisibility(false);
  const handleConfirmEnd = (date) => {
    setEndDate(date);
    hideEndPicker();
  };

  const handleBookingRequest = () => {
    console.log(
      "Booking request sent with start date:",
      startDate,
      "and end date:",
      endDate
    );
    // Extend this function to perform further validations or API calls as needed.
  };

  const formatDate = (date) => {
    return date ? date.toISOString().split("T")[0] : "Select Date";
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.vehicle_image }} style={styles.detailImage} />
      <Text style={styles.detailTitle}>{item.machinery}</Text>
      <Text style={styles.detailText}>Owner: {item.owner_name}</Text>
      <Text style={styles.detailText}>Distance: {item.distance}</Text>
      <Text style={styles.detailText}>
        Availability: {item.availability_date}
      </Text>
      <Text style={styles.detailText}>Rating: ⭐ {item.owner_star_rating}</Text>

      <TouchableOpacity style={styles.datePicker} onPress={showStartPicker}>
        <Text style={styles.datePickerText}>
          Start Date: {formatDate(startDate)}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        onConfirm={handleConfirmStart}
        onCancel={hideStartPicker}
      />

      <TouchableOpacity style={styles.datePicker} onPress={showEndPicker}>
        <Text style={styles.datePickerText}>
          End Date: {formatDate(endDate)}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        onConfirm={handleConfirmEnd}
        onCancel={hideEndPicker}
      />

      <TouchableOpacity style={styles.button} onPress={handleBookingRequest}>
        <Text style={styles.buttonText}>Send Booking Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  detailImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.INPUT_BG,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MachinerySearchDetailScreen;
