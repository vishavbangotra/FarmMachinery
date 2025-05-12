import React, { useState, useEffect, useMemo } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "../../constants/styles";
import * as SecureStore from "expo-secure-store";
import { bookingService } from "../../services/bookingService";

// Assuming API_URL is defined in an environment config file
const API_URL = process.env.API_URL || "http://10.0.2.2:8080";

// BookingCard Component
const BookingCard = ({
  item,
  onPress,
  getMarkerColor,
  getStatusTextColor,
  formatStatus,
  calculateDistance,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.machineryName}>{item.modelInfo || "N.A."}</Text>
      <View
        style={[
          styles.statusPill,
          { backgroundColor: getMarkerColor(item.status) },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            { color: getStatusTextColor(item.status) },
          ]}
        >
          {formatStatus(item.status)}
        </Text>
      </View>
    </View>
    <Text style={styles.distanceText}>
      {calculateDistance({
        latitude: item.latitude,
        longitude: item.longitude,
      })}
    </Text>
    <Text style={styles.dateText}>
      From {new Date(item.startDate).toLocaleDateString()} to{" "}
      {new Date(item.endDate).toLocaleDateString()}
    </Text>
  </TouchableOpacity>
);

// BookingModal Component
const BookingModal = ({
  visible,
  booking,
  onClose,
  onStatusChange,
  getMarkerColor,
  calculateDistance,
  openDirections,
}) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {booking && (
          <>
            <Text style={styles.modalTitle}>{booking.modelInfo || "N.A."}</Text>
            <View style={styles.infoRow}>
              <MaterialIcons
                name="schedule"
                size={20}
                color={COLORS.TERTIARY}
              />
              <Text style={styles.infoText}>
                From {new Date(booking.startDate).toLocaleDateString()} to{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons
                name="location-pin"
                size={20}
                color={COLORS.TERTIARY}
              />
              <Text style={styles.infoText}>
                {calculateDistance({
                  latitude: booking.latitude,
                  longitude: booking.longitude,
                })}
              </Text>
            </View>
            <Pressable
              style={styles.mapPreview}
              onPress={() => openDirections(booking)}
            >
              <MapView
                style={styles.miniMap}
                scrollEnabled={false}
                zoomEnabled={false}
                region={{
                  latitude: booking.latitude,
                  longitude: booking.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: booking.latitude,
                    longitude: booking.longitude,
                  }}
                >
                  <MaterialIcons
                    name="location-pin"
                    size={32}
                    color={getMarkerColor(booking.status)}
                  />
                </Marker>
              </MapView>
            </Pressable>
            {booking.status.toLowerCase() === "pending" && (
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.button, { backgroundColor: COLORS.TEXT_DARK }]}
                  onPress={() => onStatusChange("DECLINED")}
                >
                  <Text
                    style={[styles.buttonText, { color: COLORS.TEXT_LIGHT }]}
                  >
                    Decline
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.button, { backgroundColor: COLORS.ACCENT }]}
                  onPress={() => onStatusChange("CONFIRMED")}
                >
                  <Text style={[styles.buttonText, { color: COLORS.TERTIARY }]}>
                    Approve
                  </Text>
                </Pressable>
              </View>
            )}
            {booking.status.toLowerCase() === "confirmed" && (
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.button, { backgroundColor: COLORS.PRIMARY }]}
                  onPress={() => onStatusChange("COMPLETED")}
                >
                  <Text
                    style={[styles.buttonText, { color: COLORS.TEXT_LIGHT }]}
                  >
                    Mark as Completed
                  </Text>
                </Pressable>
              </View>
            )}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  </Modal>
);

const BookingListScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [activeFilter, setActiveFilter] = useState("all");
  const [userLocation, setUserLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [isFetchingBookings, setIsFetchingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  // Fetch user location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Location permission denied");
          setIsFetchingLocation(false);
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        setIsFetchingLocation(false);
      } catch (error) {
        setLocationError("Failed to fetch location");
        setIsFetchingLocation(false);
      }
    })();
  }, []);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsFetchingBookings(true);
        const bookings = await bookingService.getAllBookings();
        setBookings(bookings);
        setIsFetchingBookings(false);
      } catch (error) {
        setBookingsError(error.message || "Failed to fetch bookings");
        setIsFetchingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  const formatStatus = (status) =>
    status
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : "";

  const calculateDistance = (loc) => {
    if (isFetchingLocation)
      return <ActivityIndicator size="small" color={COLORS.PRIMARY} />;
    if (locationError) return "Location unavailable";
    if (!userLocation) return "Location unavailable";
    const R = 6371;
    const dLat = ((loc.latitude - userLocation.latitude) * Math.PI) / 180;
    const dLon = ((loc.longitude - userLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLocation.latitude * Math.PI) / 180) *
        Math.cos((loc.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return `${(R * c).toFixed(1)} km away`;
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await bookingService.updateBookingStatus(selectedBooking.bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === selectedBooking.bookingId
            ? { ...b, status: newStatus }
            : b
        )
      );
      setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredBookings = useMemo(() => {
    const validStatuses = ["pending", "confirmed", "completed"];
    return bookings.filter((b) => {
      const status = b.status.toLowerCase();
      if (activeFilter === "all") {
        return validStatuses.includes(status);
      } else {
        return status === activeFilter;
      }
    });
  }, [bookings, activeFilter]);

  const getMarkerColor = (status) => {
    const formattedStatus = formatStatus(status);
    switch (formattedStatus) {
      case "Pending":
        return COLORS.ACCENT;
      case "Confirmed":
        return COLORS.PRIMARY;
      case "Completed":
        return COLORS.TERTIARY;
      default:
        return COLORS.TERTIARY;
    }
  };

  const getStatusTextColor = (status) =>
    formatStatus(status) === "Pending" ? COLORS.TERTIARY : COLORS.TEXT_LIGHT;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const bookings = await bookingService.getAllBookings();
      setBookings(bookings);
    } catch (error) {
      console.error("Error refreshing bookings:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const openDirections = (booking) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.latitude},${booking.longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          {["all", "pending", "confirmed", "completed"].map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    activeFilter === filter ? COLORS.ACCENT : COLORS.SECONDARY,
                  borderColor:
                    activeFilter === filter ? COLORS.PRIMARY : COLORS.ACCENT,
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      activeFilter === filter
                        ? COLORS.PRIMARY
                        : COLORS.TERTIARY,
                  },
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={() => setViewMode((v) => (v === "list" ? "map" : "list"))}
          style={[styles.viewToggle, { backgroundColor: COLORS.SECONDARY }]}
        >
          <MaterialIcons
            name={viewMode === "list" ? "map" : "list"}
            size={24}
            color={COLORS.PRIMARY}
          />
        </Pressable>
      </View>

      {viewMode === "list" ? (
        isFetchingBookings ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : bookingsError ? (
          <Text style={styles.errorText}>{bookingsError}</Text>
        ) : (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item.bookingId.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={COLORS.PRIMARY}
              />
            }
            renderItem={({ item }) => (
              <BookingCard
                item={item}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedBooking(item);
                  setModalVisible(true);
                }}
                getMarkerColor={getMarkerColor}
                getStatusTextColor={getStatusTextColor}
                formatStatus={formatStatus}
                calculateDistance={calculateDistance}
              />
            )}
          />
        )
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation?.latitude || 32.73,
            longitude: userLocation?.longitude || 74.856,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zoomEnabled
          scrollEnabled
        >
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="You are here"
            >
              <MaterialIcons
                name="person-pin"
                size={32}
                color={COLORS.PRIMARY}
              />
            </Marker>
          )}
          {filteredBookings.map((booking) => (
            <Marker
              key={booking.bookingId}
              coordinate={{
                latitude: booking.latitude,
                longitude: booking.longitude,
              }}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedBooking(booking);
                setModalVisible(true);
              }}
            >
              <View style={styles.markerContainer}>
                <MaterialIcons
                  name="location-pin"
                  size={32}
                  color={getMarkerColor(booking.status)}
                />
                <Text style={styles.markerText}>
                  {booking.modelInfo || "N.A."}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      <BookingModal
        visible={modalVisible}
        booking={selectedBooking}
        onClose={() => setModalVisible(false)}
        onStatusChange={handleStatusChange}
        getMarkerColor={getMarkerColor}
        calculateDistance={calculateDistance}
        openDirections={openDirections}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.PADDING,
  },
  filterContainer: {
    flexDirection: "row",
    gap: SIZES.MARGIN_MEDIUM,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: SIZES.PADDING_SM,
    paddingVertical: SIZES.PADDING_SM,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  filterText: { fontSize: SIZES.INFO_TEXT, fontFamily: FONTS.MEDIUM },
  viewToggle: { padding: SIZES.PADDING_SM, borderRadius: SIZES.BORDER_RADIUS },
  listContent: { paddingBottom: SIZES.MARGIN_LARGE },
  card: {
    borderRadius: SIZES.BORDER_RADIUS * 2,
    padding: SIZES.PADDING,
    marginHorizontal: SIZES.PADDING,
    marginBottom: SIZES.MARGIN_MEDIUM,
    backgroundColor: "#fff",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ACCENT,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.MARGIN_MEDIUM,
  },
  machineryName: {
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
  },
  statusPill: {
    paddingHorizontal: SIZES.PADDING_SM,
    paddingVertical: SIZES.PADDING_SM / 2,
    borderRadius: SIZES.BORDER_RADIUS * 2,
  },
  statusText: { fontSize: 13, fontFamily: FONTS.MEDIUM },
  distanceText: {
    fontSize: SIZES.INFO_TEXT,
    color: COLORS.TERTIARY,
    fontFamily: FONTS.REGULAR,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  dateText: {
    fontSize: SIZES.INFO_TEXT,
    color: COLORS.TEXT_DARK,
    fontFamily: FONTS.REGULAR,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 150,
  },
  markerContainer: { alignItems: "center" },
  markerText: {
    fontSize: 12,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.TEXT_DARK,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: SIZES.BORDER_RADIUS * 3,
    borderTopRightRadius: SIZES.BORDER_RADIUS * 3,
    padding: SIZES.PADDING,
    width: "100%",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT_DARK,
    marginBottom: SIZES.MARGIN_MEDIUM,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.MARGIN_MEDIUM,
    marginBottom: SIZES.MARGIN_MEDIUM,
  },
  infoText: {
    color: COLORS.TEXT_DARK,
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
  },
  mapPreview: {
    height: 150,
    borderRadius: SIZES.BORDER_RADIUS * 1.5,
    overflow: "hidden",
    marginVertical: SIZES.MARGIN_MEDIUM,
  },
  miniMap: { ...StyleSheet.absoluteFillObject },
  buttonRow: {
    flexDirection: "row",
    gap: SIZES.MARGIN_MEDIUM,
    marginTop: SIZES.MARGIN_MEDIUM,
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.PADDING,
    borderRadius: SIZES.BORDER_RADIUS,
    alignItems: "center",
  },
  buttonText: { fontSize: SIZES.BUTTON_TEXT, fontFamily: FONTS.MEDIUM },
  closeButton: { marginTop: SIZES.MARGIN_MEDIUM, alignSelf: "center" },
  closeButtonText: {
    color: COLORS.PRIMARY,
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.MEDIUM,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: SIZES.INFO_TEXT,
    color: COLORS.TERTIARY,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: SIZES.INFO_TEXT,
    color: COLORS.TEXT_DARK,
  },
});

export default BookingListScreen;
