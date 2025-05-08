import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignIn, SignUp, getCurrentUser, getUserRoles, logout } from '../lib/api';

const GlobalContext = createContext({
  user: null,
  isLogged: false,
  userRole: null,
  loading: true,
  setUser: () => { },
  setIsLogged: () => { },
  setUserRole: () => { },
  hasRole: () => false,
  fetchUserData: async () => { },
  SignIn: async () => { },
  logout: async () => { },
  SignUp: async () => { },
  isAuthenticated: false
});

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Set auth token globally for API requests
  useEffect(() => {
    if (token) {
      global.authToken = token;
    } else {
      global.authToken = null;
    }
  }, [token]);

  // Main fetch function (used on login and app reload)
  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Check for stored token
      const storedToken = await AsyncStorage.getItem('authToken');

      if (!storedToken) {
        setIsLogged(false);
        setUser(null);
        setUserRole(null);
        setToken(null);
        return;
      }

      setToken(storedToken);

      // Fetch current user data
      const userData = await getCurrentUser();
      const userRole = await getUserRoles();

      setUser(userData);
      setUserRole(userRole);
      setIsLogged(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // If token is invalid, clear everything
      await AsyncStorage.removeItem('authToken');
      setIsLogged(false);
      setUser(null);
      setUserRole(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const handleSignIn = async (email, password) => {
    try {
      const data = await SignIn(email, password);

      // Store token
      await AsyncStorage.setItem('authToken', data.token);
      setToken(data.token);

      // Set user data
      setUser(data.user);
      setUserRole(data.user.role);
      setIsLogged(true);

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      // Call logout API
      await logout();

      // Clear stored token
      await AsyncStorage.removeItem('authToken');

      // Reset state
      setUser(null);
      setUserRole(null);
      setIsLogged(false);
      setToken(null);

      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  // Register function
  const handleSignUp = async (username, email, password, role = 'user') => {
    try {
      const result = await SignUp(username, email, password, role);

      // Automatically log in after registration
      await AsyncStorage.setItem('authToken', result.token);
      setToken(result.token);

      // Set user data
      setUser(result.user);
      setUserRole(result.user.role);
      setIsLogged(true);

      return result;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Role check helper
  const hasRole = (roleOrRoles) => {
    if (!userRole) return false;

    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.includes(userRole);
    }

    return userRole === roleOrRoles;
  };

  // Check for token on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const value = {
    user,
    userRole,
    isLogged,
    isAuthenticated: isLogged, // Alias for isLogged
    loading,
    token,
    setUser,
    setUserRole,
    setIsLogged,
    hasRole,
    fetchUserData,
    SignIn: handleSignIn,
    handleLogout,  // Add this line to expose handleLogout directly
    logout: handleLogout,
    SignUp: handleSignUp
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);