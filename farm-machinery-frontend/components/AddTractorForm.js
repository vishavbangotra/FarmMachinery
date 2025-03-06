import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { COLORS, SIZES, FONTS } from "../constants/styles"; // Adjust path as needed

const AddTractorForm = ({ machineryTitle }) => {
  const [formData, setFormData] = useState({
    model: "",
    is4x4: false,
    horsepower: "",
    image: null,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (image) => {
    setFormData((prev) => ({ ...prev, image }));
  };

  const handleSubmit = () => {
    if (!formData.model || !formData.horsepower) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Model and Horsepower)"
      );
      return;
    }
    console.log("Tractor Form Submitted:", {
      machinery: machineryTitle,
      ...formData,
    });
    // Add your submission logic here (e.g., API call)
  };

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access the photo library is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const source = { uri: result.assets[0].uri };
      handleImageChange(source);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      {/* Model Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Model *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter model"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={formData.model}
          onChangeText={(text) => handleInputChange("model", text)}
        />
      </View>

      {/* 4x4 Switch */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>4x4 Capability</Text>
        <Switch
          trackColor={{ false: COLORS.BORDER, true: COLORS.PRIMARY }}
          thumbColor={COLORS.INPUT_BG}
          ios_backgroundColor={COLORS.BORDER}
          onValueChange={(value) => handleInputChange("is4x4", value)}
          value={formData.is4x4}
        />
      </View>

      {/* Horsepower Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Horsepower *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter horsepower"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={formData.horsepower}
          onChangeText={(text) => handleInputChange("horsepower", text)}
          keyboardType="numeric"
        />
      </View>

      {/* Image Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Image</Text>
        {formData.image ? (
          <Image source={formData.image} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>No image selected</Text>
        )}
        <TouchableOpacity onPress={openImagePicker}>
          <Text style={styles.selectImageText}>Select Image</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!formData.model || !formData.horsepower) &&
            styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!formData.model || !formData.horsepower}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  formContainer: {
    paddingBottom: SIZES.MARGIN_LARGE,
    backgroundColor: COLORS.BACKGROUND,
  },
  inputContainer: {
    marginBottom: SIZES.MARGIN_LARGE,
  },
  label: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.SECONDARY,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  input: {
    backgroundColor: COLORS.INPUT_BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.MARGIN_MEDIUM,
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: SIZES.BORDER_RADIUS,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  placeholderText: {
    fontSize: SIZES.INFO_TEXT,
    color: COLORS.PLACEHOLDER,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  selectImageText: {
    fontSize: SIZES.INFO_TEXT,
    color: COLORS.PRIMARY,
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SIZES.MARGIN_MEDIUM,
    paddingHorizontal: SIZES.PADDING,
    borderRadius: SIZES.BORDER_RADIUS,
    alignItems: "center",
    marginTop: SIZES.MARGIN_LARGE,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.PLACEHOLDER,
  },
  submitButtonText: {
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.INPUT_BG,
  },
};

export default AddTractorForm;
