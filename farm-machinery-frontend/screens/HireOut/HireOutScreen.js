// screens/Home.js
import React from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "../../constants/styles";

const TILES = [
  {
    id: "add",
    title: "Add Machinery",
    description: "Add a new machinery to your farm",
    iconName: "tractor",
    screen: "AddMachinery",
  },
  {
    id: "manage",
    title: "Manage Machinery",
    description: "Manage your farm machinery",
    iconName: "wrench",
    screen: "ManageMachinery",
  },
  {
    id: "bookings",
    title: "Bookings",
    description: "View your bookings",
    iconName: "calendar",
    screen: "BookingList",
  },
  {
    id: "farms",
    title: "Farms",
    description: "View your Farms",
    iconName: "farm",
    screen: "Farm",
  },
];

const HomeScreen = ({ navigation }) => {
  const renderTile = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate(item.screen)}
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      android_ripple={{ color: COLORS.RIPPLE }}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.description}`}
    >
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name={item.iconName}
          size={32}
          color={COLORS.WHITE}
        />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={TILES}
        keyExtractor={(item) => item.id}
        renderItem={renderTile}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  listContainer: {
    padding: SIZES.PADDING,
  },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SECONDARY,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING,
    marginBottom: SIZES.MARGIN_MEDIUM,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  tilePressed: {
    opacity: 0.7,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.MARGIN_MEDIUM,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.H2,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT_DARK,
    marginBottom: 4,
  },
  description: {
    fontSize: SIZES.BODY,
    fontWeight: 800,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_DARK,
  },
});

export default HomeScreen;
