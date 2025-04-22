import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);

  // Helper function to check if token is expired
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");
        if (token && isTokenValid(token)) {
          setIsAuthenticated(true);
          const decoded = jwtDecode(token);
          setPhoneNumber(decoded.sub);
        } else {
          // If the token is not present or is invalid/expired, ensure state is reset
          setIsAuthenticated(false);
          setPhoneNumber(null);
          await SecureStore.deleteItemAsync("jwt");
        }
      } catch (error) {
        console.error("Error checking token from SecureStore:", error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, phoneNumber }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
