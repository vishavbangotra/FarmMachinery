import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";

const MachineryCard = ({ item }) => {
  // Calculate distance (assuming you have user's location in context)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Implement Haversine formula or use a library
    return "5 km"; // Placeholder
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/hire-in/${item.id}`)}
    >
      <Image
        source={
          item.image
            ? { uri: item.image }
            : require("../assets/machinery-placeholder.png")
        }
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.price}>₹{item.hourlyRate}/hour</Text>
          <Text style={styles.distance}>
            {calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              item.latitude,
              item.longitude
            )}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: item.available ? "#4CAF50" : "#f44336" },
            ]}
          />
          <Text style={styles.statusText}>
            {item.available ? "Available" : "Booked"}
          </Text>
        </View>

        {item.category && <Text style={styles.category}>{item.category}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontSize: RFValue(18),
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: RFValue(16),
    fontWeight: "500",
    color: "#4CAF50",
  },
  distance: {
    fontSize: RFValue(14),
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: RFValue(14),
    color: "#666",
  },
  category: {
    fontSize: RFValue(12),
    color: "#999",
    marginTop: 4,
  },
});

export default MachineryCard;
