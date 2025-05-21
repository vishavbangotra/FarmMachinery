import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome as Icon } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, SIZES, FONTS } from '../../constants/styles';

const FarmModal = ({
  visible,
  farms,
  selectedFarm,
  isAddingFarm,
  farmTitle,
  locationSearch,
  locationSuggestions,
  selectedLocation,
  isSaving,
  onClose,
  onFarmSelect,
  onFarmTitleChange,
  onLocationSearchChange,
  onLocationSelect,
  onSaveFarm,
  onAddFarmPress,
  onDeleteFarm,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isAddingFarm ? 'Add New Farm' : 'Your Farms'}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.TEXT} />
            </Pressable>
          </View>

          {isAddingFarm ? (
            <View style={styles.addFarmContainer}>
              <TextInput
                style={styles.input}
                placeholder="Farm Title"
                value={farmTitle}
                onChangeText={onFarmTitleChange}
              />
              <TextInput
                style={styles.input}
                placeholder="Search Location"
                value={locationSearch}
                onChangeText={onLocationSearchChange}
              />

              {locationSuggestions.length > 0 && (
                <FlatList
                  data={locationSuggestions}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => onLocationSelect(item)}
                    >
                      <Text style={styles.suggestionText}>
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}

              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {selectedLocation && <Marker coordinate={selectedLocation} />}
              </MapView>

              <Pressable
                style={styles.saveButton}
                onPress={onSaveFarm}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Farm</Text>
                )}
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.farmsList}>
                {farms.map((farm) => (
                  <Pressable
                    key={farm.id}
                    style={[
                      styles.farmItem,
                      selectedFarm?.id === farm.id && styles.selectedFarmItem,
                    ]}
                    onPress={() => onFarmSelect(farm)}
                  >
                    <MaterialCommunityIcons
                      name="farm"
                      size={24}
                      color={selectedFarm?.id === farm.id ? COLORS.PRIMARY : COLORS.TEXT}
                    />
                    <View style={styles.farmInfo}>
                      <Text
                        style={[
                          styles.farmName,
                          selectedFarm?.id === farm.id && styles.selectedFarmName,
                        ]}
                      >
                        {farm.title}
                      </Text>
                      <Text style={styles.farmLocation}>
                        {farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}
                      </Text>
                    </View>
                    {selectedFarm?.id === farm.id && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color={COLORS.PRIMARY}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.addButton} onPress={onAddFarmPress}>
                <Text style={styles.addButtonText}>Add New Farm</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: SIZES.BORDER_RADIUS * 2,
    borderTopRightRadius: SIZES.BORDER_RADIUS * 2,
    padding: SIZES.PADDING,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.MARGIN_LARGE,
  },
  modalTitle: {
    ...FONTS.BOLD,
    fontSize: 20,
    color: COLORS.TERTIARY,
  },
  closeButton: {
    padding: SIZES.PADDING_SM,
  },
  addFarmContainer: {
    gap: SIZES.MARGIN_SMALL,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
    ...FONTS.REGULAR,
  },
  suggestionItem: {
    padding: SIZES.PADDING_SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SECONDARY,
  },
  suggestionText: {
    ...FONTS.REGULAR,
    color: COLORS.TEXT,
  },
  map: {
    height: 200,
    borderRadius: SIZES.BORDER_RADIUS,
    marginVertical: SIZES.MARGIN_SMALL,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
    alignItems: 'center',
  },
  saveButtonText: {
    ...FONTS.BOLD,
    color: COLORS.BACKGROUND,
  },
  farmsList: {
    gap: SIZES.MARGIN_SMALL,
  },
  farmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.PADDING_SM,
    backgroundColor: COLORS.SECONDARY_LIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  selectedFarmItem: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  farmInfo: {
    flex: 1,
    marginLeft: SIZES.MARGIN_SMALL,
  },
  farmName: {
    ...FONTS.MEDIUM,
    color: COLORS.TERTIARY,
  },
  selectedFarmName: {
    color: COLORS.PRIMARY,
  },
  farmLocation: {
    ...FONTS.REGULAR,
    color: COLORS.TEXT,
    fontSize: 12,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_SM,
    alignItems: 'center',
    marginTop: SIZES.MARGIN_SMALL,
  },
  addButtonText: {
    ...FONTS.BOLD,
    color: COLORS.BACKGROUND,
  },
});

export default FarmModal; 