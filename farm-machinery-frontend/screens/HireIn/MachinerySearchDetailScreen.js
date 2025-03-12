import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";

const MachinerySearchDetailScreen = ({ route }) => {
  const { item } = route.params;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

  const showStartPicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: startDate || new Date(),
        onChange: (event, selectedDate) => {
          if (selectedDate) {
            setStartDate(selectedDate);
          }
        },
        mode: "date",
      });
    } else {
      setStartPickerVisibility(true);
    }
  };

  const hideStartPicker = () => setStartPickerVisibility(false);

  const handleConfirmStart = (selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
    hideStartPicker();
  };

  const showEndPicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: endDate || new Date(),
        onChange: (event, selectedDate) => {
          if (selectedDate) {
            setEndDate(selectedDate);
          }
        },
        mode: "date",
      });
    } else {
      setEndPickerVisibility(true);
    }
  };

  const hideEndPicker = () => setEndPickerVisibility(false);

  const handleConfirmEnd = (selectedDate) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
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

      {Platform.OS === "ios" && (
        <Modal visible={isStartPickerVisible} transparent={true}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              onChange={(event, selectedDate) =>
                handleConfirmStart(selectedDate)
              }
            />
            <Button title="Cancel" onPress={hideStartPicker} />
          </View>
        </Modal>
      )}

      <TouchableOpacity style={styles.datePicker} onPress={showEndPicker}>
        <Text style={styles.datePickerText}>
          End Date: {formatDate(endDate)}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "ios" && (
        <Modal visible={isEndPickerVisible} transparent={true}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              onChange={(event, selectedDate) => handleConfirmEnd(selectedDate)}
            />
            <Button title="Cancel" onPress={hideEndPicker} />
          </View>
        </Modal>
      )}

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
