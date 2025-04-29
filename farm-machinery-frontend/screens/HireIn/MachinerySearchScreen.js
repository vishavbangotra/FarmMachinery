import React, { useState, useEffect, useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Linking,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/styles"; // Assuming COLORS is defined in your constants

const windowWidth = Dimensions.get("window").width;

const MachinerySearchScreen = ({ route }) => {
  const { distance, endDate, farm, pushTokens, machinery, startDate } =
    route.params;

  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState([]);
  const [isSendAllModalVisible, setSendAllModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isBookingModalVisible, setBookingModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set navigation header options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSendToAll}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginRight: 10,
            }}
          >
            <Text style={{ color: COLORS.TEXT_LIGHT, fontWeight: "800" }}>
              Send All
            </Text>
            <Ionicons name="send" size={24} color={COLORS.TEXT_LIGHT} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Fetch machinery data from API
  useEffect(() => {
    const fetchMachinery = async () => {
      setIsLoading(true);
      try {
        const apiUrl = `http://10.0.2.2:8080/api/machinery/search?type=${machinery.toUpperCase()}&lon=${
          farm.longitude
        }&lat=${farm.latitude}&distance=${distance}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        const machineryList = await response.json();
        setSearchResults(machineryList);
      } catch (error) {
        console.error("Error fetching machinery data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMachinery();
  }, [machinery, startDate, endDate, farm, distance]);

  // Render each item in the list view
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setSelectedItem(item);
        setBookingModalVisible(true);
      }}
    >
      <Image
        source={{
          uri: item.imageUrls?.[0] || "https://via.placeholder.com/80",
        }}
        style={styles.vehicleImage}
      />
      <View style={styles.textContainer}>
        <Text
          style={styles.machineryName}
        >{`${item.type} - ${item.farmDescription}`}</Text>
        {item.model && (
          <Text style={styles.modelText}>Model: {item.model}</Text>
        )}
        <Text style={styles.distance}>{`${item.distance.toFixed(
          1
        )} km away`}</Text>
        {item.rentPerDay > 0 && (
          <Text style={styles.rentText}>Rent: ₹{item.rentPerDay}/day</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Handle "Send to All" action
  const handleSendToAll = () => setSendAllModalVisible(true);

  const confirmSendToAll = () => {
    console.log("Sending booking requests to all machinery owners");
    setSendAllModalVisible(false);
  };

  // Handle individual booking request
  const confirmBooking = () => {
    console.log("Booking request sent for", selectedItem?.type);
    setBookingModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Search Summary Header */}
      <View style={styles.searchSummary}>
        <Text style={styles.searchSummaryText}>
          Searching for {machinery} within {distance} km from {farm.name}
        </Text>
      </View>

      {/* Loading, Empty State, or List */}
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      ) : searchResults.length === 0 ? (
        <Text style={styles.emptyText}>
          No machinery found matching your criteria.
        </Text>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      {/* Modal for "Send to All" Confirmation */}
      <Modal visible={isSendAllModalVisible} transparent animationType="fade">
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
      <Modal visible={isBookingModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            {selectedItem && (
              <>
                <FlatList
                  horizontal
                  data={selectedItem.imageUrls}
                  renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.detailImage} />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                />
                <Text style={styles.detailTitle}>{selectedItem.type}</Text>
                <Text style={styles.detailText}>
                  Farm: {selectedItem.farmDescription}
                </Text>
                {selectedItem.model && (
                  <Text style={styles.detailText}>
                    Model: {selectedItem.model}
                  </Text>
                )}
                {selectedItem.rentPerDay > 0 && (
                  <Text style={styles.detailText}>
                    Rent: ₹{selectedItem.rentPerDay}/day
                  </Text>
                )}
                <Text style={styles.detailText}>
                  Distance: {selectedItem.distance.toFixed(1)} km away
                </Text>
                {selectedItem.remarks !== "NONE" && (
                  <Text style={styles.detailText}>
                    Remarks: {selectedItem.remarks}
                  </Text>
                )}
                <View style={styles.ownerContainer}>
                  <Text style={styles.detailText}>
                    Contact: {selectedItem.ownerPhone}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`tel:${selectedItem.ownerPhone}`)
                    }
                    style={styles.callButton}
                  >
                    <Ionicons name="call" size={24} color={COLORS.PRIMARY} />
                  </TouchableOpacity>
                </View>
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
  searchSummary: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchSummaryText: {
    fontSize: 16,
    color: "#333",
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
  modelText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  distance: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  rentText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
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
  detailImage: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    marginRight: 10,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  callButton: {
    marginLeft: 10,
  },
  bookingButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  bookingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  closeButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: "bold",
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

export default MachinerySearchScreen;
