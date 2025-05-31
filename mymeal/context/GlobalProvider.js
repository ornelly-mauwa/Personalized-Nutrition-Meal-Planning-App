import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, tokenManager, userAPI, adminAPI, nutritionistAPI, mealPlanAPI, trackingAPI, foodAPI, utilityAPI } from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext({
  // User state
  user: null,
  isLogged: false,
  userRole: null,
  loading: true,
  token: null,
  isAuthenticated: false,

  // Profile state
  userProfile: null,
  healthProfile: null,
  allergies: [],

  // Meal plan state
  mealPlans: [],
  currentMealPlan: null,

  // Tracking state
  mealLogs: [],
  weightHistory: [],
  waterLogs: [],
  progressData: null,

  // Admin state
  users: [],
  pendingNutritionists: [],
  systemStats: null,

  // Nutritionist state
  clients: [],
  templates: [],

  // Food state
  searchResults: [],
  customFoods: [],

  // State setters
  setUser: () => { },
  setIsLogged: () => { },
  setUserRole: () => { },
  setUserProfile: () => { },
  setHealthProfile: () => { },
  setAllergies: () => { },
  setMealPlans: () => { },
  setCurrentMealPlan: () => { },
  setMealLogs: () => { },
  setWeightHistory: () => { },
  setWaterLogs: () => { },
  setProgressData: () => { },
  setUsers: () => { },
  setPendingNutritionists: () => { },
  setSystemStats: () => { },
  setClients: () => { },
  setTemplates: () => { },
  setSearchResults: () => { },
  setCustomFoods: () => { },

  // Helper functions
  hasRole: () => false,
  clearAllData: () => { },

  // Auth functions
  SignIn: async () => { },
  SignUp: async () => { },
  logout: async () => { },

  // Profile functions
  createProfile: async () => { },
  getProfile: async () => { },
  updateProfile: async () => { },
  deleteProfile: async () => { },
  getHealthProfile: async () => { },
  updateHealthProfile: async () => { },

  // Allergy functions
  addAllergies: async () => { },
  getUserAllergies: async () => { },
  removeAllergy: async () => { },

  // Meal Plan functions
  createMealPlan: async () => { },
  getMealPlans: async () => { },
  getMealPlan: async () => { },
  updateMealPlan: async () => { },
  getMeals: async () => { },
  addMeal: async () => { },
  updateMeal: async () => { },
  deleteMeal: async () => { },
  getMealPlanNutrition: async () => { },

  // Tracking functions
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

  // Admin functions
  getUsers: async () => { },
  getUserById: async () => { },
  updateUserRole: async () => { },
  approveNutritionist: async () => { },
  rejectNutritionist: async () => { },
  getPendingNutritionists: async () => { },
  deleteUser: async () => { },
  getSystemStats: async () => { },

  // Nutritionist functions
  getClients: async () => { },
  getClientById: async () => { },
  createMealPlanTemplate: async () => { },
  getTemplates: async () => { },
  updateTemplate: async () => { },
  deleteTemplate: async () => { },
  assignMealPlan: async () => { },
  getClientProgress: async () => { },
  addClientNotes: async () => { },

  // Food functions
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

  // Profile state
  const [userProfile, setUserProfile] = useState(null);
  const [healthProfile, setHealthProfile] = useState(null);
  const [allergies, setAllergies] = useState([]);

  // Meal plan state
  const [mealPlans, setMealPlans] = useState([]);
  const [currentMealPlan, setCurrentMealPlan] = useState(null);

  // Tracking state
  const [mealLogs, setMealLogs] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [waterLogs, setWaterLogs] = useState([]);
  const [progressData, setProgressData] = useState(null);

  // Admin state
  const [users, setUsers] = useState([]);
  const [pendingNutritionists, setPendingNutritionists] = useState([]);
  const [systemStats, setSystemStats] = useState(null);

  // Nutritionist state
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);

  // Food state
  const [searchResults, setSearchResults] = useState([]);
  const [customFoods, setCustomFoods] = useState([]);

  // Clear all user data
  const clearAllData = () => {
    setUser(null);
    setUserRole(null);
    setUserProfile(null);
    setHealthProfile(null);
    setAllergies([]);
    setMealPlans([]);
    setCurrentMealPlan(null);
    setMealLogs([]);
    setWeightHistory([]);
    setWaterLogs([]);
    setProgressData(null);
    setUsers([]);
    setPendingNutritionists([]);
    setSystemStats(null);
    setClients([]);
    setTemplates([]);
    setSearchResults([]);
    setCustomFoods([]);
  };

  // In your AuthContext or GlobalProvider

  // Check for stored token and validate it on app start
  const checkAuthToken = async () => {
    try {
      setLoading(true);

      const hasToken = await tokenManager.hasToken();
      if (!hasToken) {
        setIsLogged(false);
        setToken(null);
        clearAllData();
        return;
      }

      const storedToken = await tokenManager.getToken();
      if (!storedToken) {
        setIsLogged(false);
        setToken(null);
        clearAllData();
        return;
      }

      try {
        const userData = await authAPI.getCurrentUser();
        setToken(storedToken);
        setUser(userData.user);
        setUserRole(userData.user.role);
        setIsLogged(true);
        console.log('User authenticated successfully:', userData.user);
      } catch (error) {
        console.log('Token validation failed:', error.message);
        await tokenManager.removeToken();
        setIsLogged(false);
        setToken(null);
        clearAllData();
      }
    } catch (error) {
      console.error("Error checking auth token:", error);
      await tokenManager.removeToken();
      setIsLogged(false);
      setToken(null);
      clearAllData();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await tokenManager.getToken();
        const storedUser = await AsyncStorage.getItem('user');

        console.log('🔍 Loading stored auth data...');
        console.log('Stored token exists:', !!storedToken);
        console.log('Stored user exists:', !!storedUser);

        if (storedToken && storedUser) {
          setToken(storedToken); // Make sure this line exists!
          setUser(JSON.parse(storedUser));
          setIsLogged(true);
          console.log('✅ Auth data loaded successfully');
        } else {
          console.log('❌ No stored auth data found');
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    console.log('🔍 Current token state:', token ? 'EXISTS' : 'MISSING');
    console.log('🔍 Current isLogged state:', isLogged);
  }, [token, isLogged]);

  // ==================== AUTH FUNCTIONS ====================

  const handleSignIn = async (email, password) => {
    try {
      setLoading(true);
      const data = await authAPI.signIn(email, password);
      console.log('API response:', data);
      console.log('Token from API:', data.token || data.accessToken);
      console.log('User from API:', data.user);

      // CRITICAL: Store the token from API response
      const token = data.token || data.accessToken;
      if (!token) {
        console.error('❌ No token found in API response!');
        throw new Error('No authentication token received');
      }

      await tokenManager.setToken(token);  // ← This was missing!
      console.log('✅ Token stored successfully');

      const storedToken = await tokenManager.getToken();
      console.log('🔍 Stored token verification:', storedToken);

      setToken(storedToken);
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
      const data = await authAPI.signUp({ username, email, password, role });

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
      await authAPI.logout();
      setIsLogged(false);
      setToken(null);
      clearAllData();
      console.log('Logout successful in GlobalProvider');
      return true;
    } catch (error) {
      console.error("Logout failed in GlobalProvider:", error);
      setIsLogged(false);
      setToken(null);
      clearAllData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==================== PROFILE FUNCTIONS ====================

  const handleCreateProfile = async (profileData) => {
    try {
      // Get the token from AsyncStorage
      const token = await tokenManager.getToken(); // ✅ correct method from your tokenManager


      console.log('=== TOKEN DEBUG ===');
      console.log('Token exists:', !!token);
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('API Request: POST http://192.168.10.160:8000/api/profiles');
      console.log('Profile Data:', profileData);

      const response = await fetch('http://192.168.10.160:8000/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Make sure this format is correct
        },
        body: JSON.stringify(profileData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', response.status, errorData);
        throw new Error(`Request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log('✅ Profile created successfully:', result);
      return result;

    } catch (error) {
      console.error('Create profile failed:', error);
      throw error;
    }
  };

  const handleGetProfile = async () => {
    try {
      const data = await userAPI.getProfile();
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error("Get profile failed:", error);
      throw error;
    }
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      const data = await userAPI.updateProfile(profileData);
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error("Update profile failed:", error);
      throw error;
    }
  };

  const handleDeleteProfile = async (profileId) => {
    try {
      const data = await userAPI.deleteProfile(profileId);
      setUserProfile(null);
      return data;
    } catch (error) {
      console.error("Delete profile failed:", error);
      throw error;
    }
  };

  const handleGetHealthProfile = async () => {
    try {
      const data = await userAPI.getHealthProfile();
      setHealthProfile(data);
      return data;
    } catch (error) {
      console.error("Get health profile failed:", error);
      throw error;
    }
  };

  const handleUpdateHealthProfile = async (healthData) => {
    try {
      const data = await userAPI.updateHealthProfile(healthData);
      setHealthProfile(data);
      return data;
    } catch (error) {
      console.error("Update health profile failed:", error);
      throw error;
    }
  };

  // ==================== ALLERGY FUNCTIONS ====================

  const handleAddAllergies = async (allergiesData) => {
    try {
      const data = await userAPI.addAllergies(allergiesData);
      setAllergies(prev => [...prev, ...allergiesData]);
      return data;
    } catch (error) {
      console.error("Add allergies failed:", error);
      throw error;
    }
  };

  const handleGetUserAllergies = async () => {
    try {
      const data = await userAPI.getUserAllergies();
      setAllergies(data);
      return data;
    } catch (error) {
      console.error("Get user allergies failed:", error);
      throw error;
    }
  };

  const handleRemoveAllergy = async (allergyId) => {
    try {
      const data = await userAPI.removeAllergy(allergyId);
      setAllergies(prev => prev.filter(allergy => allergy.id !== allergyId));
      return data;
    } catch (error) {
      console.error("Remove allergy failed:", error);
      throw error;
    }
  };

  // ==================== MEAL PLAN FUNCTIONS ====================

  const handleCreateMealPlan = async (mealPlanData) => {
    try {
      const data = await userAPI.createMealPlan(mealPlanData);
      setMealPlans(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Create meal plan failed:", error);
      throw error;
    }
  };

  const handleGetMealPlans = async () => {
    try {
      const data = await userAPI.getMealPlans();
      setMealPlans(data);
      return data;
    } catch (error) {
      console.error("Get meal plans failed:", error);
      throw error;
    }
  };

  const handleGetMealPlan = async (id) => {
    try {
      const data = await mealPlanAPI.getMealPlan(id);
      setCurrentMealPlan(data);
      return data;
    } catch (error) {
      console.error("Get meal plan failed:", error);
      throw error;
    }
  };

  const handleUpdateMealPlan = async (id, mealPlanData) => {
    try {
      const data = await mealPlanAPI.updateMealPlan(id, mealPlanData);
      setMealPlans(prev => prev.map(plan => plan.id === id ? data : plan));
      if (currentMealPlan?.id === id) {
        setCurrentMealPlan(data);
      }
      return data;
    } catch (error) {
      console.error("Update meal plan failed:", error);
      throw error;
    }
  };

  const handleGetMeals = async (id) => {
    try {
      const data = await mealPlanAPI.getMeals(id);
      return data;
    } catch (error) {
      console.error("Get meals failed:", error);
      throw error;
    }
  };

  const handleAddMeal = async (id, mealData) => {
    try {
      const data = await mealPlanAPI.addMeal(id, mealData);
      return data;
    } catch (error) {
      console.error("Add meal failed:", error);
      throw error;
    }
  };

  const handleUpdateMeal = async (planId, mealId, mealData) => {
    try {
      const data = await mealPlanAPI.updateMeal(planId, mealId, mealData);
      return data;
    } catch (error) {
      console.error("Update meal failed:", error);
      throw error;
    }
  };

  const handleDeleteMeal = async (planId, mealId) => {
    try {
      const data = await mealPlanAPI.deleteMeal(planId, mealId);
      return data;
    } catch (error) {
      console.error("Delete meal failed:", error);
      throw error;
    }
  };

  const handleGetMealPlanNutrition = async (id) => {
    try {
      const data = await mealPlanAPI.getMealPlanNutrition(id);
      return data;
    } catch (error) {
      console.error("Get meal plan nutrition failed:", error);
      throw error;
    }
  };

  // ==================== TRACKING FUNCTIONS ====================

  const handleLogMeal = async (mealData) => {
    try {
      const data = await trackingAPI.logMeal(mealData);
      setMealLogs(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Log meal failed:", error);
      throw error;
    }
  };

  const handleGetMealLogs = async (startDate, endDate) => {
    try {
      const data = await trackingAPI.getMealLogs(startDate, endDate);
      setMealLogs(data);
      return data;
    } catch (error) {
      console.error("Get meal logs failed:", error);
      throw error;
    }
  };

  const handleUpdateMealLog = async (logId, mealData) => {
    try {
      const data = await trackingAPI.updateMealLog(logId, mealData);
      setMealLogs(prev => prev.map(log => log.id === logId ? data : log));
      return data;
    } catch (error) {
      console.error("Update meal log failed:", error);
      throw error;
    }
  };

  const handleDeleteMealLog = async (logId) => {
    try {
      const data = await trackingAPI.deleteMealLog(logId);
      setMealLogs(prev => prev.filter(log => log.id !== logId));
      return data;
    } catch (error) {
      console.error("Delete meal log failed:", error);
      throw error;
    }
  };

  const handleLogWeight = async (weight, date = new Date()) => {
    try {
      const data = await trackingAPI.logWeight(weight, date);
      setWeightHistory(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Log weight failed:", error);
      throw error;
    }
  };

  const handleGetWeightHistory = async (days = 30) => {
    try {
      const data = await trackingAPI.getWeightHistory(days);
      setWeightHistory(data);
      return data;
    } catch (error) {
      console.error("Get weight history failed:", error);
      throw error;
    }
  };

  const handleLogWater = async (amount, date = new Date()) => {
    try {
      const data = await trackingAPI.logWater(amount, date);
      setWaterLogs(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Log water failed:", error);
      throw error;
    }
  };

  const handleGetWaterLogs = async (date = new Date()) => {
    try {
      const data = await trackingAPI.getWaterLogs(date);
      setWaterLogs(data);
      return data;
    } catch (error) {
      console.error("Get water logs failed:", error);
      throw error;
    }
  };

  const handleGetProgress = async (days = 7) => {
    try {
      const data = await trackingAPI.getProgress(days);
      setProgressData(data);
      return data;
    } catch (error) {
      console.error("Get progress failed:", error);
      throw error;
    }
  };

  const handleGetNutritionSummary = async (startDate, endDate) => {
    try {
      const data = await trackingAPI.getNutritionSummary(startDate, endDate);
      return data;
    } catch (error) {
      console.error("Get nutrition summary failed:", error);
      throw error;
    }
  };

  const handleGetComplianceReport = async (startDate, endDate) => {
    try {
      const data = await trackingAPI.getComplianceReport(startDate, endDate);
      return data;
    } catch (error) {
      console.error("Get compliance report failed:", error);
      throw error;
    }
  };

  // ==================== ADMIN FUNCTIONS ====================

  const handleGetUsers = async (page = 1, limit = 10, search = '') => {
    try {
      const data = await adminAPI.getUsers(page, limit, search);
      setUsers(data);
      return data;
    } catch (error) {
      console.error("Get users failed:", error);
      throw error;
    }
  };

  const handleGetUserById = async (userId) => {
    try {
      const data = await adminAPI.getUserById(userId);
      return data;
    } catch (error) {
      console.error("Get user by ID failed:", error);
      throw error;
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      const data = await adminAPI.updateUserRole(userId, role);
      setUsers(prev => prev.map(user => user.id === userId ? { ...user, role } : user));
      return data;
    } catch (error) {
      console.error("Update user role failed:", error);
      throw error;
    }
  };

  const handleApproveNutritionist = async (nutritionistId) => {
    try {
      const data = await adminAPI.approveNutritionist(nutritionistId);
      setPendingNutritionists(prev => prev.filter(n => n.id !== nutritionistId));
      return data;
    } catch (error) {
      console.error("Approve nutritionist failed:", error);
      throw error;
    }
  };

  const handleRejectNutritionist = async (nutritionistId, reason) => {
    try {
      const data = await adminAPI.rejectNutritionist(nutritionistId, reason);
      setPendingNutritionists(prev => prev.filter(n => n.id !== nutritionistId));
      return data;
    } catch (error) {
      console.error("Reject nutritionist failed:", error);
      throw error;
    }
  };

  const handleGetPendingNutritionists = async () => {
    try {
      const data = await adminAPI.getPendingNutritionists();
      setPendingNutritionists(data);
      return data;
    } catch (error) {
      console.error("Get pending nutritionists failed:", error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const data = await adminAPI.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      return data;
    } catch (error) {
      console.error("Delete user failed:", error);
      throw error;
    }
  };

  const handleGetSystemStats = async () => {
    try {
      const data = await adminAPI.getSystemStats();
      setSystemStats(data);
      return data;
    } catch (error) {
      console.error("Get system stats failed:", error);
      throw error;
    }
  };

  // ==================== NUTRITIONIST FUNCTIONS ====================

  const handleGetClients = async () => {
    try {
      const data = await nutritionistAPI.getClients();
      setClients(data);
      return data;
    } catch (error) {
      console.error("Get clients failed:", error);
      throw error;
    }
  };

  const handleGetClientById = async (clientId) => {
    try {
      const data = await nutritionistAPI.getClientById(clientId);
      return data;
    } catch (error) {
      console.error("Get client by ID failed:", error);
      throw error;
    }
  };

  const handleCreateMealPlanTemplate = async (templateData) => {
    try {
      const data = await nutritionistAPI.createMealPlanTemplate(templateData);
      setTemplates(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Create meal plan template failed:", error);
      throw error;
    }
  };

  const handleGetTemplates = async () => {
    try {
      const data = await nutritionistAPI.getTemplates();
      setTemplates(data);
      return data;
    } catch (error) {
      console.error("Get templates failed:", error);
      throw error;
    }
  };

  const handleUpdateTemplate = async (templateId, templateData) => {
    try {
      const data = await nutritionistAPI.updateTemplate(templateId, templateData);
      setTemplates(prev => prev.map(template => template.id === templateId ? data : template));
      return data;
    } catch (error) {
      console.error("Update template failed:", error);
      throw error;
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      const data = await nutritionistAPI.deleteTemplate(templateId);
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      return data;
    } catch (error) {
      console.error("Delete template failed:", error);
      throw error;
    }
  };

  const handleAssignMealPlan = async (userId, mealPlanId) => {
    try {
      const data = await nutritionistAPI.assignMealPlan(userId, mealPlanId);
      return data;
    } catch (error) {
      console.error("Assign meal plan failed:", error);
      throw error;
    }
  };

  const handleGetClientProgress = async (clientId) => {
    try {
      const data = await nutritionistAPI.getClientProgress(clientId);
      return data;
    } catch (error) {
      console.error("Get client progress failed:", error);
      throw error;
    }
  };

  const handleAddClientNotes = async (clientId, notes) => {
    try {
      const data = await nutritionistAPI.addClientNotes(clientId, notes);
      return data;
    } catch (error) {
      console.error("Add client notes failed:", error);
      throw error;
    }
  };

  // ==================== FOOD FUNCTIONS ====================

  const handleSearchFoods = async (query, limit = 20) => {
    try {
      const data = await foodAPI.searchFoods(query, limit);
      setSearchResults(data);
      return data;
    } catch (error) {
      console.error("Search foods failed:", error);
      throw error;
    }
  };

  const handleGetFoodById = async (foodId) => {
    try {
      const data = await foodAPI.getFoodById(foodId);
      return data;
    } catch (error) {
      console.error("Get food by ID failed:", error);
      throw error;
    }
  };

  const handleGetFoodNutrition = async (foodId, quantity = 100) => {
    try {
      const data = await foodAPI.getFoodNutrition(foodId, quantity);
      return data;
    } catch (error) {
      console.error("Get food nutrition failed:", error);
      throw error;
    }
  };

  const handleAddCustomFood = async (foodData) => {
    try {
      const data = await foodAPI.addCustomFood(foodData);
      setCustomFoods(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Add custom food failed:", error);
      throw error;
    }
  };

  const handleGetCustomFoods = async () => {
    try {
      const data = await foodAPI.getCustomFoods();
      setCustomFoods(data);
      return data;
    } catch (error) {
      console.error("Get custom foods failed:", error);
      throw error;
    }
  };

  const handleUpdateCustomFood = async (foodId, foodData) => {
    try {
      const data = await foodAPI.updateCustomFood(foodId, foodData);
      setCustomFoods(prev => prev.map(food => food.id === foodId ? data : food));
      return data;
    } catch (error) {
      console.error("Update custom food failed:", error);
      throw error;
    }
  };

  const handleDeleteCustomFood = async (foodId) => {
    try {
      const data = await foodAPI.deleteCustomFood(foodId);
      setCustomFoods(prev => prev.filter(food => food.id !== foodId));
      return data;
    } catch (error) {
      console.error("Delete custom food failed:", error);
      throw error;
    }
  };

  // ==================== UTILITY FUNCTIONS ====================

  const handleTestConnection = async () => {
    try {
      const data = await utilityAPI.testConnection();
      return data;
    } catch (error) {
      console.error("Test connection failed:", error);
      throw error;
    }
  };

  const handleUploadFile = async (file, endpoint) => {
    try {
      const data = await utilityAPI.uploadFile(file, endpoint);
      return data;
    } catch (error) {
      console.error("Upload file failed:", error);
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

    // Profile state
    userProfile,
    healthProfile,
    allergies,

    // Meal plan state
    mealPlans,
    currentMealPlan,

    // Tracking state
    mealLogs,
    weightHistory,
    waterLogs,
    progressData,

    // Admin state
    users,
    pendingNutritionists,
    systemStats,

    // Nutritionist state
    clients,
    templates,

    // Food state
    searchResults,
    customFoods,

    // State setters
    setUser,
    setIsLogged,
    setUserRole,
    setUserProfile,
    setHealthProfile,
    setAllergies,
    setMealPlans,
    setCurrentMealPlan,
    setMealLogs,
    setWeightHistory,
    setWaterLogs,
    setProgressData,
    setUsers,
    setPendingNutritionists,
    setSystemStats,
    setClients,
    setTemplates,
    setSearchResults,
    setCustomFoods,

    // Helper functions
    hasRole,
    clearAllData,

    // Auth functions
    SignIn: handleSignIn,
    SignUp: handleSignUp,
    logout: handleLogout,

    // Profile functions
    createProfile: handleCreateProfile,
    getProfile: handleGetProfile,
    updateProfile: handleUpdateProfile,
    deleteProfile: handleDeleteProfile,
    getHealthProfile: handleGetHealthProfile,
    updateHealthProfile: handleUpdateHealthProfile,

    // Allergy functions
    addAllergies: handleAddAllergies,
    getUserAllergies: handleGetUserAllergies,
    removeAllergy: handleRemoveAllergy,

    // Meal Plan functions
    createMealPlan: handleCreateMealPlan,
    getMealPlans: handleGetMealPlans,
    getMealPlan: handleGetMealPlan,
    updateMealPlan: handleUpdateMealPlan,
    getMeals: handleGetMeals,
    addMeal: handleAddMeal,
    updateMeal: handleUpdateMeal,
    deleteMeal: handleDeleteMeal,
    getMealPlanNutrition: handleGetMealPlanNutrition,

    // Tracking functions
    logMeal: handleLogMeal,
    getMealLogs: handleGetMealLogs,
    updateMealLog: handleUpdateMealLog,
    deleteMealLog: handleDeleteMealLog,
    logWeight: handleLogWeight,
    getWeightHistory: handleGetWeightHistory,
    logWater: handleLogWater,
    getWaterLogs: handleGetWaterLogs,
    getProgress: handleGetProgress,
    getNutritionSummary: handleGetNutritionSummary,
    getComplianceReport: handleGetComplianceReport,

    // Admin functions
    getUsers: handleGetUsers,
    getUserById: handleGetUserById,
    updateUserRole: handleUpdateUserRole,
    approveNutritionist: handleApproveNutritionist,
    rejectNutritionist: handleRejectNutritionist,
    getPendingNutritionists: handleGetPendingNutritionists,
    deleteUser: handleDeleteUser,
    getSystemStats: handleGetSystemStats,

    // Nutritionist functions
    getClients: handleGetClients,
    getClientById: handleGetClientById,
    createMealPlanTemplate: handleCreateMealPlanTemplate,
    getTemplates: handleGetTemplates,
    updateTemplate: handleUpdateTemplate,
    deleteTemplate: handleDeleteTemplate,
    assignMealPlan: handleAssignMealPlan,
    getClientProgress: handleGetClientProgress,
    addClientNotes: handleAddClientNotes,

    // Food functions
    searchFoods: handleSearchFoods,
    getFoodById: handleGetFoodById,
    getFoodNutrition: handleGetFoodNutrition,
    addCustomFood: handleAddCustomFood,
    getCustomFoods: handleGetCustomFoods,
    updateCustomFood: handleUpdateCustomFood,
    deleteCustomFood: handleDeleteCustomFood,

    // Utility functions
    testConnection: handleTestConnection,
    uploadFile: handleUploadFile,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);