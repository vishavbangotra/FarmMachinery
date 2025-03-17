// screens/ManageMachineryScreen.js
import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import * as ImagePicker from "expo-image-picker";
import { FAB, Button as PaperButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { BottomSheet } from "react-native-btr";
import Slider from "@react-native-community/slider";
import { COLORS, SIZES, FONTS } from "../../constants/styles";
import myMachinery from "../../dummy_data/myMachinery";

const ManageMachineryScreen = () => {
  const [machineries, setMachineries] = useState(myMachinery);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [modalStatus, setModalStatus] = useState("");
  const [modalHourlyRate, setModalHourlyRate] = useState("");
  const [modalImage, setModalImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFarmList, setShowFarmList] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [distance, setDistance] = useState(0);

  // Options for status management
  const statusOptions = ["active", "inactive", "engaged"];
  const statusLabels = ["Active", "Inactive", "Engaged"];

  // Update a machinery item’s field
  const updateMachinery = (id, field, value) => {
    setMachineries((prev) =>
      prev.map((machinery) =>
        machinery.id === id ? { ...machinery, [field]: value } : machinery
      )
    );
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
            setMachineries((prev) => prev.filter((m) => m.id !== id));
            setModalVisible(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Open modal and initialize modal state
  const openModal = (item) => {
    setSelectedMachinery(item);
    setModalStatus(item.status);
    setModalHourlyRate(String(item.hourlyRate));
    setModalImage(item.image);
    setModalVisible(true);
  };

  // Launch the image picker
  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!pickerResult.cancelled) {
      setModalImage(pickerResult.uri);
    }
  };

  // Remove the currently selected image
  const handleRemoveImage = () => {
    setModalImage(null);
  };

  // Save the changes from the modal
  const handleSave = () => {
    if (selectedMachinery) {
      updateMachinery(selectedMachinery.id, "status", modalStatus);
      updateMachinery(selectedMachinery.id, "hourlyRate", modalHourlyRate);
      updateMachinery(selectedMachinery.id, "image", modalImage);
    }
    setModalVisible(false);
  };

  // Render each machinery tile as a modern card
  const renderTile = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      ) : (
        <View style={styles.cardPlaceholder}>
          <Text style={styles.cardPlaceholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDetail}>Status: {item.status}</Text>
        <Text style={styles.cardDetail}>Hourly Rate: {item.hourlyRate}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Manage Machinery</Text>
      <FlatList
        data={machineries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTile}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for Editing Machinery */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMachinery && (
              <>
                <View style={styles.modalHeaderContainer}>
                  <Text style={styles.modalHeader}>
                    {selectedMachinery.title}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Icon name="close" size={24} color={COLORS.SECONDARY} />
                  </TouchableOpacity>
                </View>

                <View style={styles.imageContainer}>
                  {modalImage ? (
                    <Image
                      source={{ uri: modalImage }}
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
                    style={styles.modalButton}
                    onPress={handlePickImage}
                  >
                    <Text style={styles.modalButtonText}>Change Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.removeButton]}
                    onPress={handleRemoveImage}
                  >
                    <Text style={styles.modalButtonText}>Remove Image</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <Text style={styles.modalLabel}>Status:</Text>
                  <SegmentedControl
                    values={statusLabels}
                    selectedIndex={statusOptions.indexOf(modalStatus)}
                    onChange={(event) => {
                      const newStatus =
                        statusOptions[event.nativeEvent.selectedSegmentIndex];
                      setModalStatus(newStatus);
                    }}
                    style={styles.segmentedControl}
                    tintColor={COLORS.PRIMARY}
                    backgroundColor={COLORS.INPUT_BG}
                    activeTextColor={COLORS.WHITE}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalLabel}>Hourly Rate:</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={modalHourlyRate}
                    onChangeText={setModalHourlyRate}
                  />
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.removeButton]}
                    onPress={() =>
                      removeMachinery(
                        selectedMachinery.id,
                        selectedMachinery.title
                      )
                    }
                  >
                    <Text style={styles.modalButtonText}>Remove</Text>
                  </TouchableOpacity>
           
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      { backgroundColor: COLORS.PRIMARY },
                    ]}
                    onPress={handleSave}
                  >
                    <Text style={styles.modalButtonText}>Save</Text>
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
          <ScrollView>
            {machineries.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.bottomSheetItem}
                onPress={() => openModal(item)}
              >
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
  header: {
    fontSize: SIZES.TITLE || 24,
    fontFamily: FONTS.BOLD || "System",
    color: COLORS.PRIMARY || "#4CAF50",
    marginBottom: SIZES.MARGIN_LARGE || 24,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
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
    borderRadius: 8,
    marginBottom: 12,
  },
  cardPlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: COLORS.INPUT_BG || "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardPlaceholderText: {
    color: COLORS.SECONDARY || "#757575",
    fontSize: 16,
  },
  cardContent: {
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: FONTS.BOLD || "System",
    color: COLORS.PRIMARY || "#4CAF50",
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    color: COLORS.SECONDARY || "#757575",
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalHeader: {
    fontSize: SIZES.TITLE || 22,
    fontFamily: FONTS.BOLD || "System",
    color: COLORS.TERTIARY || "#333",
  },
  modalLabel: {
    fontSize: 16,
    color: COLORS.SECONDARY || "#757575",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  segmentedControl: {
    flex: 1,
    height: 40,
  },
  input: {
    flex: 1,
    height: 44,
    borderColor: COLORS.BORDER || "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  modalImage: {
    width: 220,
    height: 220,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 220,
    height: 220,
    borderRadius: 12,
    backgroundColor: COLORS.INPUT_BG || "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: COLORS.SECONDARY || "#757575",
    fontSize: 16,
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: COLORS.TERTIARY || "#333",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: "darkred",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
    fontFamily: FONTS.BOLD || "System",
    color: COLORS.PRIMARY || "#4CAF50",
    marginBottom: 16,
    textAlign: "center",
  },
  bottomSheetItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER || "#ddd",
  },
  bottomSheetItemText: {
    fontSize: 16,
    color: COLORS.SECONDARY || "#757575",
  },
});

export default ManageMachineryScreen;
