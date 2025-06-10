import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [Loading,setLoading]=useState(true);

  const login = (userData, token) => {
    setLoading(true)
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData); // Don't forget to update state!
    setLoading(false);
  };

  const logout = () => {
    setLoading(true)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      logout();
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login,Loading, logout, isAuthenticated: user !== null }}>
      {children}
    </AuthContext.Provider>
  );
};
