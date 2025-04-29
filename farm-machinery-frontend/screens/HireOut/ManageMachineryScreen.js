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
  ScrollView, // Added for image list in modal
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome"; // Keep using FontAwesome
import { BottomSheet } from "react-native-btr";
// Removed unused AuthContext import
import { COLORS, SIZES, FONTS } from "../../constants/styles"; // Assuming these are correctly defined
import * as SecureStore from "expo-secure-store";
import { Picker } from '@react-native-picker/picker'; // Import
const API_BASE_URL = "http://10.0.2.2:8080"; // Or your actual API base URL

/**
 * ManageMachineryScreen component for displaying and managing machinery items.
 * Features include fetching machinery data, editing via modal (including multiple images),
 * and refreshing the list.
 */
const ManageMachineryScreen = () => {
  const [machineries, setMachineries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [tempModalStatus, setTempModalStatus] = useState("");
  const [tempModalRentPerDay, setTempModalRentPerDay] = useState(""); // Renamed from hourlyRate
  const [tempModalImageUrls, setTempModalImageUrls] = useState([]); // Changed to array for multiple images
  // Removed showFarmList state as BottomSheet usage seems minimal here, can be added back if needed
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Added state for save button loading indicator

  // Fetch machinery data from the server
  const fetchMachineries = useCallback(async () => {
    console.log("Fetching machineries...");
    setLoading(true); // Ensure loading is true at the start of fetch
    setRefreshing(true);
    try {
      const authToken = await SecureStore.getItemAsync("jwt");
      if (!authToken) {
        // Handle missing token scenario (e.g., navigate to login)
        Alert.alert(
          "Authentication Error",
          "No auth token found. Please log in."
        );
        setLoading(false);
        setRefreshing(false);
        // Optionally, navigate away or set an authenticated flag
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/machinery`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json", // Good practice to add
        },
        // timeout: 10000, // Timeout might cause issues, handle AbortController if needed
      });

      if (!response.ok) {
        const errorBody = await response.text(); // Get more error details
        console.error("Fetch Error:", response.status, errorBody);
        throw new Error(
          `Network response was not ok (Status: ${response.status})`
        );
      }

      const data = await response.json();
      // Ensure data is an array, default to empty array if not
      setMachineries(Array.isArray(data) ? data : []);
      console.log("Machineries fetched:", data.length);
    } catch (error) {
      console.error("Failed to fetch machineries:", error);
      Alert.alert("Error", `Failed to fetch machineries: ${error.message}`);
      setMachineries([]); // Clear data on error
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMachineries();
  }, [fetchMachineries]);

  // Status options for the segmented control - Updated based on new data
  const statusOptions = ["Available", "Unavailable", "Engaged"]; // Example statuses
  const statusLabels = ["Available", "Unavailable", "Engaged"]; // Corresponding labels

  // Update a machinery item in the local state
  const updateMachineryLocalState = (id, updates) => {
    setMachineries((prev) =>
      prev.map((machinery) =>
        machinery.id === id ? { ...machinery, ...updates } : machinery
      )
    );
  };

  // --- API Call for Updating Machinery ---
  const updateMachineryRequest = async (id, updates) => {
    setIsSaving(true); // Indicate saving process starts
    try {
      const authToken = await SecureStore.getItemAsync("jwt");
      if (!authToken) {
        throw new Error("Authentication token not found.");
      }

      // **IMPORTANT**: Adjust the endpoint and method (PUT/PATCH) as per your API design
      const response = await fetch(
        `${API_BASE_URL}/api/machinery/update/${id}`,
        {
          method: "PUT", // Or 'PATCH'
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Update Error:", response.status, errorBody);
        throw new Error(
          `Failed to update machinery (Status: ${response.status})`
        );
      }

      const updatedData = await response.json(); // Assuming API returns updated item
      console.log("Machinery updated successfully on server:", updatedData);
      return updatedData; // Return updated data from server
    } catch (error) {
      console.error("Failed to update machinery:", error);
      Alert.alert("Error", `Failed to save changes: ${error.message}`);
      return null; // Indicate failure
    } finally {
      setIsSaving(false); // Indicate saving process ends
    }
  };

  // --- API Call for Deleting Machinery ---
  const removeMachineryRequest = async (id) => {
    try {
      const authToken = await SecureStore.getItemAsync("jwt");
      if (!authToken) {
        throw new Error("Authentication token not found.");
      }
      const response = await fetch(
        `${API_BASE_URL}/api/machinery/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Delete Error:", response.status, errorBody);
        throw new Error(
          `Network response was not ok (Status: ${response.status})`
        );
      }
      console.log("Machinery deleted successfully on server:", id);
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to remove machinery:", error);
      Alert.alert("Error", `Failed to remove machinery: ${error.message}`);
      return false; // Indicate failure
    }
  };

  // Remove a machinery item with confirmation
  const removeMachinery = async (id, title) => {
    // Made async
    Alert.alert(
      "Confirm Removal",
      `Are you sure you want to remove "${
        title || "this machinery"
      }"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            // Made onPress async
            const success = await removeMachineryRequest(id); // Wait for API call
            if (success) {
              // Update local state only after successful API call
              setMachineries((prev) => prev.filter((m) => m.id !== id));
              setModalVisible(false); // Close modal if open
              Alert.alert("Success", "Machinery removed successfully.");
            }
            // Error alert is handled within removeMachineryRequest
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Open the modal with temporary state based on the selected item
  const openModal = (item) => {
    setSelectedMachinery(item);
    setTempModalStatus(item.status || statusOptions[0]); // Default if status is missing
    setTempModalRentPerDay(String(item.rentPerDay || 0)); // Default to 0 if missing
    setTempModalImageUrls(item.imageUrls || []); // Default to empty array
    setModalVisible(true);
  };

  // Handle image picking - Now adds image to the array
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
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Consider if editing is needed for each image
        aspect: [4, 3], // Or desired aspect ratio
        quality: 0.8, // Reduce quality slightly for faster uploads
      });

      if (
        !pickerResult.canceled &&
        pickerResult.assets &&
        pickerResult.assets.length > 0
      ) {
        const newUri = pickerResult.assets[0].uri;
        // **TODO**: Here you would typically upload the `newUri` to your backend/S3
        // and get back a persistent URL. For this example, we'll just use the local URI.
        // In a real app replace `newUri` with the URL returned after upload.
        setTempModalImageUrls((prevUrls) => [...prevUrls, newUri]);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert("Error", "Could not pick image.");
    }
  };

  // Remove a specific image from the temporary list by its index
  const handleRemoveSpecificImage = (indexToRemove) => {
    // **TODO**: If images are uploaded, you might need an API call here
    // to delete the image from your storage (e.g., S3) before removing from state.
    setTempModalImageUrls((prevUrls) =>
      prevUrls.filter((_, index) => index !== indexToRemove)
    );
  };

  // Save changes - Now includes API call and multi-image handling
  const handleSave = async () => {
    // Made async
    if (isSaving) return; // Prevent double-clicks

    const rentPerDay = parseFloat(tempModalRentPerDay);
    if (isNaN(rentPerDay) || rentPerDay < 0) {
      Alert.alert(
        "Invalid Input",
        "Rent per day must be a non-negative number."
      );
      return;
    }

    if (selectedMachinery) {
      // **TODO**: Handle Image Uploads Here
      // Before calling updateMachineryRequest, you'd iterate through tempModalImageUrls.
      // Any URLs that are local file URIs (e.g., starting with 'file://') need to be
      // uploaded to your server/S3. Replace those local URIs in a *new* array
      // with the permanent URLs returned by your upload process.
      // This example proceeds assuming URLs are already permanent or just demonstrating UI flow.
      const finalImageUrls = tempModalImageUrls; // Replace with URLs after upload

      const updates = {
        status: tempModalStatus,
        rentPerDay,
        imageUrls: finalImageUrls,
        // Include other fields from selectedMachinery if your update endpoint needs them all
        // type: selectedMachinery.type,
        // model: selectedMachinery.model,
        // remarks: selectedMachinery.remarks, // Decide if remarks/model are editable
        // latitude: selectedMachinery.latitude,
        // longitude: selectedMachinery.longitude,
      };

      const updatedMachineryFromServer = await updateMachineryRequest(
        selectedMachinery.id,
        updates
      );

      if (updatedMachineryFromServer) {
        // Update local state with data confirmed by the server
        updateMachineryLocalState(
          selectedMachinery.id,
          updatedMachineryFromServer
        );
        Alert.alert("Success", "Machinery updated successfully.");
        setModalVisible(false);
      }
      // Error alerts are handled within updateMachineryRequest
    }
  };

  // Render each machinery item as a card
  const renderTile = useCallback(
    ({ item }) => {
      const displayImage =
        item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : null;
      const title =
        item.remarks ||
        item.model ||
        `Type: ${item.type}` ||
        `Machinery #${item.id}`; // Fallback title logic

      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => openModal(item)}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel={`Machinery: ${title}, Status: ${item.status}, Rent Per Day: ${item.rentPerDay}`}
        >
          {displayImage ? (
            <Image
              source={{ uri: displayImage }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.cardPlaceholder}>
              <Icon name="truck" size={40} color={COLORS.PRIMARY} />{" "}
              {/* Changed icon */}
              <Text style={styles.cardPlaceholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.cardDetail}>
              Status: {item.status || "N/A"}
            </Text>
            <Text style={styles.cardDetail}>
              Rent Per Day: Rs. {item.rentPerDay?.toFixed(2) || "N/A"}
            </Text>
            {item.type && (
              <Text style={styles.cardDetail}>Type: {item.type}</Text>
            )}
            {item.model && (
              <Text style={styles.cardDetail}>Model: {item.model}</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [openModal] // Dependency remains openModal
  );

  if (loading && machineries.length === 0) {
    // Show loading indicator only on initial load
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading Machinery...</Text>
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
            colors={[COLORS.PRIMARY]} // Optional: customize refresh indicator color
          />
        }
        initialNumToRender={10} // Keep for performance
        ListEmptyComponent={
          !loading ? ( // Only show "No machinery" if not loading
            <View style={styles.emptyContainer}>
              <Icon
                name="exclamation-circle"
                size={40}
                color={COLORS.PRIMARY}
              />
              <Text style={styles.emptyText}>No machinery items found.</Text>
              <TouchableOpacity
                onPress={fetchMachineries}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>Tap to Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null // Don't show empty component while loading
        }
      />

      {/* Modal for Editing Machinery */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollViewContainer}>
            <View style={styles.modalContent}>
              {selectedMachinery && (
                <>
                  {/* Header */}
                  <View style={styles.modalHeaderContainer}>
                    <Text style={styles.modalHeader} numberOfLines={1}>
                      {selectedMachinery.remarks ||
                        selectedMachinery.model ||
                        `Machinery #${selectedMachinery.id}`}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                      accessible={true}
                      accessibilityLabel="Close modal"
                    >
                      <Icon name="close" size={24} color={COLORS.PRIMARY} />
                    </TouchableOpacity>
                  </View>

                  {/* Image Section */}
                  <Text style={styles.modalSectionTitle}>Images</Text>
                  <View style={styles.imageManagementContainer}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.modalImageScrollView}
                    >
                      {tempModalImageUrls.map((url, index) => (
                        <View key={index} style={styles.modalImageWrapper}>
                          <Image
                            source={{ uri: url }}
                            style={styles.modalImage}
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => handleRemoveSpecificImage(index)}
                            accessible={true}
                            accessibilityLabel={`Remove image ${index + 1}`}
                          >
                            <Icon
                              name="times-circle"
                              size={22}
                              color={COLORS.ERROR || "darkred"}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                      {/* Placeholder/Add Button if needed */}
                      {tempModalImageUrls.length === 0 && (
                        <View
                          style={[
                            styles.imagePlaceholder,
                            styles.modalImagePlaceholder,
                          ]}
                        >
                          <Text style={styles.imagePlaceholderText}>
                            No Images
                          </Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.addImageButton}
                        onPress={handlePickImage}
                        accessible={true}
                        accessibilityLabel="Add new image"
                      >
                        <Icon name="plus" size={24} color={COLORS.PRIMARY} />
                        <Text style={styles.addImageButtonText}>Add</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>

                  {/* Status Section */}
                  <View style={styles.stackedInputContainer}>
                    <Text style={styles.stackedLabel}>Status:</Text>
                    <View style={styles.pickerContainer}>
                      {/* Add a container for border/styling */}
                      <Picker
                        selectedValue={tempModalStatus}
                        onValueChange={(itemValue, itemIndex) =>
                          setTempModalStatus(itemValue)
                        }
                        style={styles.pickerStyle} // Style the picker itself
                        dropdownIconColor={COLORS.PRIMARY} // Optional: style dropdown arrow
                      >
                        {statusOptions.map((status, index) => (
                          <Picker.Item
                            key={index}
                            label={statusLabels[index]}
                            value={status}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  {/* Rent Per Day Section */}
                  <View style={styles.modalInputRow}>
                    <Text style={styles.modalLabel}>Rent Per Day ($):</Text>
                    <TextInput
                      style={[
                        styles.input,
                        tempModalRentPerDay === "" && styles.inputError, // Example error style
                      ]}
                      keyboardType="numeric"
                      value={tempModalRentPerDay}
                      onChangeText={setTempModalRentPerDay}
                      placeholder="e.g., 150.00"
                      placeholderTextColor={COLORS.SECONDARY_LIGHT || "#aaa"}
                      accessibilityLabel="Rent per day input"
                    />
                  </View>

                  {/* Display Only Fields (Example) */}
                  {selectedMachinery.type && (
                    <View style={styles.modalDisplayRow}>
                      <Text style={styles.modalLabel}>Type:</Text>
                      <Text style={styles.modalValue}>
                        {selectedMachinery.type}
                      </Text>
                    </View>
                  )}
                  {selectedMachinery.model && (
                    <View style={styles.modalDisplayRow}>
                      <Text style={styles.modalLabel}>Model:</Text>
                      <Text style={styles.modalValue}>
                        {selectedMachinery.model}
                      </Text>
                    </View>
                  )}
                  {selectedMachinery.remarks && (
                    <View style={styles.modalDisplayRow}>
                      <Text style={styles.modalLabel}>Remarks:</Text>
                      <Text style={styles.modalValue}>
                        {selectedMachinery.remarks}
                      </Text>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.removeMachineryButton,
                      ]}
                      onPress={() =>
                        removeMachinery(
                          selectedMachinery.id,
                          selectedMachinery.remarks || selectedMachinery.model // Pass title for confirm dialog
                        )
                      }
                      disabled={isSaving}
                    >
                      <Text style={styles.actionButtonText}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.saveButton,
                        isSaving && styles.buttonDisabled, // Style for disabled state
                      ]}
                      onPress={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <ActivityIndicator size="small" color={COLORS.WHITE} />
                      ) : (
                        <Text style={styles.actionButtonText}>
                          Save Changes
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Bottom Sheet - Kept for potential future use, but primary interaction is via FlatList -> Modal */}
      {/*
            <BottomSheet
                visible={showFarmList} // You'd need to re-add state and logic to show this
                onBackButtonPress={() => setShowFarmList(false)}
                onBackdropPress={() => setShowFarmList(false)}
            >
               // ... BottomSheet content similar to before, using new data fields ...
            </BottomSheet>
            */}
    </SafeAreaView>
  );
};

// --- Styles --- (Updated and Added Styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND || "#f4f6f8", // Lighter background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND || "#f4f6f8",
  },
  loadingText: {
    marginTop: 10,
    fontSize: SIZES.BODY || 16,
    color: COLORS.SECONDARY,
  },
  listContainer: {
    padding: SIZES.PADDING || 16,
    paddingBottom: 80, // Ensure space for potential FAB or bottom nav
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: SIZES.BORDER_RADIUS || 12,
    marginBottom: SIZES.PADDING || 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden", // Keep image within bounds
  },
  cardImage: {
    width: "100%",
    height: 180, // Slightly taller image
    backgroundColor: COLORS.INPUT_BG || "#e0e0e0", // BG while loading
  },
  cardPlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.INPUT_BG || "#e9e9e9",
    justifyContent: "center",
    alignItems: "center",
  },
  cardPlaceholderText: {
    color: COLORS.PRIMARY,
    fontSize: SIZES.CAPTION || 14,
    marginTop: 8,
    fontFamily: FONTS.REGULAR,
  },
  cardContent: {
    padding: SIZES.PADDING * 0.75 || 12,
  },
  cardTitle: {
    fontSize: SIZES.SUBTITLE || 18,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK|| "#333", // Darker title
    marginBottom: 6,
  },
  cardDetail: {
    fontSize: SIZES.BODY || 14,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_DARK || "#333",
    marginBottom: 4,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Darker overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalScrollViewContainer: {
    flexGrow: 1, // Allows scrolling if content exceeds screen height
    justifyContent: "center", // Center the modal vertically
    alignItems: "center",
    paddingVertical: 40, // Add padding for scroll view
  },
  modalContent: {
    width: "100%", // Slightly wider modal
    maxWidth: 600, // Max width for tablets
    backgroundColor: COLORS.WHITE || "#fff",
    borderRadius: SIZES.BORDER_RADIUS_LARGE || 16,
    padding: SIZES.PADDING * 1.2 || 20,
    elevation: 10, // Higher elevation for modal
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    maxHeight: "90%", // Ensure modal doesn't exceed screen height
  },
  modalSectionTitle: {
    fontSize: SIZES.BODY || 16,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.PRIMARY,
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER || "#eee",
    paddingBottom: 4,
  },
  modalHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER || "#eee",
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalHeader: {
    fontSize: SIZES.H3 || 20,
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    flex: 1, // Allow text to take space but wrap
    marginRight: 10, // Space before close button
  },
  closeButton: {
    padding: 5, // Make touch target slightly larger
    // Removed background for cleaner look
  },
  // --- Image Management Styles ---
  imageManagementContainer: {
    marginBottom: 16,
  },
  modalImageScrollView: {
    // No specific style needed here unless padding is required inside
  },
  modalImageWrapper: {
    position: "relative", // Needed for absolute positioning of the remove button
    marginRight: 10, // Space between images
    width: 120, // Fixed width for image previews
    height: 90, // Fixed height (4:3 aspect ratio)
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    overflow: "hidden", // Keep image and button contained
    backgroundColor: COLORS.INPUT_BG || "#e0e0e0",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
    borderRadius: 15,
    padding: 2,
  },
  modalImagePlaceholder: {
    width: 120,
    height: 90,
    marginRight: 10,
  },
  addImageButton: {
    width: 90, // Smaller add button
    height: 90,
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5, // Space after last image or placeholder
  },
  addImageButtonText: {
    fontSize: SIZES.CAPTION || 12,
    color: COLORS.PRIMARY,
    marginTop: 4,
    fontFamily: FONTS.MEDIUM,
  },
  // --- Input Styles ---
  modalInputRow: {
    // Changed from 'row' to avoid conflict, more descriptive
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalDisplayRow: {
    // For non-editable fields
    flexDirection: "row",
    alignItems: "center", // Align items at the start for potentially long values
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT || "#f0f0f0",
  },
  modalLabel: {
    fontSize: SIZES.BODY || 14,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.PRIMARY || "#555",
    marginRight: 10,
    width: 110, // Fixed width for labels
  },
  modalValue: {
    fontSize: SIZES.BODY || 14,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TERTIARY || "#333",
    flex: 1, // Allow value to wrap
  },
  segmentedControl: {
    flex: 1,
    height: 36, // Slightly shorter control
  },
  input: {
    flex: 1,
    height: 44,
    borderColor: COLORS.BORDER || "#ccc",
    borderWidth: 1,
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.INPUT_BG || "#f8f8f8",
    fontFamily: FONTS.REGULAR,
    fontSize: SIZES.BODY || 14,
    color: COLORS.TERTIARY || "#333",
  },
  inputError: {
    borderColor: COLORS.ERROR || "red",
  },
  // --- Action Button Styles ---
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24, // More space before actions
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER || "#eee",
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row", // Allow icon + text if needed
  },
  actionButtonText: {
    color: COLORS.WHITE || "#fff",
    fontSize: SIZES.BUTTON || 16,
    fontFamily: FONTS.MEDIUM,
    textAlign: "center",
  },
  removeMachineryButton: {
    // Specific style for the main remove button
    backgroundColor: COLORS.ERROR || "darkred",
    flex: 0.48, // Take slightly less space than save
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    flex: 0.48, // Take slightly less space
  },
  buttonDisabled: {
    backgroundColor: COLORS.SECONDARY_LIGHT || "#aaa",
  },
  // --- Empty List Styles ---
  emptyContainer: {
    flex: 1, // Ensure it takes space if list is empty
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50, // Add margin from top
    padding: 20,
  },
  emptyText: {
    color: COLORS.SECONDARY,
    fontSize: SIZES.BODY || 16,
    marginTop: 12,
    textAlign: "center",
    fontFamily: FONTS.REGULAR,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.PRIMARY_LIGHT || "#e0e0ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: COLORS.PRIMARY,
    fontSize: SIZES.BODY || 14,
    fontFamily: FONTS.MEDIUM,
  },

  // --- Bottom Sheet Styles (Kept for reference) ---
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%", // Limit height
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    height: 44, // Consistent height
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    backgroundColor: COLORS.INPUT_BG || "#f8f8f8",
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: SIZES.BODY || 14,
  },
  bottomSheetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8, // Less horizontal padding
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT || "#f0f0f0",
  },
  bottomSheetItemText: {
    fontSize: 16,
    color: COLORS.SECONDARY_DARK || "#555",
    marginLeft: 12, // Add margin from icon
    fontFamily: FONTS.REGULAR,
  },
  stackedInputContainer: {
    marginBottom: 20, // Increased spacing
  },
  stackedLabel: {
    fontSize: SIZES.BODY || 14,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.SECONDARY_DARK || "#555",
    marginBottom: 8, // Space between label and input/value
  },
  pickerContainer: {
    // Style the container around the picker
    borderWidth: 1,
    borderColor: COLORS.BORDER || "#ccc",
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    backgroundColor: COLORS.INPUT_BG || "#f8f8f8",
    height: 48, // Adjust height if needed
    justifyContent: "center", // Center picker item vertically
  },
  pickerStyle: {
    // height: '100%', // May not work consistently across platforms
    // width: '100%', // May not work consistently across platforms
    // Apply color etc. directly if needed, but container handles bg/border
  },
  input: {
    // Adjusted for stacked layout (no flex:1 needed)
    height: 44,
    borderColor: COLORS.BORDER || "#ccc",
    borderWidth: 1,
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.INPUT_BG || "#f8f8f8",
    fontFamily: FONTS.REGULAR,
    fontSize: SIZES.BODY || 14,
    color: COLORS.TERTIARY || "#333",
  },
  modalValue: {
    // Adjusted for stacked layout
    fontSize: SIZES.BODY || 14,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TERTIARY || "#333",
    paddingVertical: 10, // Add padding if needed
  },
});

export default ManageMachineryScreen;
