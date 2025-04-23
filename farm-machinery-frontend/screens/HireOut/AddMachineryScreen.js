import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
      name: "remarks",
      label: "Remarks",
      type: "text",
      placeholder: "Enter Remarks",
    },
  ],
  Rotavator: [
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
  ],
};

const AddMachineryScreen = ({ navigation }) => {
  const [expandedMachineId, setExpandedMachineId] = useState(null);
  const [formValues, setFormValues] = useState({});

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedMachineId === id) {
      setExpandedMachineId(null);
    } else {
      setExpandedMachineId(id);
      setFormValues({}); // Reset form values when expanding a new machinery
    }
  };

  const handleChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (machineryTitle) => {
    console.log(`Submitting ${machineryTitle} form:`, {
      machineryTitle,
      ...formValues,
    });
    navigation.navigate("AddFarmForMachineryScreen", {
      machineryTitle,
      machineryDetails: formValues,
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
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <Switch
                      trackColor={{ false: "black", true: COLORS.SECONDARY }}
                      thumbColor={
                        formValues[field.name]
                          ? COLORS.PRIMARY
                          : "rgb(63, 106, 143)"
                      }
                      ios_backgroundColor={COLORS.BORDER}
                      value={!!formValues[field.name]}
                      onValueChange={(value) => handleChange(field.name, value)}
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
                      value={formValues[field.name] || ""}
                      onChangeText={(text) => handleChange(field.name, text)}
                    />
                  </View>
                )}
              </View>
            ))}
            <TouchableOpacity
              style={GLOBAL_STYLES.button}
              onPress={() => handleSubmit(item.title)}
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
    backgroundColor: COLORS.INPUT_BG,
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
    color: COLORS.TEXT_DARK,
    marginLeft: SIZES.MARGIN_SMALL,
  },
  icon: {
    marginRight: SIZES.MARGIN_SMALL,
  },
  formContainer: {
    padding: SIZES.PADDING,
    backgroundColor: COLORS.BACKGROUND,
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
    height: 50,
    backgroundColor: COLORS.SECONDARY,
    borderColor: COLORS.SECONDARY,
    borderWidth: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: COLORS.TEXT_DARK,
    textAlignVertical: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddMachineryScreen;
