import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userId, setUserId] = useState(1);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;