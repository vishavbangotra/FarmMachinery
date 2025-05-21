import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SIZES, FONTS } from '../../constants/styles';

const OperationSelector = ({ operations, selectedOperation, onOperationSelect }) => {
  const { width } = useWindowDimensions();
  const cardWidth = (width - SIZES.PADDING * 2 - SIZES.MARGIN_SMALL) / 3;

  const operationCardStyle = {
    width: cardWidth,
    aspectRatio: 1.5,
    borderRadius: SIZES.BORDER_RADIUS,
    backgroundColor: COLORS.PRIMARY,
    padding: SIZES.PADDING_SM,
    justifyContent: 'center',
    alignItems: 'center',
    margin: SIZES.MARGIN_SMALL / 2,
  };

  return (
    <View style={styles.section}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionHeader}>Operation Type</Text>
        <Text style={styles.sectionSubheader}>Select the type of farming operation</Text>
      </View>
      <FlatList
        data={operations}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              operationCardStyle,
              selectedOperation?.id === item.id && styles.selectedOperationCard,
              pressed && styles.operationCardPressed,
            ]}
            onPress={() => {
              onOperationSelect(item);
              Haptics.selectionAsync();
            }}
            accessibilityLabel={item.label}
            accessibilityState={{ selected: selectedOperation?.id === item.id }}
          >
            {selectedOperation?.id === item.id && (
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={COLORS.ACCENT}
                style={styles.checkmark}
              />
            )}
            <MaterialCommunityIcons
              name={item.icon} // Assumes operations array includes an 'icon' field
              size={32}
              color={selectedOperation?.id === item.id ? COLORS.PRIMARY : COLORS.BACKGROUND}
            />
            <Text
              style={[
                styles.operationLabel,
                selectedOperation?.id === item.id && styles.selectedOperationLabel,
              ]}
              numberOfLines={2}
            >
              {item.label}
            </Text>
            <Text
              style={[
                styles.operationDescription,
                selectedOperation?.id === item.id && styles.selectedOperationDescription,
              ]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.operationsGrid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: SIZES.MARGIN_LARGE,
  },
  headerContainer: {
    marginBottom: SIZES.MARGIN_MEDIUM,
  },
  sectionHeader: {
    ...FONTS.BOLD,
    fontSize: 22, // Increased for prominence
    color: COLORS.TERTIARY,
    marginBottom: 4,
  },
  sectionSubheader: {
    ...FONTS.REGULAR,
    fontSize: 16, // Increased for distinction
    color: COLORS.SECONDARY,
  },
  operationsGrid: {
    paddingHorizontal: SIZES.PADDING,
  },
  selectedOperationCard: {
    backgroundColor: COLORS.ACCENT,
    borderWidth: 2,
    borderColor: COLORS.TERTIARY, 
    elevation: 4, 
  },
  operationCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8, 
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  operationLabel: {
    ...FONTS.MEDIUM,
    fontSize: 14, 
    color: COLORS.WHITE,
    textAlign: 'center',
    marginTop: 2,
  },
  selectedOperationLabel: {
    ...FONTS.BOLD,
  },
  operationDescription: {
    ...FONTS.REGULAR,
    fontSize: 12, 
    color: COLORS.SECONDARY_LIGHT,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default OperationSelector;