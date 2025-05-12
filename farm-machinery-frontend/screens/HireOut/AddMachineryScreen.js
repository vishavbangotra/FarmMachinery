import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  Switch,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { machineryService } from "../../services/machineryService";

// Enable LayoutAnimation on Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const MACHINES = [
  { id: "tractor", title: "Tractor", icon: "tractor" },
  { id: "rotavator", title: "Rotavator", icon: "screwdriver" },
];

const machinerySchemas = {
  Tractor: [
    {
      name: "model",
      label: "Model",
      type: "text",
      placeholder: "Enter model",
      isRequired: true,
    },
    {
      name: "horsepower",
      label: "Horse Power",
      type: "number",
      placeholder: "Enter horsepower",
      isRequired: true,
    },
    { name: "is4x4", label: "4x4 Capability", type: "switch" },
    {
      name: "rentPerDay",
      label: "Rent Per Day",
      type: "number",
      placeholder: "Enter rent per day",
      isRequired: true,
    },
    {
      name: "remarks",
      label: "Remarks",
      type: "text",
      placeholder: "Enter Remarks",
    },
  ],
  Rotavator: [
    { name: "model", label: "Model", type: "text", placeholder: "Enter model" },
    {
      name: "bladeCount",
      label: "Blade Count",
      type: "number",
      placeholder: "Enter Blade Count",
    },
    {
      name: "workingDepth",
      label: "Working Depth",
      type: "number",
      placeholder: "Enter Working Depth",
    },
    {
      name: "rentPerDay",
      label: "Rent Per Day",
      type: "number",
      placeholder: "Enter rent per day",
      isRequired: true,
    },
    {
      name: "remarks",
      label: "Remarks",
      type: "text",
      placeholder: "Enter Remarks",
    },
  ],
};

const AddMachineryScreen = ({ navigation }) => {
  const [expandedMachineId, setExpandedMachineId] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [images, setImages] = useState({});

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedMachineId(expandedMachineId === id ? null : id);
  };

  const handleChange = (machineryId, name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [machineryId]: { ...prev[machineryId], [name]: value },
    }));
  };

  const pickImages = async (machineryType) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 5,
        quality: 0.7,
      });

      if (!result.canceled) {
        // Validate image size
        for (const asset of result.assets) {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          if (blob.size > 5 * 1024 * 1024) { // 5MB limit
            Alert.alert("Error", "Each image must be less than 5MB");
            return;
          }
        }

        setImages(prev => ({
          ...prev,
          [machineryType]: result.assets.map(asset => asset.uri)
        }));
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const validateForm = (machineryId, machineryTitle) => {
    const schema = machinerySchemas[machineryTitle];
    const machineryDetails = formValues[machineryId] || {};

    const requiredFields = schema.filter(field => field.isRequired);
    const missingFields = requiredFields.filter(field => {
      const value = machineryDetails[field.name];
      return value === undefined || value.toString().trim() === "";
    });

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Fields",
        `Please fill in: ${missingFields.map(f => f.label).join(", ")}`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (machineryId, machineryTitle) => {
    if (!validateForm(machineryId, machineryTitle)) return;

    const machineryDetails = {};
    const schema = machinerySchemas[machineryTitle];

    schema.forEach((field) => {
      const value = formValues[machineryId]?.[field.name];
      if (field.type === "switch") {
        machineryDetails[field.name] = value || false;
      } else if (field.type === "number") {
        machineryDetails[field.name] = value ? parseFloat(value) : 0;
      } else {
        machineryDetails[field.name] = value || "";
      }
    });

    // Validate required number fields
    const numberFields = schema.filter(field => field.type === "number" && field.isRequired);
    const invalidFields = numberFields.filter(field => {
      const value = machineryDetails[field.name];
      return isNaN(value) || value < 0;
    });

    if (invalidFields.length > 0) {
      Alert.alert(
        "Invalid Input",
        `Please enter valid numbers for: ${invalidFields.map(f => f.label).join(", ")}`
      );
      return;
    }

    navigation.navigate("Map", {
      machineryTitle,
      machineryDetails,
      images: images[machineryId] || [],
    });
  };

  const renderItem = ({ item }) => {
    const isExpanded = item.id === expandedMachineId;
    return (
      <View style={styles.machineryItem}>
        <TouchableOpacity
          style={styles.headerContainer}
          onPress={() => toggleExpand(item.id)}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={28}
            color={COLORS.TERTIARY}
            style={styles.icon}
          />
          <Text style={styles.headerText}>{item.title}</Text>
          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={COLORS.TERTIARY}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.formContainer}>
            {machinerySchemas[item.title].map((field, index) => (
              <View key={index} style={styles.fieldContainer}>
                {field.type === "switch" ? (
                  <View style={styles.switchContainer}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <Switch
                      trackColor={{ false: "black", true: COLORS.SECONDARY }}
                      thumbColor={
                        formValues[item.id]?.[field.name]
                          ? COLORS.PRIMARY
                          : "rgb(63, 106, 143)"
                      }
                      ios_backgroundColor={COLORS.BORDER}
                      value={!!formValues[item.id]?.[field.name]}
                      onValueChange={(value) =>
                        handleChange(item.id, field.name, value)
                      }
                    />
                  </View>
                ) : (
                  <View>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={field.placeholder}
                      placeholderTextColor={COLORS.TEXT_DARK}
                      keyboardType={
                        field.type === "number" ? "numeric" : "default"
                      }
                      value={formValues[item.id]?.[field.name] || ""}
                      onChangeText={(text) =>
                        handleChange(item.id, field.name, text)
                      }
                    />
                  </View>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={[GLOBAL_STYLES.button, styles.imagePickerButton]}
              onPress={() => pickImages(item.id)}
            >
              <MaterialCommunityIcons
                name="camera"
                size={24}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>
                {images[item.id]?.length > 0 ? "Change Images" : "Add Images"}
              </Text>
            </TouchableOpacity>

            {images[item.id]?.length > 0 && (
              <ScrollView horizontal style={styles.imagePreviewContainer}>
                {images[item.id].map((uri, idx) => (
                  <View key={idx} style={styles.imageWrapper}>
                    <Image
                      source={{ uri }}
                      style={styles.imagePreview}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() =>
                        setImages((prev) => ({
                          ...prev,
                          [item.id]: prev[item.id].filter(
                            (_, index) => index !== idx
                          ),
                        }))
                      }
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={GLOBAL_STYLES.button}
              onPress={() => handleSubmit(item.id, item.title)}
            >
              <Text style={styles.buttonText}>Submit {item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={MACHINES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SIZES.PADDING,
    paddingTop: SIZES.MARGIN_LARGE,
  },
  listContainer: {
    paddingBottom: SIZES.MARGIN_LARGE,
  },
  machineryItem: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS,
    marginBottom: SIZES.MARGIN_MEDIUM,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.PADDING,
    backgroundColor: COLORS.PRIMARY,
  },
  headerText: {
    flex: 1,
    fontSize: SIZES.BUTTON_TEXT,
    fontWeight: "700",
    fontFamily: FONTS.MEDIUM,
    color: COLORS.TEXT_LIGHT,
    marginLeft: SIZES.MARGIN_SMALL,
  },
  icon: {
    marginRight: SIZES.MARGIN_SMALL,
    color: COLORS.TEXT_LIGHT,
  },
  formContainer: {
    padding: SIZES.PADDING,
    backgroundColor: COLORS.BACKGROUND,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldLabel: {
    marginBottom: 4,
    fontWeight: "bold",
    color: COLORS.SECONDARY,
  },
  input: {
    height: 50,
    backgroundColor: COLORS.SECONDARY,
    borderColor: COLORS.SECONDARY,
    borderWidth: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: COLORS.TEXT_DARK,
    textAlignVertical: "center",
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    marginVertical: SIZES.MARGIN_SMALL,
  },
  imageWrapper: {
    position: "relative",
    marginRight: SIZES.MARGIN_SMALL,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    padding: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddMachineryScreen;
