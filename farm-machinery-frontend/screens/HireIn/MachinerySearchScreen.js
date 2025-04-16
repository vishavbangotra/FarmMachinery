import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";

const MachinerySearchScreen = ({ route }) => {
  // Expecting route params to include necessary search parameters:
  // e.g., type, distance, lon, lat (passed from a previous screen)
  const {
    distance,
    endDate,
    farm,
    pushTokens,
    machinery,
    startDate,
  } = route.params;

  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState([]);
  const [isSendAllModalVisible, setSendAllModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isBookingModalVisible, setBookingModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch machinery list from API on component mount
  useEffect(() => {
    const fetchMachinery = async () => {
      setIsLoading(true);
      try {
        // Build URL with query parameters from route params
        // Modify URL as necessary to match your backend endpoint
        const apiUrl = `http://10.0.2.2:8080/api/machinery/search?type=${machinery.toUpperCase()}&lon=${farm.longitude}&lat=${farm.latitude}&distance=${distance}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const machineryList = await response.json();
        console.log(machineryList)
        setSearchResults(machineryList);
      } catch (error) {
        console.error("Error fetching machinery data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachinery();
  }, [machinery, startDate, endDate, farm, distance]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setSelectedItem(item);
        setBookingModalVisible(true);
      }}
    >
      <Image source={{ uri: item.vehicle_image }} style={styles.vehicleImage} />
      <View style={styles.textContainer}>
        <Text style={styles.machineryName}>{item.machinery}</Text>
        <Text style={styles.ownerName}>{item.owner_name}</Text>
        <Text style={styles.distance}>{item.distance} away</Text>
        <Text style={styles.availability}>
          Available from {item.availability_date}
        </Text>
        <Text style={styles.rating}>⭐ {item.owner_star_rating}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleSendToAll = () => {
    setSendAllModalVisible(true);
  };

  const confirmSendToAll = () => {
    console.log("Sending booking requests to all machinery owners");
    setSendAllModalVisible(false);
  };

  const confirmBooking = () => {
    console.log("Booking request sent for", selectedItem?.machinery);
    setBookingModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* "Send Booking Request to All" Button at the Top */}
      <TouchableOpacity
        style={styles.sendToAllButton}
        onPress={handleSendToAll}
      >
        <Text style={styles.sendToAllText}>Send Booking Request to All</Text>
      </TouchableOpacity>

      {/* Show loading indicator while fetching data */}
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      {/* Modal for "Send to All" Confirmation */}
      <Modal
        visible={isSendAllModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Sending to All</Text>
            <Text style={styles.modalText}>
              Are you sure you want to send booking requests to all listed
              machinery owners?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setSendAllModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmSendToAll}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Machinery Details */}
      <Modal
        visible={isBookingModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            {selectedItem && (
              <>
                <Image
                  source={{ uri: selectedItem.vehicle_image }}
                  style={styles.detailModalImage}
                />
                <Text style={styles.detailModalTitle}>
                  {selectedItem.machinery}
                </Text>
                <Text style={styles.detailModalText}>
                  Owner: {selectedItem.owner_name}
                </Text>
                <Text style={styles.detailModalText}>
                  Distance: {selectedItem.distance} away
                </Text>
                <Text style={styles.detailModalText}>
                  Available from: {selectedItem.availability_date}
                </Text>
                <Text style={styles.detailModalText}>
                  Rating: ⭐ {selectedItem.owner_star_rating}
                </Text>
                <TouchableOpacity
                  style={styles.bookingButton}
                  onPress={confirmBooking}
                >
                  <Text style={styles.bookingButtonText}>
                    Send Booking Request
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setBookingModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
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
    backgroundColor: COLORS.BACKGROUND,
  },
  sendToAllButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  sendToAllText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  machineryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  ownerName: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  distance: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  availability: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    color: "#ffa500",
    marginTop: 4,
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
  detailModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  detailModalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  detailModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  detailModalText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
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
  bookingButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  bookingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 12,
    padding: 10,
  },
  closeButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MachinerySearchScreen;
