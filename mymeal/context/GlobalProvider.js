import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, tokenManager } from '../lib/api'; // Update path to match your API file location

const GlobalContext = createContext({
  // User state
  user: null,
  isLogged: false,
  userRole: null,
  loading: true,
  token: null,
  isAuthenticated: false,

  // State setters
  setUser: () => { },
  setIsLogged: () => { },
  setUserRole: () => { },

  // Helper functions
  hasRole: () => false,
  clearAllData: () => { },

  // Auth functions
  SignIn: async () => { },
  SignUp: async () => { },
  logout: async () => { },
});

export const GlobalProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Clear all user data
  const clearAllData = () => {
    setUser(null);
    setUserRole(null);
  };

  // Check for stored token and validate it on app start
  const checkAuthToken = async () => {
    try {
      setLoading(true);

      // Check if token exists
      const hasToken = await tokenManager.hasToken();

      if (!hasToken) {
        setIsLogged(false);
        setToken(null);
        clearAllData();
        return;
      }

      // Get the actual token
      const storedToken = await tokenManager.getToken();

      if (!storedToken) {
        setIsLogged(false);
        setToken(null);
        clearAllData();
        return;
      }

      // Verify token with backend using your existing API
      try {
        const userData = await authAPI.getCurrentUser();
        setToken(storedToken);
        setUser(userData.user);
        setUserRole(userData.user.role);
        setIsLogged(true);
        console.log('User authenticated successfully:', userData.user);
      } catch (error) {
        // Token is invalid, clear it
        console.log('Token validation failed:', error.message);
        await tokenManager.removeToken();
        setIsLogged(false);
        setToken(null);
        clearAllData();
      }
    } catch (error) {
      console.error("Error checking auth token:", error);
      // If there's an error, clear everything
      await tokenManager.removeToken();
      setIsLogged(false);
      setToken(null);
      clearAllData();
    } finally {
      setLoading(false);
    }
  };

  // ==================== AUTH FUNCTIONS ====================

  const handleSignIn = async (email, password) => {
    try {
      setLoading(true);

      // Use your existing authAPI.signIn
      const data = await authAPI.signIn(email, password);

      console.log("SignIn API response:", data);
      // Get the stored token (your API already handles token storage)
      const storedToken = await tokenManager.getToken();
      setToken(storedToken);

      // Set user data
      setUser(data.user);
      setUserRole(data.user.role);
      setIsLogged(true);

      console.log('Login successful in GlobalProvider:', data.user);
      return data;
    } catch (error) {
      console.error("Login failed in GlobalProvider:", error);
      setIsLogged(false);
      setToken(null);
      clearAllData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async ({ email, password, username, role = 'user' }) => {
    try {
      setLoading(true);

      // Use your existing authAPI.signUp with the correct parameter structure
      const data = await authAPI.signUp({ username, email, password, role });

      // Get the stored token (your API already handles token storage)
      if (data.token) {
        const storedToken = await tokenManager.getToken();
        setToken(storedToken);
        setUser(data.user);
        setUserRole(data.user.role);
        setIsLogged(true);
        console.log('Registration successful in GlobalProvider:', data.user);
      }

      return data;
    } catch (error) {
      console.error("Registration failed in GlobalProvider:", error);
      setIsLogged(false);
      setToken(null);
      clearAllData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

      // Use your existing authAPI.logout (it handles both API call and token removal)
      await authAPI.logout();

      // Reset state
      setIsLogged(false);
      setToken(null);
      clearAllData();

      console.log('Logout successful in GlobalProvider');
      return true;
    } catch (error) {
      console.error("Logout failed in GlobalProvider:", error);
      // Clear local data even if API call fails
      setIsLogged(false);
      setToken(null);
      clearAllData();
      throw error;
    } finally {
      setLoading(false);
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
    checkAuthToken();
  }, []);

  const value = {
    // User state
    user,
    isLogged,
    userRole,
    loading,
    token,
    isAuthenticated: isLogged,

    // State setters
    setUser,
    setIsLogged,
    setUserRole,

    // Helper functions
    hasRole,
    clearAllData,

    // Auth functions
    SignIn: handleSignIn,
    SignUp: handleSignUp,
    logout: handleLogout,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);