import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ScrollView,
  StatusBar,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  MaterialCommunityIcons,
  FontAwesome as Icon,
} from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import Slider from "@react-native-community/slider";
import axios from "axios";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { COLORS, SIZES, FONTS } from "../../constants/styles";
import { farmService } from "../../services/farmService";

const MACHINES = [
  {
    id: "tractor",
    label: "Tractor",
    icon: "tractor",
    description: "For field preparation and towing",
  },
  {
    id: "rotavator",
    label: "Rotavator",
    icon: "hammer",
    description: "For soil cultivation",
  },
  {
    id: "harvester",
    label: "Harvester",
    icon: "crop-harvest",
    description: "For crop collection",
  },
  {
    id: "landleveller",
    label: "Land Leveller",
    icon: "land-plots",
    description: "For field leveling",
  },
  {
    id: "seeddrill",
    label: "Seed Drill",
    icon: "seed",
    description: "For precise seed placement",
  },
];

const OPERATIONS = [
  {
    id: "soil_preparation",
    label: "Soil Preparation",
    machines: ["tractor", "rotavator", "landleveller"],
    icon: "shovel",
  },
  {
    id: "planting",
    label: "Planting",
    machines: ["seeddrill"],
    icon: "seed-outline",
  },
  {
    id: "harvesting",
    label: "Harvesting",
    machines: ["harvester"],
    icon: "corn",
  },
];

const API_BASE_URL = "http://10.0.2.2:8080";
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export default function MachineryScreen({ navigation }) {
  // State variables
  const [selectedOperation, setSelectedOperation] = useState(OPERATIONS[0].id);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [dateError, setDateError] = useState(false);
  const [distance, setDistance] = useState(25);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [isAddingFarm, setIsAddingFarm] = useState(false);
  const [farmTitle, setFarmTitle] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    loadFarms();
    requestLocationPermission();
  }, []);

  const loadFarms = async () => {
    try {
      const farms = await farmService.getUserFarms();
      setFarms(farms);
      if (farms.length > 0) setSelectedFarm(farms[0]);
    } catch (error) {
      Alert.alert("Error", "Failed to load farms");
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Location access required",
        "Please enable location services"
      );
    }
  };

  const handleSearchLocation = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_PLACES_API_KEY}`
      );
      setLocationSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Location search failed:", error);
    }
  };

  const handleLocationSelect = async (placeId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const { lat, lng } = response.data.result.geometry.location;
      setSelectedLocation({ latitude: lat, longitude: lng });
      mapRef.current?.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location details");
    }
  };

  const handleSaveFarm = async () => {
    if (!farmTitle || !selectedLocation) {
      Alert.alert("Error", "Please provide farm title and location");
      return;
    }

    try {
      setIsSaving(true);
      const newFarm = {
        title: farmTitle,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      };

      const savedFarm = await farmService.addFarm(newFarm);
      setFarms([...farms, savedFarm]);
      setSelectedFarm(savedFarm);
      resetFarmForm();
    } catch (error) {
      Alert.alert("Error", "Failed to save farm");
    } finally {
      setIsSaving(false);
    }
  };

  const resetFarmForm = () => {
    setFarmTitle("");
    setLocationSearch("");
    setSelectedLocation(null);
    setIsAddingFarm(false);
    setShowFarmModal(false);
  };

  const handleSearch = () => {
    if (!selectedFarm || !selectedMachine) {
      Alert.alert("Error", "Please select farm and machinery");
      return;
    }

    navigation.navigate("MachinerySearch", {
      farm: selectedFarm,
      machine: selectedMachine,
      startDate,
      endDate,
      distance,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Date Range</Text>
          <View style={styles.dateContainer}>
            <Pressable
              style={styles.dateInput}
              onPress={() => setShowDatePicker("start")}
            >
              <MaterialCommunityIcons
                name="calendar-start"
                size={20}
                color={COLORS.PRIMARY}
              />
              <Text style={styles.dateText}>
                {startDate.toLocaleDateString()}
              </Text>
            </Pressable>

            <Text style={styles.dateSeparator}>–</Text>

            <Pressable
              style={styles.dateInput}
              onPress={() => setShowDatePicker("end")}
            >
              <MaterialCommunityIcons
                name="calendar-end"
                size={20}
                color={COLORS.PRIMARY}
              />
              <Text style={styles.dateText}>
                {endDate.toLocaleDateString()}
              </Text>
            </Pressable>
          </View>
          {dateError && (
            <Text style={styles.errorText}>End date must be after start</Text>
          )}
        </View>

        {/* Search Radius */}
        <View style={styles.section}>
          <View style={styles.distanceHeader}>
            <Text style={styles.sectionHeader}>Search Radius</Text>
            <Text style={styles.distanceValue}>{distance} km</Text>
          </View>
          <Slider
            minimumValue={5}
            maximumValue={100}
            step={5}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor={COLORS.PRIMARY}
            maximumTrackTintColor={COLORS.SECONDARY}
            thumbTintColor={COLORS.PRIMARY}
          />
        </View>

        {/* Operation Type */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Operation Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {OPERATIONS.map((op) => (
              <Pressable
                key={op.id}
                style={[
                  styles.operationButton,
                  selectedOperation === op.id && styles.selectedOperation,
                ]}
                onPress={() => setSelectedOperation(op.id)}
              >
                <MaterialCommunityIcons
                  name={op.icon}
                  size={24}
                  color={
                    selectedOperation === op.id ? COLORS.PRIMARY : COLORS.TEXT
                  }
                />
                <Text
                  style={[
                    styles.operationText,
                    selectedOperation === op.id && styles.selectedOperationText,
                  ]}
                >
                  {op.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Machinery Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Available Machinery</Text>
          <FlatList
            data={MACHINES.filter((m) =>
              OPERATIONS.find(
                (o) => o.id === selectedOperation
              )?.machines.includes(m.id)
            )}
            numColumns={2}
            columnWrapperStyle={styles.machineryGrid}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.machineCard,
                  selectedMachine?.id === item.id && styles.selectedMachineCard,
                ]}
                onPress={() => setSelectedMachine(item)}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={32}
                  color={
                    selectedMachine?.id === item.id
                      ? COLORS.PRIMARY
                      : COLORS.TEXT
                  }
                />
                <Text style={styles.machineLabel}>{item.label}</Text>
                <Text style={styles.machineDescription}>
                  {item.description}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={40}
                  color={COLORS.SECONDARY}
                />
                <Text style={styles.emptyStateText}>
                  No machinery available
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <Pressable style={styles.fab} onPress={() => setShowFarmModal(true)}>
          <MaterialCommunityIcons name="farm" size={24} color="white" />
        </Pressable>
        <Pressable
          style={[styles.fab, styles.searchFab]}
          onPress={handleSearch}
        >
          <MaterialCommunityIcons name="magnify" size={24} color="white" />
        </Pressable>
      </View>

      {/* Farm Selection Modal */}
      <Modal
        visible={showFarmModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFarmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isAddingFarm ? "Add New Farm" : "Your Farms"}
              </Text>
              <TouchableOpacity onPress={() => setShowFarmModal(false)}>
                <Icon name="close" size={24} color={COLORS.TEXT} />
              </TouchableOpacity>
            </View>

            {isAddingFarm ? (
              <View style={styles.addFarmContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Farm Title"
                  value={farmTitle}
                  onChangeText={setFarmTitle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Search Location"
                  value={locationSearch}
                  onChangeText={(text) => {
                    setLocationSearch(text);
                    handleSearchLocation(text);
                  }}
                />

                {locationSuggestions.length > 0 && (
                  <FlatList
                    data={locationSuggestions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => {
                          handleLocationSelect(item.place_id);
                          setLocationSearch(item.description);
                          setLocationSuggestions([]);
                        }}
                      >
                        <Text style={styles.suggestionText}>
                          {item.description}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                )}

                <MapView
                  ref={mapRef}
                  style={styles.map}
                  initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  {selectedLocation && <Marker coordinate={selectedLocation} />}
                </MapView>

                <Pressable
                  style={styles.saveButton}
                  onPress={handleSaveFarm}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Farm</Text>
                  )}
                </Pressable>
              </View>
            ) : (
              <>
                <FlatList
                  data={farms}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.farmItem,
                        selectedFarm?.id === item.id && styles.selectedFarmItem,
                      ]}
                      onPress={() => setSelectedFarm(item)}
                    >
                      <Text style={styles.farmTitle}>{item.title}</Text>
                      <Text style={styles.farmLocation}>
                        {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                      </Text>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() =>
                          farmService.deleteFarm(item.id).then(loadFarms)
                        }
                      >
                        <Icon name="trash-o" size={20} color={COLORS.ERROR} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No farms added yet</Text>
                  }
                />
                <Pressable
                  style={styles.addButton}
                  onPress={() => setIsAddingFarm(true)}
                >
                  <Text style={styles.addButtonText}>Add New Farm</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={showDatePicker === "start" ? startDate : endDate}
          mode="date"
          display="spinner"
          onChange={(_, date) => {
            setShowDatePicker(null);
            if (date) {
              if (showDatePicker === "start") {
                setStartDate(date);
                if (date > endDate) setDateError(true);
              } else {
                setEndDate(date);
                if (date < startDate) setDateError(true);
                else setDateError(false);
              }
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: SIZES.PADDING,
  },
  section: {
    marginBottom: SIZES.MARGIN_LARGE,
  },
  sectionHeader: {
    ...FONTS.BOLD,
    fontSize: 18,
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_MEDIUM,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.SECONDARY_LIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.PADDING_SM,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS,
    flex: 1,
    marginHorizontal: SIZES.MARGIN_SMALL,
  },
  dateSeparator: {
    ...FONTS.MEDIUM,
    color: COLORS.TEXT,
  },
  distanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.MARGIN_SMALL,
  },
  distanceValue: {
    ...FONTS.MEDIUM,
    color: COLORS.PRIMARY,
  },
  operationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SECONDARY_LIGHT,
    borderRadius: 30,
    paddingVertical: SIZES.PADDING_SM,
    paddingHorizontal: SIZES.PADDING,
    marginRight: SIZES.MARGIN_SMALL,
  },
  selectedOperation: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
  machineryGrid: {
    justifyContent: "space-between",
  },
  machineCard: {
    width: "48%",
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
    marginBottom: SIZES.MARGIN_SMALL,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
  },
  selectedMachineCard: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  fabContainer: {
    position: "absolute",
    bottom: SIZES.PADDING,
    right: SIZES.PADDING,
    gap: SIZES.MARGIN_SMALL,
  },
  fab: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 30,
    padding: SIZES.PADDING_SM,
    elevation: 3,
  },
  searchFab: {
    backgroundColor: COLORS.SECONDARY,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: SIZES.BORDER_RADIUS * 2,
    borderTopRightRadius: SIZES.BORDER_RADIUS * 2,
    padding: SIZES.PADDING,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.MARGIN_LARGE,
  },
  modalTitle: {
    ...FONTS.BOLD,
    fontSize: 20,
    color: COLORS.TERTIARY,
  },
  addFarmContainer: {
    gap: SIZES.MARGIN_SMALL,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
    ...FONTS.REGULAR,
  },
  suggestionItem: {
    padding: SIZES.PADDING_SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SECONDARY,
  },
  suggestionText: {
    ...FONTS.REGULAR,
    color: COLORS.TEXT,
  },
  map: {
    height: 200,
    borderRadius: SIZES.BORDER_RADIUS,
    marginVertical: SIZES.MARGIN_SMALL,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
    alignItems: "center",
  },
  saveButtonText: {
    ...FONTS.BOLD,
    color: COLORS.BACKGROUND,
  },
  farmItem: {
    backgroundColor: COLORS.SECONDARY_LIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
    marginBottom: SIZES.MARGIN_SMALL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedFarmItem: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
  farmTitle: {
    ...FONTS.MEDIUM,
    color: COLORS.TERTIARY,
  },
  farmLocation: {
    ...FONTS.REGULAR,
    color: COLORS.TEXT,
    fontSize: 12,
  },
  deleteButton: {
    marginLeft: "auto",
    padding: SIZES.PADDING_SM,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
    alignItems: "center",
    marginTop: SIZES.MARGIN_SMALL,
  },
  addButtonText: {
    ...FONTS.BOLD,
    color: COLORS.BACKGROUND,
  },
  emptyState: {
    alignItems: "center",
    padding: SIZES.PADDING,
    backgroundColor: COLORS.SECONDARY_LIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  errorText: {
    ...FONTS.MEDIUM,
    color: COLORS.ERROR,
    marginTop: SIZES.MARGIN_SMALL,
  },
});