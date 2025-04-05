import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";

const MachinerySearchDetailScreen = ({ route }) => {
  const { item } = route.params;
  const [isBookingModalVisible, setBookingModalVisible] = useState(false);

  const handleBookingRequest = () => {
    setBookingModalVisible(true);
  };

  const confirmBooking = () => {
    // Placeholder for sending booking request
    console.log("Booking request sent for", item.machinery);
    setBookingModalVisible(false);
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

      <TouchableOpacity style={styles.button} onPress={handleBookingRequest}>
        <Text style={styles.buttonText}>Send Booking Request</Text>
      </TouchableOpacity>

      <Modal
        visible={isBookingModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Booking Request</Text>
            <Text style={styles.modalText}>
              Are you sure you want to send a booking request for{" "}
              {item.machinery}?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setBookingModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmBooking}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MachinerySearchDetailScreen;
