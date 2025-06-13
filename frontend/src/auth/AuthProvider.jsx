import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [Loading, setLoading] = useState(true);

  const login = (userData, token) => {
    setLoading(true);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      logout();
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, Loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
