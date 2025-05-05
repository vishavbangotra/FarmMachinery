import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FAB, Button as PaperButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { BottomSheet } from "react-native-btr";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import { COLORS, SIZES, FONTS } from "../../constants/styles";

const API_BASE_URL = "http://10.0.2.2:8080";
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const FarmSelectScreen = ({ route, navigation }) => {
  const [farms, setFarms] = useState([]);
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const fabScale = useRef(new Animated.Value(1)).current;

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

  const fetchFarms = async () => {
    const response = await fetch(`${API_BASE_URL}/api/farms/user/1`);
    const data = await response.json();
    setFarms(data);
  };

  useEffect(() => {
    fetchFarms();
  }, []);

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
    try {
      const authToken = await SecureStore.getItemAsync("jwt");
      if (!authToken) throw new Error("No authentication token found");
      const response = await fetch(`${API_BASE_URL}/api/farms/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(farm),
      });
      if (!response.ok)
        throw new Error(`Error adding farm: ${response.status}`);
      const newFarmId = await response.json();
      const newFarm = { ...farm, id: newFarmId };
      setFarms((prevFarms) => [...prevFarms, newFarm]);
      return newFarm;
    } catch (error) {
      console.error("Error in handleAddFarm:", error);
      throw error;
    }
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
        const newFarm = {
          description: farmName,
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

  const deleteFarmRequest = async () => {
    try {
      const authToken = await SecureStore.getItemAsync("jwt");
      if (!authToken) throw new Error("No authentication token found");
      const response = await fetch(
        `${API_BASE_URL}/api/farms/delete/${farmToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok)
        throw new Error(`Error deleting farm: ${response.status}`);
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  const handleDeleteFarm = (farmId) => {
    setFarmToDelete(farmId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteFarm = async () => {
    if (farmToDelete) {
      try {
        await deleteFarmRequest();
        setFarms(farms.filter((farm) => farm.id !== farmToDelete));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowDeleteConfirm(false);
        setFarmToDelete(null);
        if (selectedFarm?.id === farmToDelete) setSelectedFarm(null);
      } catch (error) {
        console.error("Error deleting farm:", error);
      }
    }
  };

  const animateFab = () => {
    Animated.spring(fabScale, {
      toValue: 1.1,
      friction: 5,
      useNativeDriver: true,
    }).start(() =>
      Animated.spring(fabScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start()
    );
  };

  const handleSearchMachinery = () => {
    navigation.navigate("MachinerySearch", {
      farm: selectedFarm,
      machinery: route.params.machinery,
      startDate: route.params.startDate,
      endDate: route.params.endDate,
      distance,
    });
  };

  const handleAddMachinery = async () => {
    setIsSaving(true);
    try {
      const authToken = await SecureStore.getItemAsync("jwt");
      if (!authToken) throw new Error("No authentication token found");
      const type = route.params.machineryTitle.toUpperCase();
      const farmId = selectedFarm.id;
      const details = route.params.machineryDetails;
      const imageUris = route.params.images || [];
      const formData = new FormData();
      formData.append("type", type);
      formData.append("farmId", String(farmId));
      Object.entries(details).forEach(([key, value]) => {
        formData.append(key, value == null ? "" : String(value));
      });
      imageUris.forEach((uri, idx) => {
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const mimeType = match ? `image/${match[1]}` : "image";
        formData.append("files", {
          uri,
          name: filename,
          type: mimeType,
        });
      });
      const res = await fetch(`${API_BASE_URL}/api/machinery/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Error adding machinery: ${res.status} – ${errText}`);
      }
      navigation.navigate("ManageMachinery");
    } catch (e) {
      console.error("Error adding machinery:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchLocationSuggestions = async (query) => {
    console.log(GOOGLE_PLACES_API_KEY)
    if (query.length > 0) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_PLACES_API_KEY}`
        );
        if (response.data.predictions) {
          setSuggestions(response.data.predictions);
        }
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    fetchLocationSuggestions(query);
  };

  const handleSelectSuggestion = async (placeId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const { lat, lng } = response.data.result.geometry.location;
      const newRegion = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      setSuggestions([]);
      setSearchQuery(response.data.result.name);
    } catch (error) {
      console.error("Error selecting location:", error);
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
          customMapStyle={mapStyle}
        >
          {farms.map((farm) => (
            <Marker
              key={`${farm.id}-${
                selectedFarm?.id === farm.id ? "selected" : "default"
              }`}
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

      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={18}
          color={COLORS.TEXT}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations..."
          placeholderTextColor={COLORS.TEXT_DARK}
          value={searchQuery}
          onChangeText={handleSearchQueryChange}
        />
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(item.place_id)}
              >
                <Text style={styles.suggestionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

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
            label={
              navigation.getState().routes[
                navigation.getState().routes.length - 2
              ].name === "AddMachinery"
                ? "Add"
                : "Search"
            }
            onPress={() =>
              navigation.getState().routes[
                navigation.getState().routes.length - 2
              ].name === "AddMachinery"
                ? handleAddMachinery()
                : handleSearchMachinery()
            }
          />
        )}
      </View>

      <BottomSheet
        visible={showFarmList}
        onBackButtonPress={() => setShowFarmList(false)}
        onBackdropPress={() => setShowFarmList(false)}
      >
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Select a Farm</Text>
          {farms.map((farm) => (
            <View
              key={farm.id}
              style={[
                styles.farmItem,
                {
                  backgroundColor:
                    selectedFarm?.id === farm.id ? COLORS.PRIMARY : "#fff",
                },
              ]}
            >
              <TouchableOpacity
                style={styles.farmNameContainer}
                onPress={() => handleSelectFarm(farm)}
              >
                <Text style={styles.farmName}>{farm.description}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteFarm(farm.id)}
                style={styles.deleteButton}
              >
                <Icon name="trash" size={20} color={COLORS.ACCENT} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </BottomSheet>

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

      <Modal visible={showDeleteConfirm} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Farm</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this farm?
            </Text>
            <View style={styles.modalButtons}>
              <PaperButton
                mode="outlined"
                onPress={() => setShowDeleteConfirm(false)}
                style={styles.modalButton}
              >
                Cancel
              </PaperButton>
              <PaperButton
                mode="contained"
                color={COLORS.ACCENT}
                onPress={confirmDeleteFarm}
                style={styles.modalButton}
              >
                Delete
              </PaperButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    backgroundColor: '#fff',
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
  suggestionsContainer: {
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 10,
    elevation: 5,
    maxHeight: 200,
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.PRIMARY,
  },
  suggestionText: {
    fontSize: 16,
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
  },
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
  fab: {
    borderRadius: 30,
    paddingHorizontal: 10,
    width: 150,
    marginVertical: 5,
  },
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    elevation: 1,
  },
  farmNameContainer: { flex: 1 },
  farmName: { fontSize: 16, color: COLORS.TEXT_DARK },
  deleteButton: { padding: 10 },
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
  modalText: {
    fontSize: 16,
    color: COLORS.TEXT,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: { flex: 1, marginHorizontal: 5, borderRadius: 10 },
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

export default FarmSelectScreen;
