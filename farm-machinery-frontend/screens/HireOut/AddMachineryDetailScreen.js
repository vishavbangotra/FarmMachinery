// screens/AddMachineryDetailScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import DynamicMachineryForm from "../../components/DynamicMachineryForm";

const AddMachineryDetailScreen = ({ route }) => {
  const { machineryTitle } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Add {machineryTitle}</Text>
      <DynamicMachineryForm machineryTitle={machineryTitle} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SIZES.PADDING,
  },
  header: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_LARGE,
    textAlign: "center",
  },
});

export default AddMachineryDetailScreen;
