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
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics"; // For haptic feedback

// App constants
const COLORS = {
  PRIMARY: "#34C759", // Softer green for elegance
  SECONDARY: "#F2F2F7", // Light gray for backgrounds
  ACCENT: "#5856D6", // Vibrant purple for highlights
  TEXT: "#1C2526", // Darker text for contrast
  BORDER: "#E5E5EA", // Subtle border color
};

const MapScreen = ({ route, navigation }) => {
  const savedFarms = [
    {
      id: "1",
      name: "Farm Jammu Auto",
      location: { latitude: 32.7300307600586, longitude: 74.85615100711584 },
    },
    {
      id: "1742126686607",
      name: "Farm Jammu 2",
      location: { latitude: 32.72915219022547, longitude: 74.85791858285666 },
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
  const [distance, setDistance] = useState(0);
  const mapRef = useRef(null);
  const fabScale = useRef(new Animated.Value(1)).current; // For FAB animations

  // Set default selected farm and center map
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
        latitude: farm.location.latitude,
        longitude: farm.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const handleAddFarm = async (farm) => {
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

  // FAB animation
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
          customMapStyle={mapStyle}
        >
          {farms.map((farm) => (
            <Marker
              key={`${farm.id}-${
                selectedFarm?.id === farm.id ? "selected" : "default"
              }`}
              coordinate={farm.location}
              title={farm.name}
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

      {/* Top Controls */}
      {selectedFarm && (
        <View style={styles.topControlsContainer}>
          <View style={styles.selectedFarmContainer}>
            <Icon
              name="check-circle"
              size={20}
              color={COLORS.PRIMARY}
              style={styles.checkIcon}
            />
            <Text style={styles.selectedFarmText}>{selectedFarm.name}</Text>
          </View>
          <Text style={styles.distanceHeader}>Search Radius</Text>
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
            icon="arrow-right"
            label="Search"
            onPress={() =>
              navigation.navigate("MachinerySearch", {
                farm: selectedFarm,
                distance,
              })
            }
          />
        )}
      </View>

      {/* Bottom Sheet */}
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
                <Text style={styles.farmName}>{farm.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>

      {/* Modal */}
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

// Custom Map Style (optional)
const mapStyle = [
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#F2F2F7" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#E5E5EA" }],
  },
];

// Styles
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
    marginBottom: 10,
  },
  checkIcon: { marginRight: 5 },
  selectedFarmText: { fontSize: 16, fontWeight: "600", color: COLORS.TEXT },
  distanceHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT,
    marginBottom: 5,
  },
  distanceText: { fontSize: 14, color: COLORS.TEXT, marginBottom: 5 },
  slider: { width: "100%", height: 40 },
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

export default MapScreen;
