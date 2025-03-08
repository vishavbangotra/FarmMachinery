import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { COLORS, SIZES, FONTS, GLOBAL_STYLES } from "../../constants/styles"; // Adjust the import path as necessary

const DistanceSliderScreen = ({ navigation, route }) => {
  const [distance, setDistance] = useState(0);
  const { machinery } = route.params;

  return (
    <View style={styles.container}>
      <Text style={GLOBAL_STYLES.header}>Search Distance</Text>
      <Text style={styles.distanceText}>{distance} km</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={distance}
        onValueChange={setDistance}
        minimumTrackTintColor={COLORS.PRIMARY} // rgb(76, 175, 80)
        maximumTrackTintColor={COLORS.BORDER} // rgb(164, 191, 166)
        thumbTintColor={COLORS.PRIMARY} // rgb(76, 175, 80)
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("MachinerySearch", {
            machinery,
            distance,
          });
        }}
      >
        <Text style={styles.buttonText}>Confirm</Text>
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
  title: {
    fontSize: SIZES.TITLE, // 32
    fontFamily: FONTS.BOLD, // Platform-specific bold font
    color: COLORS.TEXT, // rgb(51, 51, 51)
    marginBottom: SIZES.MARGIN_LARGE, // 20
  },
  distanceText: {
    fontSize: SIZES.INFO_TEXT, // 16
    fontFamily: FONTS.REGULAR, // Platform-specific regular font
    color: COLORS.TEXT, // rgb(51, 51, 51)
    marginBottom: SIZES.MARGIN_MEDIUM, // 10
  },
  slider: {
    width: "100%",
    height: SIZES.INPUT_HEIGHT, // 50
  },
  button: {
    backgroundColor: COLORS.PRIMARY, // rgb(76, 175, 80)
    padding: SIZES.PADDING, // 20
    borderRadius: SIZES.BORDER_RADIUS, // 8
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.BACKGROUND, // rgb(245, 246, 241)
    fontSize: SIZES.BUTTON_TEXT, // 18
    fontFamily: FONTS.BOLD, // Platform-specific bold font
  },
});

export default DistanceSliderScreen;
