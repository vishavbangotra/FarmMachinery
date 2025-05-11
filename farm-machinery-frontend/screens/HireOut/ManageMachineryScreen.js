import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS, SIZES, FONTS } from "../../constants/styles";
import * as SecureStore from "expo-secure-store";
import { Picker } from "@react-native-picker/picker";

const API_BASE_URL = "http://10.0.2.2:8080";

const ManageMachineryScreen = () => {
  const [machineries, setMachineries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [tempModalStatus, setTempModalStatus] = useState("");
  const [tempModalRentPerDay, setTempModalRentPerDay] = useState("");
  const [tempModalImageUrls, setTempModalImageUrls] = useState([]);
  const [tempModalRemark, setTempModalRemark] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmRemoveModalVisible, setConfirmRemoveModalVisible] =
    useState(false);
  const [machineryToRemove, setMachineryToRemove] = useState(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  const fetchMachineries = useCallback(async () => {
    console.log("Fetching machineries...");
    setLoading(true);
    setRefreshing(true);
    try {
      const authToken = await SecureStore.getItemAsync("jwt");
      if (!authToken) {
        setErrorMessage("No auth token found. Please log in.");
        setErrorModalVisible(true);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/machinery`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Fetch Error:", response.status, errorBody);
        throw new Error(
          `Network response was not ok (Status: ${response.status})`
        );
      }

      const responseData = await response.json();
      const data = responseData.data;
      setMachineries(Array.isArray(data) ? data : []);
      console.log("Machineries fetched:", data.length);
    } catch (error) {
      console.error("Failed to fetch machineries:", error);
      setErrorMessage(`Failed to fetch machineries: ${error.message}`);
      setErrorModalVisible(true);
      setMachineries([]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMachineries();
  }, [fetchMachineries]);

  const statusOptions = ["AVAILABLE", "UNAVAILABLE", "ENGAGED"];
  const statusLabels = ["Available", "Unavailable", "Engaged"];

  const updateMachineryLocalState = (id, updates) => {
    setMachineries((prev) =>
      prev.map((machinery) =>
        machinery.id === id ? { ...machinery, ...updates } : machinery
      )
    );
  };

  const updateMachineryRequest = async (id, updates) => {
    setIsSaving(true);
    console.log("Updating machinery...");
    console.log("Updates:", updates);
    try {
      const authToken = await SecureStore.getItemAsync("jwt");
      if (!authToken) {
        throw new Error("Authentication token not found.");
      }
      const response = await fetch(
        `${API_BASE_URL}/api/machinery/update/${id}`,
        {
          method: "PUT",
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

      const updatedData = await response.json();
      console.log("Machinery updated successfully on server:", updatedData);
      return updatedData;
    } catch (error) {
      console.error("Failed to update machinery:", error);
      setErrorMessage(`Failed to save changes: ${error.message}`);
      setErrorModalVisible(true);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

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
      return true;
    } catch (error) {
      console.error("Failed to remove machinery:", error);
      setErrorMessage(`Failed to remove machinery: ${error.message}`);
      setErrorModalVisible(true);
      return false;
    }
  };

  const removeMachinery = (item) => {
    setMachineryToRemove(item);
    setConfirmRemoveModalVisible(true);
  };

  const openModal = (item) => {
    setSelectedMachinery(item);
    setTempModalStatus(item.status || statusOptions[0]);
    setTempModalRentPerDay(String(item.rentPerDay || 0));
    setTempModalImageUrls(item.imageUrls || []);
    setTempModalRemark(item.remarks || "");
    setModalVisible(true);
    setValidationError("");
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setErrorMessage("Permission to access camera roll is required!");
      setErrorModalVisible(true);
      return;
    }
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (
        !pickerResult.canceled &&
        pickerResult.assets &&
        pickerResult.assets.length > 0
      ) {
        const newUri = pickerResult.assets[0].uri;
        setTempModalImageUrls((prevUrls) => [...prevUrls, newUri]);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      setErrorMessage("Could not pick image.");
      setErrorModalVisible(true);
    }
  };

  const handleRemoveSpecificImage = (indexToRemove) => {
    setTempModalImageUrls((prevUrls) =>
      prevUrls.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSave = async () => {
    if (isSaving) return;

    const rentPerDay = parseFloat(tempModalRentPerDay);
    if (isNaN(rentPerDay) || rentPerDay < 0) {
      setValidationError("Rent per day must be a non-negative number.");
      return;
    }
    setValidationError("");

    if (selectedMachinery) {
      const finalImageUrls = tempModalImageUrls;
      const updates = {
        status: tempModalStatus,
        rentPerDay,
        imageUrls: finalImageUrls,
        remarks: tempModalRemark,
      };

      const updatedMachineryFromServer = await updateMachineryRequest(
        selectedMachinery.id,
        updates
      );

      if (updatedMachineryFromServer) {
        updateMachineryLocalState(
          selectedMachinery.id,
          updatedMachineryFromServer
        );
        setSuccessMessage("Machinery updated successfully.");
        setSuccessModalVisible(true);
        setModalVisible(false);
      }
    }
  };

  const renderTile = useCallback(
    ({ item }) => {
      const displayImage =
        item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : null;
      const title = item.type || `Machinery #${item.id}`;

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
              <Icon name="truck" size={40} color={COLORS.PRIMARY} />
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
    [openModal]
  );

  if (loading && machineries.length === 0) {
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
            colors={[COLORS.PRIMARY]}
          />
        }
        initialNumToRender={10}
        ListEmptyComponent={
          !loading ? (
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
          ) : null
        }
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollViewContainer}>
            <View style={styles.modalContent}>
              {selectedMachinery && (
                <>
                  <View style={styles.modalHeaderContainer}>
                    <Text style={styles.modalHeader} numberOfLines={1}>
                      {selectedMachinery.type ||
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

                  <View style={styles.stackedInputContainer}>
                    <Text style={styles.stackedLabel}>Status:</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={tempModalStatus}
                        onValueChange={(itemValue) =>
                          setTempModalStatus(itemValue)
                        }
                        style={styles.pickerStyle}
                        dropdownIconColor={COLORS.PRIMARY}
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

                  <View style={styles.modalInputRow}>
                    <Text style={styles.modalLabel}>Rent Per Day ($):</Text>
                    <TextInput
                      style={[
                        styles.input,
                        validationError && styles.inputError,
                      ]}
                      keyboardType="numeric"
                      value={tempModalRentPerDay}
                      onChangeText={setTempModalRentPerDay}
                      placeholder="e.g., 150.00"
                      placeholderTextColor={COLORS.SECONDARY_LIGHT || "#aaa"}
                      accessibilityLabel="Rent per day input"
                    />
                  </View>
                  {validationError && (
                    <Text style={styles.validationErrorText}>
                      {validationError}
                    </Text>
                  )}

                  <View style={styles.modalInputRow}>
                    <Text style={styles.modalLabel}>Remarks:</Text>
                    <TextInput
                      style={styles.input}
                      value={tempModalRemark}
                      onChangeText={setTempModalRemark}
                      placeholder="Enter remarks"
                      placeholderTextColor={COLORS.SECONDARY_LIGHT || "#aaa"}
                      accessibilityLabel="Remarks input"
                    />
                  </View>

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

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.removeMachineryButton,
                      ]}
                      onPress={() => removeMachinery(selectedMachinery)}
                      disabled={isSaving}
                    >
                      <Text style={styles.actionButtonText}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.saveButton,
                        isSaving && styles.buttonDisabled,
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

      {/* Confirmation Modal */}
      <Modal
        visible={confirmRemoveModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModalContent}>
            <Text style={styles.confirmationTitle}>Confirm Removal</Text>
            <Text style={styles.confirmationMessage}>
              Are you sure you want to remove "
              {machineryToRemove?.type || `Machinery #${machineryToRemove?.id}`}
              "? This action cannot be undone.
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={styles.confirmationButton}
                onPress={() => setConfirmRemoveModalVisible(false)}
              >
                <Text style={styles.confirmationButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.removeButton]}
                onPress={async () => {
                  if (machineryToRemove) {
                    const success = await removeMachineryRequest(
                      machineryToRemove.id
                    );
                    if (success) {
                      setMachineries((prev) =>
                        prev.filter((m) => m.id !== machineryToRemove.id)
                      );
                      setModalVisible(false);
                      setConfirmRemoveModalVisible(false);
                      setSuccessMessage("Machinery removed successfully.");
                      setSuccessModalVisible(true);
                    }
                  }
                }}
              >
                <Text style={styles.confirmationButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal visible={errorModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalContent}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.errorButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <Text style={styles.successTitle}>Success</Text>
            <Text style={styles.successMessage}>{successMessage}</Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.successButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND || "#f4f6f8",
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
    paddingBottom: 80,
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
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.INPUT_BG || "#e0e0e0",
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
    color: COLORS.TEXT_DARK || "#333",
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalScrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  modalContent: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: COLORS.WHITE || "#fff",
    borderRadius: SIZES.BORDER_RADIUS_LARGE || 16,
    padding: SIZES.PADDING * 1.2 || 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    maxHeight: "90%",
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
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 5,
  },
  imageManagementContainer: {
    marginBottom: 16,
  },
  modalImageScrollView: {},
  modalImageWrapper: {
    position: "relative",
    marginRight: 10,
    width: 120,
    height: 90,
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    overflow: "hidden",
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 2,
  },
  modalImagePlaceholder: {
    width: 120,
    height: 90,
    marginRight: 10,
  },
  addImageButton: {
    width: 90,
    height: 90,
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  addImageButtonText: {
    fontSize: SIZES.CAPTION || 12,
    color: COLORS.PRIMARY,
    marginTop: 4,
    fontFamily: FONTS.MEDIUM,
  },
  modalInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
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
    width: 110,
  },
  modalValue: {
    fontSize: SIZES.BODY || 14,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TERTIARY || "#333",
    flex: 1,
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
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
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
    flexDirection: "row",
  },
  actionButtonText: {
    color: COLORS.WHITE || "#fff",
    fontSize: SIZES.BUTTON || 16,
    fontFamily: FONTS.MEDIUM,
    textAlign: "center",
  },
  removeMachineryButton: {
    backgroundColor: COLORS.ERROR || "darkred",
    flex: 0.48,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    flex: 0.48,
  },
  buttonDisabled: {
    backgroundColor: COLORS.SECONDARY_LIGHT || "#aaa",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
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
  stackedInputContainer: {
    marginBottom: 20,
  },
  stackedLabel: {
    fontSize: SIZES.BODY || 14,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.SECONDARY_DARK || "#555",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.BORDER || "#ccc",
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    backgroundColor: COLORS.INPUT_BG || "#f8f8f8",
    height: 48,
    justifyContent: "center",
  },
  pickerStyle: {},
  confirmationModalContent: {
    width: "80%",
    backgroundColor: COLORS.WHITE || "#fff",
    borderRadius: SIZES.BORDER_RADIUS_LARGE || 16,
    padding: SIZES.PADDING * 1.2 || 20,
    alignItems: "center",
  },
  confirmationTitle: {
    fontSize: SIZES.H3 || 20,
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    marginBottom: 10,
  },
  confirmationMessage: {
    fontSize: SIZES.BODY || 16,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_DARK || "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    backgroundColor: COLORS.SECONDARY_LIGHT || "#aaa",
  },
  removeButton: {
    backgroundColor: COLORS.ERROR || "darkred",
  },
  confirmationButtonText: {
    color: COLORS.WHITE || "#fff",
    fontSize: SIZES.BUTTON || 16,
    fontFamily: FONTS.MEDIUM,
  },
  errorModalContent: {
    width: "80%",
    backgroundColor: COLORS.WHITE || "#fff",
    borderRadius: SIZES.BORDER_RADIUS_LARGE || 16,
    padding: SIZES.PADDING * 1.2 || 20,
    alignItems: "center",
  },
  errorTitle: {
    fontSize: SIZES.H3 || 20,
    fontFamily: FONTS.BOLD,
    color: COLORS.ERROR || "red",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: SIZES.BODY || 16,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_DARK || "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  errorButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    backgroundColor: COLORS.PRIMARY,
  },
  errorButtonText: {
    color: COLORS.WHITE || "#fff",
    fontSize: SIZES.BUTTON || 16,
    fontFamily: FONTS.MEDIUM,
  },
  successModalContent: {
    width: "80%",
    backgroundColor: COLORS.WHITE || "#fff",
    borderRadius: SIZES.BORDER_RADIUS_LARGE || 16,
    padding: SIZES.PADDING * 1.2 || 20,
    alignItems: "center",
  },
  successTitle: {
    fontSize: SIZES.H3 || 20,
    fontFamily: FONTS.BOLD,
    color: COLORS.SUCCESS || "green",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: SIZES.BODY || 16,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_DARK || "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  successButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: SIZES.BORDER_RADIUS_SMALL || 8,
    backgroundColor: COLORS.PRIMARY,
  },
  successButtonText: {
    color: COLORS.WHITE || "#fff",
    fontSize: SIZES.BUTTON || 16,
    fontFamily: FONTS.MEDIUM,
  },
  validationErrorText: {
    color: COLORS.ERROR || "red",
    fontSize: SIZES.BODY || 16,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ManageMachineryScreen;
