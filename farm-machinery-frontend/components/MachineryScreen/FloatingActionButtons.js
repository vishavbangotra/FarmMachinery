import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/styles';

const FloatingActionButtons = ({ onFarmPress, onFilterPress }) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.fab} onPress={onFarmPress}>
        <MaterialCommunityIcons name="farm" size={24} color={COLORS.WHITE} />
      </Pressable>
      <Pressable style={styles.fab} onPress={onFilterPress}>
        <MaterialCommunityIcons name="filter-variant" size={24} color={COLORS.WHITE} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: SIZES.MARGIN_LARGE,
    right: SIZES.MARGIN_LARGE,
    gap: SIZES.MARGIN_SMALL,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default FloatingActionButtons; 