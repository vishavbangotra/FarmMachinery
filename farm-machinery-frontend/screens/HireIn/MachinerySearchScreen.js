import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchData from "../../dummy_data/SearchData";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";

const MachinerySearchScreen = ({ route }) => {
    console.log(route.params)
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState(SearchData);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate("MachinerySearchDetail", { item })}
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

  return (
    <View style={[styles.container]}>
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.BACKGROUND,
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
});

export default MachinerySearchScreen;
