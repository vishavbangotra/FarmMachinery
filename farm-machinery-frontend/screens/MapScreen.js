import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FAB, Button as PaperButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { BottomSheet } from "react-native-btr";
import Slider from "@react-native-community/slider";

// Placeholder for your app's constants (adjust the import path as needed)
const COLORS = {
  PRIMARY: "#4CAF50",
  BORDER: "#ddd",
};
const SIZES = {};
const FONTS = {};
const GLOBAL_STYLES = {};

const MapScreen = ({ route, navigation }) => {
  // Sample farm data (replace with your actual data source)
  const savedFarms = [
    {
      id: "1",
      name: "Farm Jammu Auto",
      location: { latitude: 32.7300307600586, longitude: 74.85615100711584 },
    },
    {
      id: "1742126686607",
      location: { latitude: 32.72915219022547, longitude: 74.85791858285666 },
      name: "Farm Jammu 2",
    },
  ];

  // State declarations
  const [farms, setFarms] = useState(savedFarms);
  const [region, setRegion] = useState(null);
  const [addingFarm, setAddingFarm] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showFarmList, setShowFarmList] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [distance, setDistance] = useState(0); // Distance slider state
  const mapRef = useRef(null);

  // Set the first farm as selected by default and center the map on it
  useEffect(() => {
    if (farms.length > 0 && !selectedFarm) {
      const defaultFarm = farms[0];
      setSelectedFarm(defaultFarm);
      setRegion({
        latitude: defaultFarm.location.latitude,
        longitude: defaultFarm.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [farms, selectedFarm]);

  // Initial location setup (only if no farms exist)
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      if (farms.length === 0) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, []);

  // Handlers
  const onSelectFarm = (farm) => {
    setSelectedFarm(farm);
    setShowFarmList(false);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: farm.location.latitude,
          longitude: farm.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const onAddFarm = async (farm) => {
    const newFarm = { ...farm, id: Date.now().toString() };
    setFarms([...farms, newFarm]);
    return newFarm;
  };

  const handleMapPress = (e) => {
    if (addingFarm) {
      setTempLocation(e.nativeEvent.coordinate);
      setShowForm(true);
    }
  };

  const handleLongPress = (e) => {
    if (!addingFarm) {
      setAddingFarm(true);
      setTempLocation(e.nativeEvent.coordinate);
      setShowForm(true);
    }
  };

  const handleCancelAdd = () => {
    setAddingFarm(false);
    setTempLocation(null);
    setShowForm(false);
    setFarmName("");
  };

  const handleSaveFarm = async () => {
    if (farmName && tempLocation) {
      setIsSaving(true);
      try {
        const newFarm = { name: farmName, location: tempLocation };
        const savedFarm = await onAddFarm(newFarm);
        onSelectFarm(savedFarm);
        setIsSaving(false);
        handleCancelAdd();
      } catch (error) {
        console.log("Error adding farm:", error);
        setIsSaving(false);
      }
    }
  };

  const handleSearch = async () => {
    if (searchQuery) {
      try {
        const results = await Location.geocodeAsync(searchQuery);
        if (results.length > 0) {
          const { latitude, longitude } = results[0];
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion, 1000);
        }
      } catch (error) {
        console.log("Geocode error:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onPress={handleMapPress}
          onLongPress={handleLongPress}
          provider="google"
        >
          {farms.map((farm) => (
            <Marker
              key={`${farm.id}-${
                selectedFarm?.id === farm.id ? "selected" : "default"
              }`}
              coordinate={farm.location}
              title={farm.name}
              onPress={() => onSelectFarm(farm)}
              pinColor={selectedFarm?.id === farm.id ? "#4CAF50" : "#2196F3"}
            />
          ))}
          {tempLocation && (
            <Marker
              coordinate={tempLocation}
              title="New Farm"
              pinColor="#2196F3"
            />
          )}
        </MapView>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Top Controls: Selected Farm and Distance Slider */}
      {selectedFarm && (
        <View style={styles.topControlsContainer}>
          <View style={styles.selectedFarmContainer}>
            <Icon
              name="check"
              size={20}
              color="#4CAF50"
              style={styles.checkIcon}
            />
            <Text style={styles.selectedFarmText}>
              Selected: {selectedFarm.name}
            </Text>
          </View>
          <Text style={styles.distanceHeader}>Search Distance</Text>
          <Text style={styles.distanceText}>{distance} km</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor={COLORS.PRIMARY}
            maximumTrackTintColor={COLORS.BORDER}
            thumbTintColor={COLORS.PRIMARY}
          />
        </View>
      )}

      {/* Floating Action Buttons (FABs) */}
      <View style={styles.controlsContainer}>
        <FAB
          style={[styles.fab, { elevation: 4 }]}
          icon={addingFarm ? "close" : "plus"}
          label={addingFarm ? "Cancel" : "Add Farm"}
          onPress={() => (addingFarm ? handleCancelAdd() : setAddingFarm(true))}
        />
        <FAB
          style={[styles.fab, { elevation: 4 }]}
          icon="format-list-bulleted"
          label="Farms"
          onPress={() => setShowFarmList(true)}
        />
        {selectedFarm && (
          <FAB
            style={[styles.fab, styles.nextFab, { elevation: 4 }]}
            icon="arrow-right"
            label="Search Machinery"
            onPress={() =>
              navigation.navigate("MachinerySearch", {
                farm: selectedFarm,
                distance,
              })
            }
          />
        )}
      </View>

      {/* Bottom Sheet for Farm Selection */}
      <BottomSheet
        visible={showFarmList}
        onBackButtonPress={() => setShowFarmList(false)}
        onBackdropPress={() => setShowFarmList(false)}
      >
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Select a Farm</Text>
          <ScrollView>
            {farms.map((farm) => (
              <TouchableOpacity
                key={farm.id}
                style={styles.farmItem}
                onPress={() => onSelectFarm(farm)}
              >
                <Text style={styles.farmName}>{farm.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>

      {/* Modal for Adding a New Farm */}
      <Modal visible={showForm} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Farm Location</Text>
              <TouchableOpacity onPress={handleCancelAdd}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Farm Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter farm name"
              value={farmName}
              onChangeText={setFarmName}
              autoFocus
            />
            <PaperButton
              mode="contained"
              color="#4CAF50"
              onPress={handleSaveFarm}
              disabled={!farmName.trim() || isSaving}
              style={styles.saveButton}
            >
              {isSaving ? <ActivityIndicator color="#fff" /> : "Save Farm"}
            </PaperButton>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    elevation: 2,
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  topControlsContainer: {
    position: "absolute",
    top: 70, // Adjust based on your search bar height
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    zIndex: 1,
  },
  selectedFarmContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkIcon: {
    marginRight: 5,
  },
  selectedFarmText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  distanceHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  distanceText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    gap: 8,
  },
  fab: {
    backgroundColor: "#fff",
  },
  nextFab: {
    backgroundColor: "#4CAF50",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 300,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  farmItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  farmName: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    marginTop: 10,
  },
});

export default MapScreen;
