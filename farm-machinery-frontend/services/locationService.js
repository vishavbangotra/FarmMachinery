import axios from 'axios';
import Constants from 'expo-constants';

const GOOGLE_PLACES_API_KEY = Constants.expoConfig.extra.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACES_AUTOCOMPLETE_API_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const PLACES_DETAILS_API_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

class LocationService {
  /**
   * Fetches location suggestions from the Google Places Autocomplete API.
   * @param {string} query - The search query for locations.
   * @returns {Promise<Array<Object>>} A promise that resolves with an array of location suggestions.
   * @throws {Error} If the API call fails.
   */
  async fetchLocationSuggestions(query) {
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
  }

  /**
   * Fetches place details from the Google Places Details API.
   * @param {string} placeId - The ID of the place to fetch details for.
   * @returns {Promise<{latitude: number, longitude: number}>} A promise that resolves with the latitude and longitude of the place.
   * @throws {Error} If the API call fails.
   */
  async fetchPlaceDetails(placeId) {
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
  }
}

export const locationService = new LocationService();
import axios from 'axios';
import Constants from 'expo-constants';

const GOOGLE_PLACES_API_KEY = Constants.expoConfig.extra.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACES_AUTOCOMPLETE_API_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const PLACES_DETAILS_API_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

/**
 * Fetches location suggestions from the Google Places Autocomplete API.
 * @param {string} query - The search query for locations.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of location suggestions.
 * @throws {Error} If the API call fails.
 */
export const fetchLocationSuggestions = async (query) => {
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

/**
 * Fetches place details from the Google Places Details API.
 * @param {string} placeId - The ID of the place to fetch details for.
 * @returns {Promise<{latitude: number, longitude: number}>} A promise that resolves with the latitude and longitude of the place.
 * @throws {Error} If the API call fails.
 */
export const fetchPlaceDetails = async (placeId) => {
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