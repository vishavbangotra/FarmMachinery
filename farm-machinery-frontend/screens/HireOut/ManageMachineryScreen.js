// screens/ManageMachineryScreen.js
import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { BottomSheet } from "react-native-btr";
import AuthContext from "../../context/AuthContext";
import { COLORS, SIZES, FONTS } from "../../constants/styles";
import * as SecureStore from "expo-secure-store";
const API_BASE_URL = "http://10.0.2.2:8080";

/**
 * ManageMachineryScreen component for displaying and managing machinery items.
 * Features include fetching machinery data, editing via modal, and refreshing the list.
 */
const ManageMachineryScreen = () => {
  const [machineries, setMachineries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [tempModalStatus, setTempModalStatus] = useState("");
  const [tempModalHourlyRate, setTempModalHourlyRate] = useState("");
  const [tempModalImage, setTempModalImage] = useState("");
  const [showFarmList, setShowFarmList] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch machinery data from the server
  const fetchMachineries = useCallback(async () => {
    try {
      setRefreshing(true);
      const authToken = await SecureStore.getItemAsync("jwt");
      if (!authToken) {
        setIsAuthenticated(false);
      }
      const response = await fetch(`${API_BASE_URL}/api/machinery`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        timeout: 10000, // Added timeout for better error handling
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMachineries(data);
    } catch (error) {
      Alert.alert("Error", `Failed to fetch machineries: ${error.message}`);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMachineries();
  }, [fetchMachineries]);

  // Status options for the segmented control
  const statusOptions = ["active", "inactive", "engaged"];
  const statusLabels = ["Active", "Inactive", "Engaged"];

  // Update a machinery item in the state
  const updateMachinery = (id, updates) => {
    setMachineries((prev) =>
      prev.map((machinery) =>
        machinery.id === id ? { ...machinery, ...updates } : machinery
      )
    );
  };

  const removeMachineryRequest = async (id) => {
    try {
      const authToken = await SecureStore.getItemAsync("jwt");
      const response = await fetch(`${API_BASE_URL}/api/machinery/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return true;
    } catch (error) {
      Alert.alert("Error", `Failed to remove machinery: ${error.message}`);
      return false;
    }
  };

  // Remove a machinery item with confirmation
  const removeMachinery = (id, title) => {
    Alert.alert(
      "Confirm Removal",
      `Are you sure you want to remove "${title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            if(removeMachineryRequest(id)){
              setMachineries((prev) => prev.filter((m) => m.id !== id));
              setModalVisible(false);
              Alert.alert("Success", "Machinery removed successfully");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Open the modal with temporary state
  const openModal = (item) => {
    setSelectedMachinery(item);
    setTempModalStatus(item.status);
    setTempModalHourlyRate(String(item.hourlyRate));
    setTempModalImage(item.image || null);
    setModalVisible(true);
  };

  // Handle image picking with permission check
  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera roll is required!"
      );
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!pickerResult.canceled) {
      setTempModalImage(pickerResult.assets[0].uri);
    }
  };

  // Remove the selected image
  const handleRemoveImage = () => {
    setTempModalImage(null);
  };

  // Save changes with validation
  const handleSave = () => {
    const hourlyRate = parseFloat(tempModalHourlyRate);
    if (isNaN(hourlyRate) || hourlyRate < 0) {
      Alert.alert("Invalid Input", "Hourly rate must be a positive number");
      return;
    }
    if (selectedMachinery) {
      updateMachinery(selectedMachinery.id, {
        status: tempModalStatus,
        hourlyRate,
        image: tempModalImage,
      });
      Alert.alert("Success", "Machinery updated successfully");
    }
    setModalVisible(false);
  };

  // Render each machinery item as a card
  const renderTile = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openModal(item)}
        activeOpacity={0.7} // Added for feedback
        accessible={true}
        accessibilityLabel={`Machinery: ${item.title}, Status: ${item.status}, Hourly Rate: ${item.hourlyRate}`}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardPlaceholder}>
            <Icon name="image" size={40} color={COLORS.SECONDARY} />
            <Text style={styles.cardPlaceholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDetail}>Status: {item.status}</Text>
          <Text style={styles.cardDetail}>Hourly Rate: {item.hourlyRate}</Text>
        </View>
      </TouchableOpacity>
    ),
    [openModal]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={machineries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTile}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchMachineries}
          />
        }
        initialNumToRender={10} // Added for performance
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="exclamation-circle"
              size={40}
              color={COLORS.SECONDARY}
            />
            <Text style={styles.emptyText}>No machinery items found.</Text>
          </View>
        }
      />

      {/* Modal for Editing Machinery */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMachinery && (
              <>
                <View style={styles.modalHeaderContainer}>
                  <Text style={styles.modalHeader}>
                    {selectedMachinery.title}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                    accessible={true}
                    accessibilityLabel="Close modal"
                  >
                    <Icon name="close" size={28} color={COLORS.SECONDARY} />
                  </TouchableOpacity>
                </View>

                <View style={styles.imageContainer}>
                  {tempModalImage ? (
                    <Image
                      source={{ uri: tempModalImage }}
                      style={styles.modalImage}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.imagePlaceholderText}>No Image</Text>
                    </View>
                  )}
                </View>
                <View style={styles.imageButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handlePickImage}
                  >
                    <Text style={styles.actionButtonText}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={handleRemoveImage}
                  >
                    <Text style={styles.actionButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <Text style={styles.modalLabel}>Status:</Text>
                  <SegmentedControl
                    values={statusLabels}
                    selectedIndex={statusOptions.indexOf(tempModalStatus)}
                    onChange={(event) =>
                      setTempModalStatus(
                        statusOptions[event.nativeEvent.selectedSegmentIndex]
                      )
                    }
                    style={styles.segmentedControl}
                    tintColor={COLORS.PRIMARY}
                    backgroundColor={COLORS.INPUT_BG}
                    activeTextColor={COLORS.WHITE}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalLabel}>Hourly Rate:</Text>
                  <TextInput
                    style={[
                      styles.input,
                      tempModalHourlyRate === "" && styles.inputError,
                    ]}
                    keyboardType="numeric"
                    value={tempModalHourlyRate}
                    onChangeText={setTempModalHourlyRate}
                    placeholder="e.g., 25.00"
                    placeholderTextColor={COLORS.SECONDARY}
                    accessibilityLabel="Hourly rate input"
                  />
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() =>
                      removeMachinery(
                        selectedMachinery.id,
                        selectedMachinery.title
                      )
                    }
                  >
                    <Text style={styles.actionButtonText}>Remove</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: COLORS.PRIMARY },
                    ]}
                    onPress={handleSave}
                  >
                    <Text style={styles.actionButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Bottom Sheet for Machinery List */}
      <BottomSheet
        visible={showFarmList}
        onBackButtonPress={() => setShowFarmList(false)}
        onBackdropPress={() => setShowFarmList(false)}
      >
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Select a Machinery</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search machinery..."
            placeholderTextColor={COLORS.SECONDARY}
          />
          <ScrollView>
            {machineries.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.bottomSheetItem}
                onPress={() => {
                  openModal(item);
                  setShowFarmList(false);
                }}
              >
                <Icon
                  name="tractor"
                  size={20}
                  color={COLORS.PRIMARY}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.bottomSheetItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND || "#f2f2f2",
    padding: SIZES.PADDING || 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardPlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: COLORS.INPUT_BG,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardPlaceholderText: {
    color: COLORS.SECONDARY,
    fontSize: 16,
    marginTop: 8,
  },
  cardContent: {
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: SIZES.SUBTITLE || 18,
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: SIZES.BODY || 14,
    color: COLORS.SECONDARY,
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.INPUT_BG,
  },
  modalHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalHeader: {
    fontSize: SIZES.TITLE || 22,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: COLORS.INPUT_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: COLORS.SECONDARY,
    fontSize: 16,
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: COLORS.ACCENT,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  removeButton: {
    backgroundColor: COLORS.ERROR || "darkred",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: FONTS.MEDIUM || "System",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    color: COLORS.SECONDARY,
    marginRight: 10,
  },
  segmentedControl: {
    flex: 1,
    height: 40,
  },
  input: {
    flex: 1,
    height: 44,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.INPUT_BG,
    fontFamily: FONTS.REGULAR,
  },
  inputError: {
    borderColor: COLORS.ERROR || "red",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 300,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.INPUT_BG,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  bottomSheetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  bottomSheetItemText: {
    fontSize: 16,
    color: COLORS.SECONDARY,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    color: COLORS.SECONDARY,
    fontSize: 16,
    marginTop: 8,
  },
});

export default ManageMachineryScreen;
