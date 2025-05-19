

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, authAPI, userAPI, adminAPI, nutritionistAPI, mealPlanAPI, trackingAPI, foodAPI, utilityAPI } from '../lib/api';

const GlobalContext = createContext({
  // User state
  user: null,
  isLogged: false,
  userRole: null,
  loading: true,
  token: null,

  // User profile data
  userProfile: null,
  userAllergies: [],
  healthProfile: null,

  // Meal plans and tracking
  userMealPlans: [],
  mealLogs: [],
  weightHistory: [],
  waterLogs: [],
  progressData: null,

  // Admin/Nutritionist data
  dashboardData: null,
  clients: [],
  templates: [],
  mealPlans: [],

  // State setters
  setUser: () => { },
  setIsLogged: () => { },
  setUserRole: () => { },
  setUserProfile: () => { },
  setUserAllergies: () => { },
  setHealthProfile: () => { },
  setUserMealPlans: () => { },
  setMealLogs: () => { },
  setWeightHistory: () => { },
  setWaterLogs: () => { },
  setProgressData: () => { },
  setDashboardData: () => { },
  setClients: () => { },
  setTemplates: () => { },
  setMealPlans: () => { },

  // Helper functions
  hasRole: () => false,
  isAuthenticated: false,
  refreshUserData: async () => { },
  clearAllData: () => { },

  // Auth functions
  SignIn: async () => { },
  SignUp: async () => { },
  logout: async () => { },

  // User API functions
  getUserProfile: async () => { },
  updateUserProfile: async () => { },
  addAllergies: async () => { },
  getUserAllergies: async () => { },
  removeAllergy: async () => { },
  getUserMealPlans: async () => { },
  getHealthProfile: async () => { },
  updateHealthProfile: async () => { },

  // Admin API functions
  getAdminDashboard: async () => { },
  getUsers: async () => { },
  getUserById: async () => { },
  updateUserRole: async () => { },
  approveNutritionist: async () => { },
  rejectNutritionist: async () => { },
  getPendingNutritionists: async () => { },
  deleteUser: async () => { },
  getSystemStats: async () => { },

  // Nutritionist API functions
  getNutritionistDashboard: async () => { },
  getClients: async () => { },
  getClientById: async () => { },
  createMealPlanTemplate: async () => { },
  getTemplates: async () => { },
  updateTemplate: async () => { },
  deleteTemplate: async () => { },
  createMealPlan: async () => { },
  getNutritionistMealPlans: async () => { },
  assignMealPlan: async () => { },
  getClientProgress: async () => { },
  addClientNotes: async () => { },

  // Meal Plan API functions
  getMealPlan: async () => { },
  updateMealPlan: async () => { },
  getMeals: async () => { },
  addMeal: async () => { },
  updateMeal: async () => { },
  deleteMeal: async () => { },
  getMealPlanNutrition: async () => { },

  // Tracking API functions
  logMeal: async () => { },
  getMealLogs: async () => { },
  updateMealLog: async () => { },
  deleteMealLog: async () => { },
  logWeight: async () => { },
  getWeightHistory: async () => { },
  logWater: async () => { },
  getWaterLogs: async () => { },
  getProgress: async () => { },
  getNutritionSummary: async () => { },
  getComplianceReport: async () => { },

  // Food API functions
  searchFoods: async () => { },
  getFoodById: async () => { },
  getFoodNutrition: async () => { },
  addCustomFood: async () => { },
  getCustomFoods: async () => { },
  updateCustomFood: async () => { },
  deleteCustomFood: async () => { },

  // Utility functions
  testConnection: async () => { },
  uploadFile: async () => { },
});

export const GlobalProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // User data state
  const [userProfile, setUserProfile] = useState(null);
  const [userAllergies, setUserAllergies] = useState([]);
  const [healthProfile, setHealthProfile] = useState(null);

  // Meal plans and tracking state
  const [userMealPlans, setUserMealPlans] = useState([]);
  const [mealLogs, setMealLogs] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [waterLogs, setWaterLogs] = useState([]);
  const [progressData, setProgressData] = useState(null);

  // Admin/Nutritionist state
  const [dashboardData, setDashboardData] = useState(null);
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);

  // Set auth token globally for API requests
  useEffect(() => {
    if (token) {
      global.authToken = token;
    } else {
      global.authToken = null;
    }
  }, [token]);

  // Clear all user data
  const clearAllData = () => {
    setUser(null);
    setUserRole(null);
    setUserProfile(null);
    setUserAllergies([]);
    setHealthProfile(null);
    setUserMealPlans([]);
    setMealLogs([]);
    setWeightHistory([]);
    setWaterLogs([]);
    setProgressData(null);
    setDashboardData(null);
    setClients([]);
    setTemplates([]);
    setMealPlans([]);
  };

  // Main fetch function (used on login and app reload)
  const refreshUserData = async () => {
    try {
      setLoading(true);

      // Check for stored token
      const storedToken = await AsyncStorage.getItem('authToken');

      if (!storedToken) {
        setIsLogged(false);
        setToken(null);
        clearAllData();
        return;
      }

      setToken(storedToken);

      // Fetch current user data
      const userData = await authAPI.getCurrentUser();

      setUser(userData.user);
      setUserRole(userData.user.role);
      setIsLogged(true);

      // Fetch additional user data based on role
      try {
        const profile = await userAPI.getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.log("Profile not available yet");
      }

      try {
        const allergies = await userAPI.getUserAllergies();
        setUserAllergies(allergies);
      } catch (error) {
        console.log("Allergies not available");
      }

      try {
        const health = await userAPI.getHealthProfile();
        setHealthProfile(health);
      } catch (error) {
        console.log("Health profile not available");
      }

      try {
        const plans = await userAPI.getMealPlans();
        setUserMealPlans(plans);
      } catch (error) {
        console.log("Meal plans not available");
      }

    } catch (error) {
      console.error("Error fetching user data:", error);
      // If token is invalid, clear everything
      await AsyncStorage.removeItem('authToken');
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
      const data = await authAPI.signIn(email, password);

      // Store token
      await AsyncStorage.setItem('authToken', data.token);
      setToken(data.token);

      // Set user data
      setUser(data.user);
      setUserRole(data.user.role);
      setIsLogged(true);

      // Fetch additional user data
      await refreshUserData();

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (userData) => {
    try {
      setLoading(true);
      const result = await authAPI.signUp(userData);

      // Store token
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

      // Call logout API
      await authAPI.logout();

      // Clear stored token
      await AsyncStorage.removeItem('authToken');

      // Reset state
      setIsLogged(false);
      setToken(null);
      clearAllData();

      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      // Clear local data even if API call fails
      await AsyncStorage.removeItem('authToken');
      setIsLogged(false);
      setToken(null);
      clearAllData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==================== USER API FUNCTIONS ====================

  const getUserProfile = async () => {
    try {
      const profile = await userAPI.getProfile();
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error("Get user profile error:", error);
      throw error;
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const updatedProfile = await userAPI.updateProfile(profileData);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error("Update user profile error:", error);
      throw error;
    }
  };

  const addAllergies = async (allergies) => {
    try {
      const result = await userAPI.addAllergies(allergies);
      await getUserAllergies(); // Refresh allergies list
      return result;
    } catch (error) {
      console.error("Add allergies error:", error);
      throw error;
    }
  };

  const getUserAllergies = async () => {
    try {
      const allergies = await userAPI.getUserAllergies();
      setUserAllergies(allergies);
      return allergies;
    } catch (error) {
      console.error("Get user allergies error:", error);
      throw error;
    }
  };

  const removeAllergy = async (allergyId) => {
    try {
      const result = await userAPI.removeAllergy(allergyId);
      await getUserAllergies(); // Refresh allergies list
      return result;
    } catch (error) {
      console.error("Remove allergy error:", error);
      throw error;
    }
  };

  const getUserMealPlans = async () => {
    try {
      const plans = await userAPI.getMealPlans();
      setUserMealPlans(plans);
      return plans;
    } catch (error) {
      console.error("Get user meal plans error:", error);
      throw error;
    }
  };

  const getHealthProfile = async () => {
    try {
      const health = await userAPI.getHealthProfile();
      setHealthProfile(health);
      return health;
    } catch (error) {
      console.error("Get health profile error:", error);
      throw error;
    }
  };

  const updateHealthProfile = async (healthData) => {
    try {
      const updatedHealth = await userAPI.updateHealthProfile(healthData);
      setHealthProfile(updatedHealth);
      return updatedHealth;
    } catch (error) {
      console.error("Update health profile error:", error);
      throw error;
    }
  };

  // ==================== ADMIN API FUNCTIONS ====================

  const getAdminDashboard = async () => {
    try {
      const dashboard = await adminAPI.getDashboard();
      setDashboardData(dashboard);
      return dashboard;
    } catch (error) {
      console.error("Get admin dashboard error:", error);
      throw error;
    }
  };

  const getUsers = async (page = 1, limit = 10, search = '') => {
    try {
      return await adminAPI.getUsers(page, limit, search);
    } catch (error) {
      console.error("Get users error:", error);
      throw error;
    }
  };

  const getUserById = async (userId) => {
    try {
      return await adminAPI.getUserById(userId);
    } catch (error) {
      console.error("Get user by ID error:", error);
      throw error;
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      return await adminAPI.updateUserRole(userId, role);
    } catch (error) {
      console.error("Update user role error:", error);
      throw error;
    }
  };

  const approveNutritionist = async (nutritionistId) => {
    try {
      return await adminAPI.approveNutritionist(nutritionistId);
    } catch (error) {
      console.error("Approve nutritionist error:", error);
      throw error;
    }
  };

  const rejectNutritionist = async (nutritionistId, reason) => {
    try {
      return await adminAPI.rejectNutritionist(nutritionistId, reason);
    } catch (error) {
      console.error("Reject nutritionist error:", error);
      throw error;
    }
  };

  const getPendingNutritionists = async () => {
    try {
      return await adminAPI.getPendingNutritionists();
    } catch (error) {
      console.error("Get pending nutritionists error:", error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      return await adminAPI.deleteUser(userId);
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  };

  const getSystemStats = async () => {
    try {
      return await adminAPI.getSystemStats();
    } catch (error) {
      console.error("Get system stats error:", error);
      throw error;
    }
  };

  // ==================== NUTRITIONIST API FUNCTIONS ====================

  const getNutritionistDashboard = async () => {
    try {
      const dashboard = await nutritionistAPI.getDashboard();
      setDashboardData(dashboard);
      return dashboard;
    } catch (error) {
      console.error("Get nutritionist dashboard error:", error);
      throw error;
    }
  };

  const getClients = async () => {
    try {
      const clientsList = await nutritionistAPI.getClients();
      setClients(clientsList);
      return clientsList;
    } catch (error) {
      console.error("Get clients error:", error);
      throw error;
    }
  };

  const getClientById = async (clientId) => {
    try {
      return await nutritionistAPI.getClientById(clientId);
    } catch (error) {
      console.error("Get client by ID error:", error);
      throw error;
    }
  };

  const createMealPlanTemplate = async (templateData) => {
    try {
      const newTemplate = await nutritionistAPI.createMealPlanTemplate(templateData);
      await getTemplates(); // Refresh templates list
      return newTemplate;
    } catch (error) {
      console.error("Create meal plan template error:", error);
      throw error;
    }
  };

  const getTemplates = async () => {
    try {
      const templatesList = await nutritionistAPI.getTemplates();
      setTemplates(templatesList);
      return templatesList;
    } catch (error) {
      console.error("Get templates error:", error);
      throw error;
    }
  };

  const updateTemplate = async (templateId, templateData) => {
    try {
      const updatedTemplate = await nutritionistAPI.updateTemplate(templateId, templateData);
      await getTemplates(); // Refresh templates list
      return updatedTemplate;
    } catch (error) {
      console.error("Update template error:", error);
      throw error;
    }
  };

  const deleteTemplate = async (templateId) => {
    try {
      const result = await nutritionistAPI.deleteTemplate(templateId);
      await getTemplates(); // Refresh templates list
      return result;
    } catch (error) {
      console.error("Delete template error:", error);
      throw error;
    }
  };

  const createMealPlan = async (mealPlanData) => {
    try {
      const newPlan = await nutritionistAPI.createMealPlan(mealPlanData);
      await getNutritionistMealPlans(); // Refresh meal plans list
      return newPlan;
    } catch (error) {
      console.error("Create meal plan error:", error);
      throw error;
    }
  };

  const getNutritionistMealPlans = async () => {
    try {
      const plansList = await nutritionistAPI.getMealPlans();
      setMealPlans(plansList);
      return plansList;
    } catch (error) {
      console.error("Get nutritionist meal plans error:", error);
      throw error;
    }
  };

  const assignMealPlan = async (userId, mealPlanId) => {
    try {
      return await nutritionistAPI.assignMealPlan(userId, mealPlanId);
    } catch (error) {
      console.error("Assign meal plan error:", error);
      throw error;
    }
  };

  const getClientProgress = async (clientId) => {
    try {
      return await nutritionistAPI.getClientProgress(clientId);
    } catch (error) {
      console.error("Get client progress error:", error);
      throw error;
    }
  };

  const addClientNotes = async (clientId, notes) => {
    try {
      return await nutritionistAPI.addClientNotes(clientId, notes);
    } catch (error) {
      console.error("Add client notes error:", error);
      throw error;
    }
  };

  // ==================== MEAL PLAN API FUNCTIONS ====================

  const getMealPlan = async (id) => {
    try {
      return await mealPlanAPI.getMealPlan(id);
    } catch (error) {
      console.error("Get meal plan error:", error);
      throw error;
    }
  };

  const updateMealPlan = async (id, data) => {
    try {
      return await mealPlanAPI.updateMealPlan(id, data);
    } catch (error) {
      console.error("Update meal plan error:", error);
      throw error;
    }
  };

  const getMeals = async (id) => {
    try {
      return await mealPlanAPI.getMeals(id);
    } catch (error) {
      console.error("Get meals error:", error);
      throw error;
    }
  };

  const addMeal = async (id, mealData) => {
    try {
      return await mealPlanAPI.addMeal(id, mealData);
    } catch (error) {
      console.error("Add meal error:", error);
      throw error;
    }
  };

  const updateMeal = async (planId, mealId, mealData) => {
    try {
      return await mealPlanAPI.updateMeal(planId, mealId, mealData);
    } catch (error) {
      console.error("Update meal error:", error);
      throw error;
    }
  };

  const deleteMeal = async (planId, mealId) => {
    try {
      return await mealPlanAPI.deleteMeal(planId, mealId);
    } catch (error) {
      console.error("Delete meal error:", error);
      throw error;
    }
  };

  const getMealPlanNutrition = async (id) => {
    try {
      return await mealPlanAPI.getMealPlanNutrition(id);
    } catch (error) {
      console.error("Get meal plan nutrition error:", error);
      throw error;
    }
  };

  // ==================== TRACKING API FUNCTIONS ====================

  const logMeal = async (mealData) => {
    try {
      const result = await trackingAPI.logMeal(mealData);
      await getMealLogs(); // Refresh meal logs
      return result;
    } catch (error) {
      console.error("Log meal error:", error);
      throw error;
    }
  };

  const getMealLogs = async (startDate, endDate) => {
    try {
      const logs = await trackingAPI.getMealLogs(startDate, endDate);
      setMealLogs(logs);
      return logs;
    } catch (error) {
      console.error("Get meal logs error:", error);
      throw error;
    }
  };

  const updateMealLog = async (logId, mealData) => {
    try {
      const result = await trackingAPI.updateMealLog(logId, mealData);
      await getMealLogs(); // Refresh meal logs
      return result;
    } catch (error) {
      console.error("Update meal log error:", error);
      throw error;
    }
  };

  const deleteMealLog = async (logId) => {
    try {
      const result = await trackingAPI.deleteMealLog(logId);
      await getMealLogs(); // Refresh meal logs
      return result;
    } catch (error) {
      console.error("Delete meal log error:", error);
      throw error;
    }
  };

  const logWeight = async (weight, date = new Date()) => {
    try {
      const result = await trackingAPI.logWeight(weight, date);
      await getWeightHistory(); // Refresh weight history
      return result;
    } catch (error) {
      console.error("Log weight error:", error);
      throw error;
    }
  };

  const getWeightHistory = async (days = 30) => {
    try {
      const history = await trackingAPI.getWeightHistory(days);
      setWeightHistory(history);
      return history;
    } catch (error) {
      console.error("Get weight history error:", error);
      throw error;
    }
  };

  const logWater = async (amount, date = new Date()) => {
    try {
      const result = await trackingAPI.logWater(amount, date);
      await getWaterLogs(date); // Refresh water logs for the date
      return result;
    } catch (error) {
      console.error("Log water error:", error);
      throw error;
    }
  };

  const getWaterLogs = async (date = new Date()) => {
    try {
      const logs = await trackingAPI.getWaterLogs(date);
      setWaterLogs(logs);
      return logs;
    } catch (error) {
      console.error("Get water logs error:", error);
      throw error;
    }
  };

  const getProgress = async (days = 7) => {
    try {
      const progress = await trackingAPI.getProgress(days);
      setProgressData(progress);
      return progress;
    } catch (error) {
      console.error("Get progress error:", error);
      throw error;
    }
  };

  const getNutritionSummary = async (startDate, endDate) => {
    try {
      return await trackingAPI.getNutritionSummary(startDate, endDate);
    } catch (error) {
      console.error("Get nutrition summary error:", error);
      throw error;
    }
  };

  const getComplianceReport = async (startDate, endDate) => {
    try {
      return await trackingAPI.getComplianceReport(startDate, endDate);
    } catch (error) {
      console.error("Get compliance report error:", error);
      throw error;
    }
  };

  // ==================== FOOD API FUNCTIONS ====================

  const searchFoods = async (query, limit = 20) => {
    try {
      return await foodAPI.searchFoods(query, limit);
    } catch (error) {
      console.error("Search foods error:", error);
      throw error;
    }
  };

  const getFoodById = async (foodId) => {
    try {
      return await foodAPI.getFoodById(foodId);
    } catch (error) {
      console.error("Get food by ID error:", error);
      throw error;
    }
  };

  const getFoodNutrition = async (foodId, quantity = 100) => {
    try {
      return await foodAPI.getFoodNutrition(foodId, quantity);
    } catch (error) {
      console.error("Get food nutrition error:", error);
      throw error;
    }
  };

  const addCustomFood = async (foodData) => {
    try {
      return await foodAPI.addCustomFood(foodData);
    } catch (error) {
      console.error("Add custom food error:", error);
      throw error;
    }
  };

  const getCustomFoods = async () => {
    try {
      return await foodAPI.getCustomFoods();
    } catch (error) {
      console.error("Get custom foods error:", error);
      throw error;
    }
  };

  const updateCustomFood = async (foodId, foodData) => {
    try {
      return await foodAPI.updateCustomFood(foodId, foodData);
    } catch (error) {
      console.error("Update custom food error:", error);
      throw error;
    }
  };

  const deleteCustomFood = async (foodId) => {
    try {
      return await foodAPI.deleteCustomFood(foodId);
    } catch (error) {
      console.error("Delete custom food error:", error);
      throw error;
    }
  };

  // ==================== UTILITY FUNCTIONS ====================

  const testConnection = async () => {
    try {
      return await utilityAPI.testConnection();
    } catch (error) {
      console.error("Test connection error:", error);
      throw error;
    }
  };

  const uploadFile = async (file, endpoint) => {
    try {
      return await utilityAPI.uploadFile(file, endpoint);
    } catch (error) {
      console.error("Upload file error:", error);
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
    refreshUserData();
  }, []);

  const value = {
    // User state
    user,
    isLogged,
    userRole,
    loading,
    token,
    isAuthenticated: isLogged,

    // User profile data
    userProfile,
    userAllergies,
    healthProfile,

    // Meal plans and tracking
    userMealPlans,
    mealLogs,
    weightHistory,
    waterLogs,
    progressData,

    // Admin/Nutritionist data
    dashboardData,
    clients,
    templates,
    mealPlans,

    // State setters
    setUser,
    setIsLogged,
    setUserRole,
    setUserProfile,
    setUserAllergies,
    setHealthProfile,
    setUserMealPlans,
    setMealLogs,
    setWeightHistory,
    setWaterLogs,
    setProgressData,
    setDashboardData,
    setClients,
    setTemplates,
    setMealPlans,

    // Helper functions
    hasRole,
    refreshUserData,
    clearAllData,

    // Auth functions
    SignIn: handleSignIn,
    SignUp: handleSignUp,
    logout: handleLogout,

    // User API functions
    getUserProfile,
    updateUserProfile,
    addAllergies,
    getUserAllergies,
    removeAllergy,
    getUserMealPlans,
    getHealthProfile,
    updateHealthProfile,

    // Admin API functions
    getAdminDashboard,
    getUsers,
    getUserById,
    updateUserRole,
    approveNutritionist,
    rejectNutritionist,
    getPendingNutritionists,
    deleteUser,
    getSystemStats,

    // Nutritionist API functions
    getNutritionistDashboard,
    getClients,
    getClientById,
    createMealPlanTemplate,
    getTemplates,
    updateTemplate,
    deleteTemplate,
    createMealPlan,
    getNutritionistMealPlans,
    assignMealPlan,
    getClientProgress,
    addClientNotes,

    // Meal Plan API functions
    getMealPlan,
    updateMealPlan,
    getMeals,
    addMeal,
    updateMeal,
    deleteMeal,
    getMealPlanNutrition,

    // Tracking API functions
    logMeal,
    getMealLogs,
    updateMealLog,
    deleteMealLog,
    logWeight,
    getWeightHistory,
    logWater,
    getWaterLogs,
    getProgress,
    getNutritionSummary,
    getComplianceReport,

    // Food API functions
    searchFoods,
    getFoodById,
    getFoodNutrition,
    addCustomFood,
    getCustomFoods,
    updateCustomFood,
    deleteCustomFood,

    // Utility functions
    testConnection,
    uploadFile,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

