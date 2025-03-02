// screens/Home.js
import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/styles";
import { FlatList } from "react-native-gesture-handler";
import Tile from "../components/Tile";

const HireOutScreen = ({ navigation r}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Tile
        title="Add Machinery"
        description="Add a new machinery to your farm"
        icon={<Text>🚜</Text>}
        onPress={() => navigation.navigate("AddMachinery")}
      />
      <Tile
        title="Manage Machinery"
        description="Manage your farm machinery"
        icon={<Text>🔧</Text>}
        onPress={() => navigation.navigate("ManageMachinery")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: SIZES.TITLE,
    fontWeight: FONTS.BOLD,
    color: COLORS.SECONDARY,
  },
});

export default HireOutScreen;
