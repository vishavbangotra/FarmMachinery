import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/styles";

const AddTractorForm = ({ machineryTitle }) => {
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    horsepower: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Tractor Form Submitted:", {
      machinery: machineryTitle,
      ...formData,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={formData.location}
          onChangeText={(text) => handleInputChange("location", text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter date (e.g., YYYY-MM-DD)"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={formData.date}
          onChangeText={(text) => handleInputChange("date", text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Horsepower</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter required horsepower"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={formData.horsepower}
          onChangeText={(text) => handleInputChange("horsepower", text)}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: SIZES.MARGIN_LARGE,
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
  submitButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SIZES.MARGIN_MEDIUM,
    paddingHorizontal: SIZES.PADDING,
    borderRadius: SIZES.BORDER_RADIUS,
    alignItems: "center",
    marginTop: SIZES.MARGIN_LARGE,
  },
  submitButtonText: {
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.INPUT_BG,
  },
});

export default AddTractorForm;
