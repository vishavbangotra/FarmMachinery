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
  Alert,
  Animated,
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

// Components
import DateRangeSelector from '../../components/MachineryScreen/DateRangeSelector';
import SearchRadius from '../../components/MachineryScreen/SearchRadius';
import OperationSelector from '../../components/MachineryScreen/OperationSelector';
import MachineryGrid from '../../components/MachineryScreen/MachineryGrid';
import FloatingActionButtons from '../../components/MachineryScreen/FloatingActionButtons';
import FarmModal from '../../components/MachineryScreen/FarmModal';

// Constants
import { OPERATIONS, MACHINES } from '../../constants/machinery';

const API_BASE_URL = "http://10.0.2.2:8080";
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const MachineryScreen = ({ navigation }) => {
  // State variables
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateError, setDateError] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [distance, setDistance] = useState(50);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isFarmModalVisible, setIsFarmModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [farmTitle, setFarmTitle] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mapRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadFarms();
    requestLocationPermission();
  }, []);

  const loadFarms = async () => {
    try {
      setIsLoading(true);
      const farms = await farmService.getUserFarms();
      setFarms(farms);
      if (farms.length > 0) setSelectedFarm(farms[0]);
    } catch (error) {
      Alert.alert("Error", "Failed to load farms");
    } finally {
      setIsLoading(false);
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

  const handleLocationSelect = async (place) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const { lat, lng } = response.data.result.geometry.location;
      setSelectedLocation({ latitude: lat, longitude: lng });
      setLocationSearch(place.description);
      setLocationSuggestions([]);
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
    setIsFarmModalVisible(false);
  };

  const handleDateChange = (event, date) => {
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
  };

  const handleStartDatePress = () => {
    setShowDatePicker("start");
  };

  const handleEndDatePress = () => {
    setShowDatePicker("end");
  };

  const handleOperationSelect = (operation) => {
    setSelectedOperation(operation);
    setSelectedMachine(null);
  };

  const handleMachineSelect = (machine) => {
    setSelectedMachine(machine);
  };

  const handleFarmPress = () => {
    setIsFarmModalVisible(true);
  };

  const handleFilterPress = () => {
    setIsFilterModalVisible(true);
  };

  const handleFarmSelect = (farm) => {
    setSelectedFarm(farm);
    setIsFarmModalVisible(false);
  };

  const handleSearch = () => {
    if (!selectedFarm || !selectedMachine) {
      Alert.alert(
        "Missing Information",
        "Please select both a farm and machinery to proceed.",
        [
          {
            text: "OK",
            onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          }
        ]
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate("MachinerySearch", {
      farm: selectedFarm,
      machine: selectedMachine,
      startDate,
      endDate,
      distance,
    });
  };

  const renderHeader = () => (
    <Animated.View style={[
      styles.header,
      {
        transform: [{
          translateY: scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [0, -100],
            extrapolate: 'clamp'
          })
        }]
      }
    ]}>
      <Text style={styles.headerTitle}>Hire Machinery</Text>
      <Text style={styles.headerSubtitle}>Select your requirements</Text>
    </Animated.View>
  );

  const renderContent = () => (
    <View style={styles.content}>
      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        dateError={dateError}
        onStartDatePress={handleStartDatePress}
        onEndDatePress={handleEndDatePress}
      />
      <SearchRadius
        distance={distance}
        onDistanceChange={setDistance}
      />
      <OperationSelector
        operations={OPERATIONS}
        selectedOperation={selectedOperation}
        onOperationSelect={handleOperationSelect}
      />
      <MachineryGrid
        machines={MACHINES}
        selectedOperation={selectedOperation}
        selectedMachine={selectedMachine}
        onMachineSelect={handleMachineSelect}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading your farms...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />

      <Animated.FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={renderContent}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />

      <FloatingActionButtons
        onFarmPress={handleFarmPress}
        onFilterPress={handleFilterPress}
        onSearchPress={handleSearch}
      />

      <FarmModal
        visible={isFarmModalVisible}
        onClose={resetFarmForm}
        selectedFarm={selectedFarm}
        onFarmSelect={handleFarmSelect}
        farms={farms}
        farmTitle={farmTitle}
        locationSearch={locationSearch}
        locationSuggestions={locationSuggestions}
        selectedLocation={selectedLocation}
        isSaving={isSaving}
        onFarmTitleChange={setFarmTitle}
        onLocationSearchChange={(text) => {
          setLocationSearch(text);
          handleSearchLocation(text);
        }}
        onLocationSelect={handleLocationSelect}
        onSaveFarm={handleSaveFarm}
      />

      {showDatePicker && (
        <DateTimePicker
          value={showDatePicker === "start" ? startDate : endDate}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: SIZES.PADDING,
    paddingTop: SIZES.PADDING * 2,
    borderBottomLeftRadius: SIZES.BORDER_RADIUS * 2,
    borderBottomRightRadius: SIZES.BORDER_RADIUS * 2,
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerTitle: {
    ...FONTS.BOLD,
    fontSize: 24,
    color: COLORS.WHITE,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  headerSubtitle: {
    ...FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.WHITE,
    opacity: 0.8,
  },
  listContent: {
    padding: SIZES.PADDING,
  },
  content: {
    gap: SIZES.MARGIN_LARGE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    ...FONTS.MEDIUM,
    color: COLORS.TERTIARY,
    marginTop: SIZES.MARGIN_MEDIUM,
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

export default MachineryScreen;