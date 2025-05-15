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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import BottomSheet from "@gorhom/bottom-sheet";
import MapView from "react-native-maps";
import { COLORS, SIZES, FONTS } from "../../constants/styles";

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

export default function MachineryScreen({ navigation }) {
  const [selectedOperation, setSelectedOperation] = useState(OPERATIONS[0].id);
  const [selectedId, setSelectedId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const bottomSheetRef = useRef(null);

  const currentMachines = MACHINES.filter((m) =>
    OPERATIONS.find((op) => op.id === selectedOperation).machines.includes(m.id)
  );

  const onSelectMachine = (id) => {
    Haptics.selectionAsync();
    setSelectedId(id);
  };

  const onChangeStart = (_, date) => {
    setShowStart(false);
    if (date) {
      setStartDate(date);
      validateDates(date, endDate);
    }
  };

  const onChangeEnd = (_, date) => {
    setShowEnd(false);
    if (date) {
      setEndDate(date);
      validateDates(startDate, date);
    }
  };

  const validateDates = (start, end) => {
    if (start && end && end <= start) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    setStartDate(yesterday);
    setEndDate(today);
  }, []);

  const validRange = startDate && endDate && endDate > startDate;
  const canProceed = selectedId && validRange;

  const format = (d) => d.toLocaleDateString();

  const renderMachineItem = ({ item }) => {
    const selected = item.id === selectedId;
    return (
      <Pressable
        style={[styles.machineCard, selected && styles.machineCardSelected]}
        onPress={() => onSelectMachine(item.id)}
        android_ripple={{ color: COLORS.PRIMARY + "33" }}
        accessibilityRole="button"
        accessibilityLabel={item.label}
      >
        <View
          style={[
            styles.machineIconContainer,
            selected && styles.machineIconSelected,
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={28}
            color={selected ? COLORS.BACKGROUND : COLORS.TEXT_LIGHT}
          />
        </View>
        <Text
          style={[styles.machineLabel, selected && styles.machineLabelSelected]}
        >
          {item.label}
        </Text>
        <Text style={styles.machineDescription}>{item.description}</Text>
      </Pressable>
    );
  };

  const handleBottomSheetChange = (index) => {
    if (index >= 0 && index < snapPoints.length) {
      setBottomSheetIndex(index);
    }
  };

  const renderOperationItem = ({ item }) => {
    const selected = item.id === selectedOperation;
    return (
      <Pressable
        style={[styles.operationButton, selected && styles.operationSelected]}
        onPress={() => {
          setSelectedOperation(item.id);
          setSelectedId(null);
          Haptics.selectionAsync();
        }}
        accessibilityLabel={item.label}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={24}
          color={selected ? COLORS.TEXT_DARK : COLORS.TEXT_LIGHT}
          style={styles.operationIcon}
        />
        <Text
          style={[
            styles.operationText,
            selected && styles.operationTextSelected,
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Machinery Selection</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Date Range</Text>
          <View style={styles.dateContainer}>
            <Pressable
              style={[styles.dateInput, dateError && styles.dateInputError]}
              onPress={() => setShowStart(true)}
            >
              <MaterialCommunityIcons
                name="calendar-start"
                size={22}
                color={COLORS.SECONDARY}
              />
              <Text style={styles.dateText}>
                {startDate ? format(startDate) : "Select start date"}
              </Text>
            </Pressable>

            <MaterialCommunityIcons
              name="arrow-right"
              size={24}
              color={COLORS.SECONDARY}
              style={styles.dateArrow}
            />

            <Pressable
              style={[styles.dateInput, dateError && styles.dateInputError]}
              onPress={() => setShowEnd(true)}
            >
              <MaterialCommunityIcons
                name="calendar-end"
                size={22}
                color={COLORS.SECONDARY}
              />
              <Text style={styles.dateText}>
                {endDate ? format(endDate) : "Select end date"}
              </Text>
            </Pressable>
          </View>

          {dateError && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={18}
                color={COLORS.ERROR}
              />
              <Text style={styles.errorText}>
                End date must be after start date
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Operation Type</Text>
          <FlatList
            data={OPERATIONS}
            keyExtractor={(item) => item.id}
            renderItem={renderOperationItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.operationsList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Available Machinery</Text>
          <Text style={styles.sectionSubtext}>
            Select the machinery you need for{" "}
            {OPERATIONS.find(
              (op) => op.id === selectedOperation
            ).label.toLowerCase()}
          </Text>

          {currentMachines.length > 0 ? (
            <View style={styles.machinesGrid}>
              {currentMachines.map((item) => renderMachineItem({ item }))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="tractor-variant"
                size={40}
                color={COLORS.SECONDARY}
              />
              <Text style={styles.emptyStateText}>
                No machinery available for this operation
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, !canProceed && styles.buttonDisabled]}
          onPress={() => {
            if (canProceed) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              setBottomSheetIndex(1);
            } else {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
            }
          }}
          disabled={!canProceed}
          accessibilityLabel="Open farm selection map"
        >
          <Text style={styles.buttonText}>Select Farm</Text>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color={COLORS.TEXT_LIGHT}
          />
        </Pressable>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetIndex}
        snapPoints={["50%", "90%"]}
        onChange={handleBottomSheetChange}
        enablePanDownToClose={true}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Select Your Farm</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
          <Pressable
            style={styles.confirmButton}
            onPress={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              bottomSheetRef.current?.close();
            }}
          >
            <Text style={styles.confirmButtonText}>Confirm Selection</Text>
          </Pressable>
        </View>
      </BottomSheet>

      {showStart && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="spinner"
          onChange={onChangeStart}
          maximumDate={new Date()}
        />
      )}
      {showEnd && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="spinner"
          onChange={onChangeEnd}
          minimumDate={startDate || undefined}
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
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: SIZES.PADDING,
    paddingBottom: SIZES.PADDING_SM,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT_LIGHT,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: SIZES.PADDING,
  },
  section: {
    marginBottom: SIZES.MARGIN_LARGE,
  },
  sectionHeader: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_MEDIUM,
  },
  sectionSubtext: {
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_DARK,
    marginBottom: SIZES.MARGIN_MEDIUM,
    opacity: 0.8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateInputError: {
    borderColor: COLORS.ERROR,
    borderWidth: 1.5,
  },
  dateArrow: {
    marginHorizontal: 10,
  },
  dateText: {
    marginLeft: SIZES.SPACING + 2,
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.TEXT_DARK,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SIZES.MARGIN_MEDIUM,
    paddingHorizontal: SIZES.PADDING_SM,
  },
  errorText: {
    marginLeft: 5,
    color: COLORS.ERROR,
    fontSize: 14,
    fontFamily: FONTS.MEDIUM,
  },
  operationsList: {
    paddingVertical: SIZES.PADDING_SM,
  },
  operationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 30,
    paddingVertical: SIZES.PADDING_SM,
    paddingHorizontal: SIZES.PADDING,
    marginRight: SIZES.MARGIN_MEDIUM,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  operationSelected: {
    backgroundColor: COLORS.ACCENT,
  },
  operationIcon: {
    marginRight: 8,
  },
  operationText: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.TEXT_LIGHT,
  },
  operationTextSelected: {
    color: COLORS.TEXT_DARK,
    fontFamily: FONTS.BOLD,
  },
  machinesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: SIZES.MARGIN_MEDIUM,
  },
  machineCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
    marginBottom: SIZES.MARGIN_MEDIUM,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "transparent",
  },
  machineCardSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: "#f9fff0",
  },
  machineIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.SECONDARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.MARGIN_MEDIUM,
  },
  machineIconSelected: {
    backgroundColor: COLORS.PRIMARY,
  },
  machineLabel: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT_DARK,
    marginBottom: 4,
  },
  machineLabelSelected: {
    color: COLORS.PRIMARY,
  },
  machineDescription: {
    fontSize: 12,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_DARK,
    textAlign: "center",
    opacity: 0.7,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.PADDING_SM * 2,
    backgroundColor: "#fff",
    borderRadius: SIZES.BORDER_RADIUS,
    marginTop: SIZES.MARGIN_MEDIUM,
  },
  emptyStateText: {
    marginTop: SIZES.MARGIN_MEDIUM,
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.TEXT_DARK,
    textAlign: "center",
  },
  footer: {
    padding: SIZES.PADDING,
    backgroundColor: COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.TERTIARY}20`,
  },
  button: {
    flexDirection: "row",
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT_LIGHT,
    marginRight: 8,
  },
  buttonDisabled: {
    backgroundColor: COLORS.TEXT_DARK,
    opacity: 0.4,
  },
  bottomSheetContent: {
    flex: 1,
    padding: SIZES.PADDING,
    backgroundColor: COLORS.BACKGROUND,
  },
  bottomSheetTitle: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_MEDIUM,
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: 300,
    marginBottom: SIZES.MARGIN_MEDIUM,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  confirmButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT_LIGHT,
  },
});
