import React, { useState, useEffect, useLayoutEffect } from "react";
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
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/styles";
import { machineryService } from "../../services/machineryService";
import { bookingService } from "../../services/bookingService";

const windowWidth = Dimensions.get("window").width;

// Component for displaying search summary
const SearchSummary = ({ machinery, distance, farmName }) => (
  <View style={styles.searchSummary}>
    <Text style={styles.searchSummaryText}>
      Searching for {machinery} within {distance} km from {farmName}
    </Text>
  </View>
);

// Component for rendering each machinery item
const MachineryItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
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
      {item.model && <Text style={styles.modelText}>Model: {item.model}</Text>}
      <Text style={styles.distance}>{`${item.distance.toFixed(
        1
      )} km away`}</Text>
      {item.rentPerDay > 0 && (
        <Text style={styles.rentText}>Rent: ₹{item.rentPerDay}/day</Text>
      )}
    </View>
  </TouchableOpacity>
);

const MachinerySearchScreen = ({ route }) => {
  const { distance, endDate, farm, machinery, startDate } = route.params;
  const navigation = useNavigation();

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isSendAllModalVisible, setSendAllModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isBookingModalVisible, setBookingModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSendToAll}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginRight: 10 }}>
            <Text style={{ color: COLORS.TERTIARY, fontWeight: "800" }}>Send All</Text>
            <Ionicons name="send" size={24} color={COLORS.TERTIARY} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchMachinery = async () => {
    try {
      const response = await machineryService.searchMachinery(
        machinery,
        farm.longitude,
        farm.latitude,
        distance
      );
      setSearchResults(response);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching machinery data:", error);
      setFetchError("Failed to fetch machinery data. Please try again.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchMachinery();
      setIsLoading(false);
    };
    loadData();
  }, [machinery, farm, distance]);

  const handleSendToAll = () => setSendAllModalVisible(true);

  const confirmSendToAll = async () => {
    setIsSending(true);
    try {
      const promises = searchResults.map(item =>
        bookingService.createBooking({
          machineryId: item.machineryId,
          startDate,
          endDate
        })
      );
      await Promise.all(promises);
      setSendAllModalVisible(false);
      navigation.navigate("BookingList");
    } catch (error) {
      Alert.alert("Error", "Failed to send some or all booking requests.");
    } finally {
      setIsSending(false);
    }
  };

  const confirmBooking = async () => {
    if (!selectedItem) return;
    
    setIsSending(true);
    try {
      await bookingService.createBooking({
        machineryId: selectedItem.machineryId,
        startDate,
        endDate
      });
      setBookingModalVisible(false);
      navigation.navigate("BookingList");
    } catch (error) {
      Alert.alert("Error", "Failed to send booking request.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <SearchSummary
        machinery={machinery}
        distance={distance}
        farmName={farm.name}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      ) : fetchError ? (
        <Text style={styles.errorText}>{fetchError}</Text>
      ) : searchResults.length === 0 ? (
        <Text style={styles.emptyText}>
          No machinery found matching your criteria.
        </Text>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <MachineryItem
              item={item}
              onPress={() => {
                setSelectedItem(item);
                setBookingModalVisible(true);
              }}
            />
          )}
          keyExtractor={(item) => item.machineryId.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await fetchMachinery();
                setRefreshing(false);
              }}
            />
          }
        />
      )}

      {/* Send to All Modal */}
      <Modal visible={isSendAllModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Sending to All</Text>
            <Text style={styles.modalText}>
              Are you sure you want to send booking requests to all listed
              machinery owners?
            </Text>
            {isSending && (
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setSendAllModalVisible(false)}
                disabled={isSending}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmSendToAll}
                disabled={isSending}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Machinery Details Modal */}
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
                  disabled={isSending}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.bookingButtonText}>
                      Send Booking Request
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setBookingModalVisible(false)}
                  disabled={isSending}
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

// Updated styles with errorText addition
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
  errorText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "red",
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
