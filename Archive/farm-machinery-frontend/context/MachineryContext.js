import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants/config";

import { useAuth } from "./AuthContext";

// Create the context
const MachineryContext = createContext();

// Context Provider
export function MachineryProvider({ children }) {
  const { token } = useAuth();
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all machinery
  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/machinery`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMachinery(response.data);
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby machinery
  const fetchNearbyMachinery = async (latitude, longitude, radius = 50) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/machinery/nearby`, {
        params: { lat: latitude, lng: longitude, radius },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMachinery(response.data);
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new machinery
  const addMachinery = async (newMachinery) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/machinery`,
        newMachinery,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMachinery((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      setError(error.response?.data || error.message);
      throw error;
    }
  };

  // Update machinery
  const updateMachinery = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/machinery/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMachinery((prev) =>
        prev.map((item) => (item.id === id ? response.data : item))
      );
    } catch (error) {
      setError(error.response?.data || error.message);
      throw error;
    }
  };

  // Delete machinery
  const deleteMachinery = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/machinery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMachinery((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.response?.data || error.message);
      throw error;
    }
  };

  // Get machinery by ID
  const getMachineryById = (id) => {
    return machinery.find((item) => item.id === id);
  };

  return (
    <MachineryContext.Provider
      value={{
        machinery,
        loading,
        error,
        fetchMachinery,
        fetchNearbyMachinery,
        addMachinery,
        updateMachinery,
        deleteMachinery,
        getMachineryById,
      }}
    >
      {children}
    </MachineryContext.Provider>
  );
}

// Custom hook to use MachineryContext
export function useMachinery() {
  const context = useContext(MachineryContext);
  if (!context) {
    throw new Error("useMachinery must be used within a MachineryProvider");
  }
  return context;
}
