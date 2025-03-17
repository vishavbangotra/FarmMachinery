import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  Dimensions,
  RefreshControl,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import bookingsData from "../../dummy_data/bookingData";
import { FlatList } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../constants/styles";

const BookingListScreen = () => {
  const [bookings, setBookings] = useState(bookingsData);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'pending', 'accepted', 'declined'
  const [userLocation, setUserLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  // Calculate distance from user to booking
  const calculateDistance = (bookingLocation) => {
    if (!userLocation) return "Calculating...";

    const R = 6371;
    const dLat =
      ((bookingLocation.latitude - userLocation.latitude) * Math.PI) / 180;
    const dLon =
      ((bookingLocation.longitude - userLocation.longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.latitude * Math.PI) / 180) *
        Math.cos((bookingLocation.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return `${(R * c).toFixed(1)} km away`;
  };

  const handleResponse = async (status) => {
    await Haptics.selectionAsync();
    const updatedBookings = bookings.map((booking) =>
      booking.id === selectedBooking.id ? { ...booking, status } : booking
    );
    setBookings(updatedBookings);
    setModalVisible(false);
  };

  const filteredBookings = bookings.filter((booking) =>
    activeFilter === "all"
      ? true
      : booking.status.toLowerCase() === activeFilter
  );

  const getMarkerColor = (status) => {
    switch (status) {
      case "Pending":
        return "#3B82F6";
      case "Accepted":
        return "#10B981";
      case "Declined":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const openDirections = (location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* View Mode Toggle */}
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          {["all", "pending", "accepted", "declined"].map((filter) => (
            <Pressable
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilter,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.viewToggle}
          onPress={() =>
            setViewMode((prev) => (prev === "list" ? "map" : "list"))
          }
        >
          <MaterialIcons
            name={viewMode === "list" ? "map" : "list"}
            size={24}
            color="#3B82F6"
          />
        </Pressable>
      </View>

      {viewMode === "list" ? (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#3B82F6"
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedBooking(item);
                setModalVisible(true);
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.machineryName}>{item.machinery.name}</Text>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: getMarkerColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <Text style={styles.distanceText}>
                {calculateDistance(item.location)}
              </Text>

              <Text style={styles.dateText}>
                {new Date(item.startDate).toLocaleDateString()} •{" "}
                {new Date(item.startDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(item.endDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 32.7300307600586,
            longitude: 74.85615100711584,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {filteredBookings.map((booking) => (
            <Marker
              key={booking.id}
              coordinate={booking.location}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedBooking(booking);
                setModalVisible(true);
              }}
            >
              <View style={styles.markerContainer}>
                <MaterialIcons
                  name="location-pin"
                  size={40}
                  color={getMarkerColor(booking.status)}
                />
                <Text style={styles.markerText}>{booking.machinery.name}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedBooking && (
              <>
                <Image
                  source={{ uri: selectedBooking.machinery.image }}
                  style={styles.machineryImage}
                  placeholder={require("../../assets/placeholder.png")}
                  transition={200}
                />

                <View style={styles.modalBody}>
                  <Text style={styles.modalTitle}>
                    {selectedBooking.machinery.name}
                  </Text>

                  <View style={styles.infoRow}>
                    <MaterialIcons name="schedule" size={20} color="#6B7280" />
                    <Text style={styles.infoText}>
                      {new Date(selectedBooking.startDate).toLocaleString()} -{" "}
                      {new Date(selectedBooking.endDate).toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialIcons
                      name="location-pin"
                      size={20}
                      color="#6B7280"
                    />
                    <Text style={styles.infoText}>
                      {calculateDistance(selectedBooking.location)}
                    </Text>
                  </View>

                  <Pressable
                    style={styles.mapPreview}
                    onPress={() => openDirections(selectedBooking.location)}
                  >
                    <MapView
                      style={styles.miniMap}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      region={{
                        ...selectedBooking.location,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }}
                    >
                      <Marker coordinate={selectedBooking.location}>
                        <MaterialIcons
                          name="location-pin"
                          size={32}
                          color={getMarkerColor(selectedBooking.status)}
                        />
                      </Marker>
                    </MapView>
                  </Pressable>

                  {selectedBooking.status === "Pending" && (
                    <View style={styles.buttonRow}>
                      <Pressable
                        style={[styles.button, styles.declineButton]}
                        onPress={() => handleResponse("Declined")}
                      >
                        <Text style={styles.buttonText}>Decline</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.button, styles.acceptButton]}
                        onPress={() => handleResponse("Accepted")}
                      >
                        <Text style={styles.buttonText}>Accept</Text>
                      </Pressable>
                    </View>
                  )}

                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close Details</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
  },
  activeFilter: {
    backgroundColor: COLORS.PRIMARY,
  },
  filterText: {
    color: "black",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "white" /* This should be the same as the background color of activeFilter */,
    fontWeight: "500",
    },
  viewToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
  },
  listContent: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  machineryName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  distanceText: {
    color: "#3B82F6",
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    color: "#64748B",
    fontSize: 14,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 150,
  },
  markerContainer: {
    alignItems: "center",
  },
  markerText: {
    fontWeight: "500",
    color: "#1E293B",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    width: "90%",
    maxHeight: "85%",
    overflow: "hidden",
  },
  machineryImage: {
    width: "100%",
    height: 200,
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  infoText: {
    color: "#64748B",
    fontSize: 16,
  },
  mapPreview: {
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 16,
  },
  miniMap: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#10B981",
  },
  declineButton: {
    backgroundColor: "#EF4444",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});

export default BookingListScreen;

