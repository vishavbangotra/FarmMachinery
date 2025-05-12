import axios from 'axios';
import Constants from 'expo-constants';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACES_AUTOCOMPLETE_API_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const PLACES_DETAILS_API_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

const fetchLocationSuggestions = async (query) => {
  if (!query) {
    return [];
  }
  try {
    const response = await axios.get(PLACES_AUTOCOMPLETE_API_URL, {
      params: {
        input: query,
        key: GOOGLE_PLACES_API_KEY,
      },
    });
    if (response.data.status !== 'OK') {
      throw new Error(`Google Places Autocomplete API error: ${response.data.status}`);
    }
    return response.data.predictions;
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    throw error;
  }
};

const fetchPlaceDetails = async (placeId) => {
  if (!placeId) {
    throw new Error('Place ID is required to fetch details.');
  }
  try {
    const response = await axios.get(PLACES_DETAILS_API_URL, {
      params: {
        place_id: placeId,
        key: GOOGLE_PLACES_API_KEY,
      },
    });
    if (response.data.status !== 'OK') {
      throw new Error(`Google Places Details API error: ${response.data.status}`);
    }
    const { lat, lng } = response.data.result.geometry.location;
    return { latitude: lat, longitude: lng };
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

export const locationService = {
  fetchLocationSuggestions,
  fetchPlaceDetails,
};