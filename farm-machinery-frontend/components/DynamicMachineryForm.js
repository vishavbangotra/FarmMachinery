// components/DynamicMachineryForm.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
    Switch,
} from "react-native";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../constants/styles";
import myMachinery from "../dummy_data/myMachinery";
import MachinerySchema from "../schemas/MachinerySchema";

const machinerySchemas = {
  Tractor: [
    {
      name: "horsepower",
      label: "Horse Power",
      type: "number",
      placeholder: "Enter horsepower",
    },
    {
        name: "is4x4",
        label: "4x4 Capability",
        type: "switch",
    },
    {
      name: "engineType",
      label: "Engine Type",
      type: "text",
      placeholder: "Enter engine type",
    },
    // Add more Tractor-specific fields here
  ],
  Combine: [
    {
      name: "capacity",
      label: "Capacity",
      type: "number",
      placeholder: "Enter capacity",
    },
    {
      name: "cuttingWidth",
      label: "Cutting Width",
      type: "number",
      placeholder: "Enter cutting width",
    },
    // Add more Combine-specific fields here
  ],
  Drone: [
    {
      name: "flightTime",
      label: "Flight Time (min)",
      type: "number",
      placeholder: "Enter flight time",
    },
    {
      name: "range",
      label: "Range (meters)",
      type: "number",
      placeholder: "Enter range",
    },
    // Add more Drone-specific fields here
  ],
};

const DynamicMachineryForm = ({ machineryTitle, onSubmit }) => {
  const schema = machinerySchemas[machineryTitle] || [];
  const [formValues, setFormValues] = useState({});

  const handleChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(`Submitting ${machineryTitle} form:`, formValues);
    if (onSubmit) {
      onSubmit(formValues);
    }
  };

  return (
    <View style={styles.formContainer}>
      {schema.map((field, index) => (
        <View key={index} style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel]}>{field.label}</Text>
          {field.type === "switch" ? (
            <Switch
                trackColor={{ false: COLORS.BORDER, true: COLORS.PRIMARY }}
                thumbColor={COLORS.INPUT_BG}
                ios_backgroundColor={COLORS.BORDER}
                value={!!formValues[field.name]}
                onValueChange={(value) => handleChange(field.name, value)}
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              keyboardType={field.type === "number" ? "numeric" : "default"}
              value={formValues[field.name] || ""}
              onChangeText={(text) => handleChange(field.name, text)}
            />
          )}
        </View>
      ))}
      <TouchableOpacity style={GLOBAL_STYLES.button} onPress={handleSubmit}>
        <Text style={styles.buttonText} >Submit {machineryTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    borderColor: COLORS.BORDER,
    borderWidth: 2,
    borderShadow: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: .2,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    marginBottom: 4,
    fontWeight: "bold",
    color: COLORS.SECONDARY,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DynamicMachineryForm;

