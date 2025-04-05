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
  Animated,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FAB, Button as PaperButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { BottomSheet } from "react-native-btr";
import * as Haptics from "expo-haptics";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// App constants
const COLORS = {
  PRIMARY: "#34C759",
  SECONDARY: "#F2F2F7",
  ACCENT: "#5856D6",
  TEXT: "#1C2526",
  BORDER: "#E5E5EA",
};

const SelectFarmForMachinery = ({ navigation, route }) => {
  // Updated farm format: each object has id, description, latitude, and longitude.
  const savedFarms = [
    {
      id: 2,
      description: "Test Farm 2",
      latitude: 40.7128,
      longitude: -74.0063,
    },
  ];

  // State declarations
  const [farms, setFarms] = useState(savedFarms);
  const [region, setRegion] = useState(null);
  const [addingFarm, setAddingFarm] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  // We'll use the farmName field for the description now.
  const [farmName, setFarmName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showFarmList, setShowFarmList] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const mapRef = useRef(null);
  const fabScale = useRef(new Animated.Value(1)).current;
  const { userId } = useContext(AuthContext);

  // Fetch saved farms from API (assumed to now return farms in the new format)
  useEffect(() => {
    async function fetchFarms() {
      try {
        const response = await fetch(
          `http://10.0.2.2:8080/api/farms/user/${userId}`
        );
        const data = await response.json();
        setFarms(data);
        if (data.length > 0 && !selectedFarm) {
          setSelectedFarm(data[0]);
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    }
    fetchFarms();
  }, []);

  // Set default selected farm and center map using the new format
  useEffect(() => {
    if (farms.length > 0 && !selectedFarm) {
      const defaultFarm = farms[0];
      setSelectedFarm(defaultFarm);
      setRegion({
        latitude: defaultFarm.latitude,
        longitude: defaultFarm.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [farms, selectedFarm]);

  const handleAddMachinery = async (farmId, machineryDetails) => {
    setIsSaving(true);
    try {
      if (!route?.params?.machineryTitle) {
        throw new Error("Machinery title is missing in route parameters");
      }
      if (!userId) {
        throw new Error("User ID is not defined");
      }
      const response = await fetch(`http://10.0.2.2:8080/api/machinery/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: route.params.machineryTitle.toUpperCase(),
          farmId,
          ownerId: userId,
          ...machineryDetails,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error adding machinery: ${response.status} - ${errorText}`
        );
      }
      const data = await response.json();
      navigation.navigate("ManageMachinery", { machinery: data });
    } catch (error) {
      console.error("Error adding machinery:", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Request location permissions
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
  const handleSelectFarm = (farm) => {
    setSelectedFarm(farm);
    setShowFarmList(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    mapRef.current?.animateToRegion(
      {
        latitude: farm.latitude,
        longitude: farm.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const handleAddFarm = async (farm) => {
    console.log(farm);
    const response = await fetch(`http://10.0.2.2:8080/api/farms/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerId: userId,
        description: farm.description,
        latitude: farm.latitude,
        longitude: farm.longitude,
      }),
    });
    if (!response.ok) {
      throw new Error("Error adding farm:", response.status);
    }
    const id = await response.json();
    const newFarm = { ...farm, id: id };
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
    if (farmName.trim() && tempLocation) {
      setIsSaving(true);
      try {
        // New farm using the new format: id, description, latitude, and longitude.
        const newFarm = {
          description: farmName.trim(),
          latitude: tempLocation.latitude,
          longitude: tempLocation.longitude,
        };
        const savedFarm = await handleAddFarm(newFarm);
        handleSelectFarm(savedFarm);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

  const animateFab = () => {
    Animated.spring(fabScale, {
      toValue: 1.1,
      friction: 5,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(fabScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    });
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
              key={farm.id}
              coordinate={{
                latitude: farm.latitude,
                longitude: farm.longitude,
              }}
              title={farm.description}
              onPress={() => handleSelectFarm(farm)}
              pinColor={
                selectedFarm?.id === farm.id ? COLORS.PRIMARY : COLORS.ACCENT
              }
            />
          ))}
          {tempLocation && (
            <Marker
              coordinate={tempLocation}
              title="New Farm"
              pinColor={COLORS.ACCENT}
            />
          )}
        </MapView>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={18}
          color={COLORS.TEXT}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Top Controls - Show only selected farm */}
      {selectedFarm && (
        <View style={styles.topControlsContainer}>
          <View style={styles.selectedFarmContainer}>
            <Icon
              name="check-circle"
              size={20}
              color={COLORS.PRIMARY}
              style={styles.checkIcon}
            />
            <Text style={styles.selectedFarmText}>
              {selectedFarm.description}
            </Text>
          </View>
        </View>
      )}

      {/* Floating Action Buttons */}
      <View style={styles.controlsContainer}>
        <Animated.View style={{ transform: [{ scale: fabScale }] }}>
          <FAB
            style={[styles.fab, { backgroundColor: COLORS.SECONDARY }]}
            icon={addingFarm ? "close" : "plus"}
            label={addingFarm ? "Cancel" : "Add Farm"}
            onPress={() => {
              animateFab();
              addingFarm ? handleCancelAdd() : setAddingFarm(true);
            }}
          />
        </Animated.View>
        <FAB
          style={[styles.fab, { backgroundColor: COLORS.SECONDARY }]}
          icon="format-list-bulleted"
          label="Farms"
          onPress={() => setShowFarmList(true)}
        />
        {selectedFarm && (
          <FAB
            style={[styles.fab, { backgroundColor: COLORS.PRIMARY }]}
            icon="plus"
            label="Add Machinery"
            onPress={() => {
              const machineryDetails = route.params.machineryDetails;
              console.log(machineryDetails);
              handleAddMachinery(selectedFarm.id, machineryDetails);
              navigation.navigate("ManageMachinery", { farm: selectedFarm });
            }}
          />
        )}
      </View>
      {/* Bottom Sheet for Farm List */}
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
                onPress={() => handleSelectFarm(farm)}
              >
                <Text style={styles.farmName}>{farm.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>

      {/* Modal for Adding Farm */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Farm Location</Text>
              <TouchableOpacity onPress={handleCancelAdd}>
                <Icon name="close" size={24} color={COLORS.TEXT} />
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
              color={COLORS.PRIMARY}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 25,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: { marginHorizontal: 10 },
  searchInput: { flex: 1, height: 40, fontSize: 16, color: COLORS.TEXT },
  topControlsContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(242, 242, 247, 0.95)",
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedFarmContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: { marginRight: 5 },
  selectedFarmText: { fontSize: 16, fontWeight: "600", color: COLORS.TEXT },
  controlsContainer: { position: "absolute", bottom: 30, right: 20, gap: 10 },
  fab: { borderRadius: 30, paddingHorizontal: 10 },
  bottomSheet: {
    backgroundColor: COLORS.SECONDARY,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 300,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT,
    marginBottom: 10,
  },
  farmItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 5,
    elevation: 1,
  },
  farmName: { fontSize: 16, color: COLORS.TEXT },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "600", color: COLORS.TEXT },
  label: { fontSize: 16, color: COLORS.TEXT, marginBottom: 5 },
  input: {
    height: 50,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: { marginTop: 10, borderRadius: 10 },
});

export default SelectFarmForMachinery;
