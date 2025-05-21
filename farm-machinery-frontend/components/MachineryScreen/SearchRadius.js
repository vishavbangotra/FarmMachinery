import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/styles';

const SearchRadius = ({ distance, onDistanceChange }) => {
  const getDistanceLabel = (value) => {
    if (value < 10) return 'Very Close';
    if (value < 25) return 'Close';
    if (value < 50) return 'Moderate';
    if (value < 75) return 'Far';
    return 'Very Far';
  };

  const getDistanceColor = (value) => {
    if (value < 10) return COLORS.SUCCESS;
    if (value < 25) return COLORS.PRIMARY;
    if (value < 50) return COLORS.SECONDARY;
    if (value < 75) return COLORS.WARNING;
    return COLORS.ERROR;
  };

  const presetDistances = [10, 25, 50, 75, 100];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Search Radius</Text>
      <View style={styles.sliderContainer}>
        <MaterialCommunityIcons
          name="map-marker-distance"
          size={24}
          color={getDistanceColor(distance)}
        />
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={distance}
            onValueChange={onDistanceChange}
            minimumTrackTintColor={getDistanceColor(distance)}
            maximumTrackTintColor={COLORS.SECONDARY}
            thumbTintColor={getDistanceColor(distance)}
          />
          <View style={styles.presetContainer}>
            {presetDistances.map((preset) => (
              <Pressable
                key={preset}
                style={[
                  styles.presetButton,
                  distance === preset && styles.presetButtonActive,
                  { borderColor: getDistanceColor(preset) }
                ]}
                onPress={() => onDistanceChange(preset)}
              >
                <Text style={[
                  styles.presetText,
                  { color: getDistanceColor(preset) }
                ]}>
                  {preset}km
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.distanceInfo}>
          <Text style={[styles.distanceText, { color: getDistanceColor(distance) }]}>
            {distance} km
          </Text>
          <Text style={[styles.distanceLabel, { color: getDistanceColor(distance) }]}>
            {getDistanceLabel(distance)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: SIZES.MARGIN_LARGE,
  },
  sectionHeader: {
    ...FONTS.BOLD,
    fontSize: 18,
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_MEDIUM,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY_LIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: SIZES.MARGIN_SMALL,
  },
  slider: {
    height: 40,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.MARGIN_SMALL,
  },
  presetButton: {
    paddingHorizontal: SIZES.PADDING_SM,
    paddingVertical: 4,
    borderRadius: SIZES.BORDER_RADIUS,
    borderWidth: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  presetButtonActive: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  presetText: {
    ...FONTS.MEDIUM,
    fontSize: 12,
  },
  distanceInfo: {
    alignItems: 'center',
    minWidth: 80,
  },
  distanceText: {
    ...FONTS.BOLD,
    fontSize: 16,
  },
  distanceLabel: {
    ...FONTS.REGULAR,
    fontSize: 12,
    marginTop: 2,
  },
});

export default SearchRadius; 