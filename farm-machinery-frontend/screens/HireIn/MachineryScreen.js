// screens/MachineryScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles";

const MACHINES = [
  { id: "tractor", label: "Tractor", icon: "tractor" },
  { id: "rotavator", label: "Rotavator", icon: "hammer" },
  { id: "harvester", label: "Harvester", icon: "crop-harvest" },
  { id: "landleveller", label: "Land Leveller", icon: "land-plots" },
  { id: "seeddrill", label: "Seed Drill", icon: "seed" },
];

export default function MachineryScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const onSelectMachine = (id) => {
    Haptics.selectionAsync();
    setSelectedId(id);
  };

  const onChangeStart = (_, date) => {
    setShowStart(false);
    if (date) setStartDate(date);
  };

  const onChangeEnd = (_, date) => {
    setShowEnd(false);
    if (date) setEndDate(date);
  };

   useEffect(() => {
     const today = new Date();
     const yesterday = new Date();
     yesterday.setDate(today.getDate() - 1);
     setStartDate(yesterday);
     setEndDate(today);
   }, []);

  const validRange = startDate && endDate && endDate > startDate;
  const canProceed = selectedId && validRange;
  const format = (d) => d.toLocaleDateString();

  const renderItem = ({ item }) => {
    const selected = item.id === selectedId;
    return (
      <Pressable
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => onSelectMachine(item.id)}
        android_ripple={{ color: COLORS.PRIMARY + "33" }}
        accessibilityRole="button"
        accessibilityLabel={item.label}
      >
        <View style={[styles.iconCircle, selected && styles.iconSelected]}>
          <MaterialCommunityIcons
            name={item.icon}
            size={24}
            color={selected ? COLORS.BACKGROUND : COLORS.TEXT_LIGHT}
          />
        </View>
        <Text style={[styles.cardText, selected && styles.textSelected]}>
          {item.label}
        </Text>
        {selected && (
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={COLORS.ACCENT}
          />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateRow}>
        <Pressable style={styles.dateButton} onPress={() => setShowStart(true)}>
          <MaterialCommunityIcons
            name="calendar-month"
            size={20}
            color={COLORS.SECONDARY}
          />
          <Text style={styles.dateText}>
            {startDate ? format(startDate) : "Start Date"}
          </Text>
        </Pressable>
        <Pressable style={styles.dateButton} onPress={() => setShowEnd(true)}>
          <MaterialCommunityIcons
            name="calendar-range"
            size={20}
            color={COLORS.SECONDARY}
          />
          <Text style={styles.dateText}>
            {endDate ? format(endDate) : "End Date"}
          </Text>
        </Pressable>
      </View>
      {!validRange && startDate && endDate && (
        <Text style={styles.errorText}>End date must be after start date</Text>
      )}

      <FlatList
        data={MACHINES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <Pressable
        style={[GLOBAL_STYLES.button, !canProceed && styles.buttonDisabled]}
        onPress={() =>
          navigation.navigate("Map", {
            machinery: selectedId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          })
        }
        disabled={!canProceed}
      >
        <Text style={GLOBAL_STYLES.buttonText}>Next</Text>
      </Pressable>

      {showStart && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="spinner"
          onChange={onChangeStart}
        />
      )}
      {showEnd && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="spinner"
          onChange={onChangeEnd}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SIZES.PADDING,
  },
  header: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.TEXT_LIGHT,
    textAlign: "center",
    marginBottom: SIZES.MARGIN_LARGE,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.MARGIN_MEDIUM,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
    padding: SIZES.PADDING_SM,
    borderRadius: SIZES.BORDER_RADIUS
  },
  dateText: {
    marginLeft: SIZES.SPACING,
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_LIGHT,
  },
  errorText: {
    color: COLORS.ACCENT,
    fontSize: SIZES.INFO_TEXT,
    marginBottom: SIZES.MARGIN_MEDIUM,
    textAlign: "center",
  },
  list: {
    paddingBottom: SIZES.MARGIN_LARGE,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SECONDARY,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING,
    marginVertical: SIZES.SPACING,
  },
  cardSelected: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ACCENT,
    backgroundColor: COLORS.SECONDARY + "CC",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.MARGIN_MEDIUM,
  },
  iconSelected: {
    backgroundColor: COLORS.ACCENT,
  },
  cardText: {
    flex: 1,
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.TEXT_LIGHT,
  },
  textSelected: {
    color: COLORS.TEXT_LIGHT,
    fontFamily: FONTS.MEDIUM,
  },
  buttonDisabled: {
    backgroundColor: COLORS.TEXT_DARK,
  },
});
