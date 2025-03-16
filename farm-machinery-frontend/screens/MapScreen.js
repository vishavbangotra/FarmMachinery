import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FAB, Button as PaperButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome"; // For icons (install: npm install react-native-vector-icons)

const MapScreen = ({ route, navigation }) => {
  const savedFarms = [
      {
        id: "1",
        name: "Farm Jammu Auto",
        location: { latitude: 32.7300307600586, longitude: 74.85615100711584 },
      },
    ];
    const [farms, setFarms] = useState(savedFarms);
    const onSelectFarm = (farm) => {
      console.log("Selected farm:", farm);
    };
    const onAddFarm = async (farm) => {
      const newFarm = { ...farm, id: Date.now().toString() };
        setFarms([...farms, newFarm]);
      return newFarm; // Simulate async save
    };
  const [region, setRegion] = useState(null);
  const [addingFarm, setAddingFarm] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFarm, setSelectedFarm] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleMapPress = (e) => {
    if (addingFarm) {
      setTempLocation(e.nativeEvent.coordinate);
      setShowForm(true);
    }
  };

  const handleMarkerPress = (farm) => {
    if (!addingFarm) {
      setSelectedFarm(farm);
      onSelectFarm(farm);
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
      try {
        const newFarm = { name: farmName, location: tempLocation };
        const savedFarm = await onAddFarm(newFarm);
        setSelectedFarm(savedFarm);
        onSelectFarm(savedFarm);
        setAddingFarm(false);
        setTempLocation(null);
        setShowForm(false);
        setFarmName("");
      } catch (error) {
        console.log("Error adding farm:", error);
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
          provider="google"
        >
          {farms.map((farm) => (
            <Marker
              key={farm.id}
              coordinate={farm.location}
              title={farm.name}
              onPress={() => handleMarkerPress(farm)}
              pinColor={selectedFarm?.id === farm.id ? "#4CAF50" : "#F44336"}
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

      {/* Search Bar with Icon */}
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

      {/* Picker with Styled Container */}
      {!addingFarm && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedFarm?.id}
            onValueChange={(itemValue) => {
              if (itemValue) {
                const farm = farms.find((f) => f.id === itemValue);
                if (farm) {
                  setSelectedFarm(farm);
                  onSelectFarm(farm);
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
                }
              } else {
                setSelectedFarm(null);
              }
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select a farm..." value={null} />
            {farms.map((farm) => (
              <Picker.Item key={farm.id} label={farm.name} value={farm.id} />
            ))}
          </Picker>
        </View>
      )}

      {/* FABs with Elevation */}
      <View style={styles.controlsContainer}>
        <FAB
          style={[styles.fab, { elevation: 4 }]}
          icon={addingFarm ? "close" : "plus"}
          label={addingFarm ? "Cancel" : "Add Farm"}
          onPress={() => (addingFarm ? handleCancelAdd() : setAddingFarm(true))}
        />
        {selectedFarm && (
          <FAB
            style={[styles.fab, styles.nextFab, { elevation: 4 }]}
            icon="arrow-right"
            label="Next"
            onPress={() =>
              navigation.navigate("DistanceSlider", { farm: selectedFarm })
            }
          />
        )}
      </View>

      {/* Redesigned Modal */}
      <Modal visible={showForm} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Farm Location</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
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
              disabled={!farmName.trim()}
              style={styles.saveButton}
            >
              Save Farm
            </PaperButton>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  pickerContainer: {
    position: "absolute",
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
    padding: 5,
    elevation: 2,
    zIndex: 1,
  },
  picker: {
    height: 50,
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
