import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SIZES, FONTS } from '../../constants/styles';

const MachineryGrid = ({
  machines,
  selectedOperation,
  selectedMachine,
  onMachineSelect,
}) => {
  const { width } = useWindowDimensions();
  const availableWidth = width - SIZES.PADDING * 2;
  const cardWidth = (availableWidth - SIZES.MARGIN_SMALL * 2) / 3;

  const filteredMachines = machines.filter((m) =>
    selectedOperation?.machines?.includes(m.id)
  );

  const renderMachineCard = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.machineCard,
        { width: cardWidth },
        selectedMachine?.id === item.id && styles.selectedMachineCard,
        pressed && styles.machineCardPressed,
      ]}
      onPress={() => {
        onMachineSelect(item);
        Haptics.selectionAsync();
      }}
      accessibilityLabel={item.label}
      accessibilityState={{ selected: selectedMachine?.id === item.id }}
    >
      <View style={styles.cardContent}>
        <Text
          style={[
            styles.machineLabel,
            selectedMachine?.id === item.id && styles.selectedMachineLabel,
          ]}
          numberOfLines={2}
        >
          {item.label}
        </Text>
      </View>
      {selectedMachine?.id === item.id && (
        <View style={styles.selectionIndicator}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={COLORS.ACCENT}
          />
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={styles.section}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionHeader}>Available Machinery</Text>
        <Text style={styles.sectionSubheader}>
          {selectedOperation ? 'Select a machine for your operation' : 'Select an operation type first'}
        </Text>
      </View>
      {selectedOperation ? (
        <FlatList
          data={filteredMachines}
          numColumns={3}
          renderItem={renderMachineCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.machineryGrid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={40}
                color={COLORS.SECONDARY}
              />
              <Text style={styles.emptyStateText}>
                No machinery available for this operation
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="arrow-left-circle-outline"
            size={40}
            color={COLORS.SECONDARY}
          />
          <Text style={styles.emptyStateText}>
            Select an operation type to view available machinery
          </Text>
        </View>
      )}
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
    fontSize: 22,
    color: COLORS.TERTIARY,
    marginBottom: 4,
  },
  sectionSubheader: {
    ...FONTS.REGULAR,
    fontSize: 16,
    color: COLORS.SECONDARY,
  },
  machineryGrid: {
    paddingHorizontal: SIZES.PADDING,
  },
  machineCard: {
    aspectRatio: 3,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    padding: SIZES.PADDING_SM,
    justifyContent: 'center',
    alignItems: 'center',
    margin: SIZES.MARGIN_SMALL / 2,
  },
  machineCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  selectedMachineCard: {
    backgroundColor: COLORS.ACCENT,
    borderWidth: 2,
    borderColor: COLORS.TERTIARY,
    elevation: 4,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  machineLabel: {
    ...FONTS.MEDIUM,
    fontSize: 12,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  selectedMachineLabel: {
    ...FONTS.BOLD,
  },
  machineDescription: {
    ...FONTS.REGULAR,
    fontSize: 10,
    color: COLORS.SECONDARY_LIGHT,
    textAlign: 'center',
    marginTop: 4,
  },
  selectedMachineDescription: {
    color: COLORS.ACCENT_LIGHT,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: SIZES.PADDING,
    backgroundColor: COLORS.SECONDARY_LIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  emptyStateText: {
    ...FONTS.MEDIUM,
    color: COLORS.SECONDARY,
    marginTop: SIZES.MARGIN_SMALL,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default MachineryGrid;