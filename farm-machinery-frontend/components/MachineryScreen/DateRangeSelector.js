import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/styles';

const DateRangeSelector = ({
  startDate,
  endDate,
  dateError,
  onStartDatePress,
  onEndDatePress,
}) => {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Date Range</Text>
      <View style={styles.dateContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.dateInput,
            pressed && styles.dateInputPressed
          ]} 
          onPress={onStartDatePress}
        >
          <MaterialCommunityIcons
            name="calendar-start"
            size={20}
            color={COLORS.PRIMARY}
          />
          <View style={styles.dateTextContainer}>
            <Text style={styles.dateLabel}>Start Date</Text>
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          </View>
        </Pressable>

        <View style={styles.dateSeparatorContainer}>
          <View style={styles.dateSeparatorLine} />
          <Text style={styles.dateSeparator}>to</Text>
          <View style={styles.dateSeparatorLine} />
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.dateInput,
            pressed && styles.dateInputPressed
          ]} 
          onPress={onEndDatePress}
        >
          <MaterialCommunityIcons
            name="calendar-end"
            size={20}
            color={COLORS.PRIMARY}
          />
          <View style={styles.dateTextContainer}>
            <Text style={styles.dateLabel}>End Date</Text>
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </View>
        </Pressable>
      </View>
      {dateError && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={16}
            color={COLORS.ERROR}
          />
          <Text style={styles.errorText}>End date must be after start date</Text>
        </View>
      )}
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
  dateContainer: {
    backgroundColor: COLORS.SECONDARY_LIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.PADDING_SM,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS,
    marginVertical: SIZES.MARGIN_SMALL,
  },
  dateInputPressed: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  dateTextContainer: {
    marginLeft: SIZES.MARGIN_SMALL,
    flex: 1,
  },
  dateLabel: {
    ...FONTS.REGULAR,
    fontSize: 12,
    color: COLORS.SECONDARY,
    marginBottom: 2,
  },
  dateText: {
    ...FONTS.MEDIUM,
    color: COLORS.TEXT,
  },
  dateSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.MARGIN_SMALL,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.SECONDARY,
    marginHorizontal: SIZES.MARGIN_SMALL,
  },
  dateSeparator: {
    ...FONTS.MEDIUM,
    color: COLORS.SECONDARY,
    marginHorizontal: SIZES.MARGIN_SMALL,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ERROR_LIGHT,
    padding: SIZES.PADDING_SM,
    borderRadius: SIZES.BORDER_RADIUS,
    marginTop: SIZES.MARGIN_SMALL,
  },
  errorText: {
    ...FONTS.MEDIUM,
    color: COLORS.ERROR,
    marginLeft: SIZES.MARGIN_SMALL,
    fontSize: 12,
  },
});

export default DateRangeSelector; 