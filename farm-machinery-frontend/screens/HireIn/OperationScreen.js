import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles"; // Adjust the import path as necessary
import {OPERATIONS} from "../../Info/MachineryInfo"; // Adjust the import path as necessary
const operations = Object.keys(OPERATIONS)

const OperationScreen = ({ navigation }) => {
  const [selectedOperation, setSelectedOperation] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={GLOBAL_STYLES.header}>Select Operation</Text>
      <FlatList
        data={operations}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              GLOBAL_STYLES.tile,
              selectedOperation === item && GLOBAL_STYLES.selectedTile,
            ]}
            onPress={() => setSelectedOperation(item)}
          >
            <Text
              style={[
                GLOBAL_STYLES.tileTitle,
                { padding: 8 },
                selectedOperation === item && GLOBAL_STYLES.selectedTileTitle,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
      <TouchableOpacity
        style={[styles.button, !selectedOperation && styles.buttonDisabled]}
        onPress={() =>
          selectedOperation &&
          navigation.navigate("Machinery", { operation: selectedOperation })
        }
        disabled={!selectedOperation}
      >
        <Text style={styles.buttonText}>Next to Machinery</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.PADDING, // 20
    backgroundColor: COLORS.BACKGROUND, // rgb(245, 246, 241)
  },
  button: {
    backgroundColor: COLORS.PRIMARY, // rgb(76, 175, 80)
    padding: SIZES.PADDING, // 20
    borderRadius: SIZES.BORDER_RADIUS, // 8
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: COLORS.PLACEHOLDER, // rgb(138, 154, 134)
  },
  buttonText: {
    color: COLORS.BACKGROUND, // rgb(245, 246, 241)
    fontSize: SIZES.BUTTON_TEXT, // 18
    fontFamily: FONTS.BOLD, // Platform-specific bold font
  },
});

export default OperationScreen;
