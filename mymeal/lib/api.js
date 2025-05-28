import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your dev machine's IP or use localhost if you're using a simulator
const API_BASE = 'http://192.168.10.160:8000/api';

// Enhanced error handling
class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// ==================== TOKEN MANAGEMENT ====================
const TOKEN_KEY = 'userToken';

export const tokenManager = {
    async setToken(token) {
        try {
            if (token) {
                await AsyncStorage.setItem(TOKEN_KEY, token);
                console.log('Token stored successfully');
            }
        } catch (error) {
            console.error('Error storing token:', error);
        }
    },

    async getToken() {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            return token;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    },

    async removeToken() {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
            console.log('Token removed successfully');
        } catch (error) {
            console.error('Error removing token:', error);
        }
    },

    async hasToken() {
        const token = await this.getToken();
        return !!token;
    }
};

// Function to make authenticated requests with better error handling
const authFetch = async (endpoint, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
        // Get token from AsyncStorage instead of global
        const token = await tokenManager.getToken();

        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            signal: controller.signal
        };

        console.log(`API Request: ${config.method || 'GET'} ${API_BASE}${endpoint}`);
        console.log(`Token included: ${token ? 'Yes' : 'No'}`);

        const response = await fetch(`${API_BASE}${endpoint}`, config);
        clearTimeout(timeoutId);

        let data;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            console.error(`API Error ${response.status}:`, data);

            // If unauthorized, clear the stored token
            if (response.status === 401) {
                console.log('Unauthorized - clearing stored token');
                await tokenManager.removeToken();
            }

            throw new APIError(
                data.message || data.errors?.join(', ') || `Request failed with status ${response.status}`,
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new APIError('Request timed out - server may be unreachable', 408);
        }

        if (error instanceof APIError) {
            throw error;
        }

        console.error('API Request failed:', error);
        throw new APIError(error.message || 'Network error occurred', 0);
    }
};

// ==================== AUTH API ====================
export const authAPI = {
    async signIn(email, password) {
        try {
            console.log(`Attempting login with email: ${email}`);
            const data = await authFetch('/auth/signin', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Store the token after successful login
            if (data.token) {
                await tokenManager.setToken(data.token);
                console.log('Login successful and token stored');
            } else {
                console.warn('Login successful but no token received');
            }

            console.log('Login successful:', data.user);
            return data;
        } catch (error) {
            console.error('Login error:', error.message);
            throw error;
        }
    },

    async signUp(userData) {
        try {
            console.log('Attempting registration:', { ...userData, password: '[HIDDEN]' });
            const data = await authFetch('/auth/signup', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            // Store the token after successful registration
            if (data.token) {
                await tokenManager.setToken(data.token);
                console.log('Registration successful and token stored');
            }

            console.log('Registration successful:', data.user);
            return data;
        } catch (error) {
            console.error('Registration error:', error.message);
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const hasToken = await tokenManager.hasToken();
            if (!hasToken) {
                throw new APIError('No authentication token found', 401);
            }

            const data = await authFetch('/auth/getCurrentUser'); // ✅ correct route now
            return data;
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },


    async logout() {
        try {
            // Try to call logout endpoint
            try {
                await authFetch('/auth/signout', { method: 'POST' });
            } catch (error) {
                // Even if logout API fails, we still want to clear the local token
                console.warn('Logout API call failed:', error.message);
            }

            // Always clear the stored token
            await tokenManager.removeToken();
            console.log('Logout completed - token cleared');
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear token on error
            await tokenManager.removeToken();
            throw error;
        }
    }
};

// ==================== USER API ====================
export const userAPI = {
    async getProfile() {
        return await authFetch('/user/profile');
    },

    async updateProfile(profileData) {
        return await authFetch('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },

    async addAllergies(allergies) {
        return await authFetch('/user/allergies', {
            method: 'POST',
            body: JSON.stringify({ allergies })
        });
    },

    async getUserAllergies() {
        return await authFetch('/user/allergies');
    },

    async removeAllergy(allergyId) {
        return await authFetch(`/user/allergies/${allergyId}`, {
            method: 'DELETE'
        });
    },

    async getMealPlans() {
        return await authFetch('/user/meal-plans');
    },

    async getHealthProfile() {
        return await authFetch('/user/health-profile');
    },

    async updateHealthProfile(healthData) {
        return await authFetch('/user/health-profile', {
            method: 'PUT',
            body: JSON.stringify(healthData)
        });
    }
};

// ==================== ADMIN API ====================
export const adminAPI = {
    async getDashboard() {
        return await authFetch('/admin/dashboard');
    },

    async getUsers(page = 1, limit = 10, search = '') {
        const params = new URLSearchParams({ page, limit, search });
        return await authFetch(`/admin/users?${params}`);
    },

    async getUserById(userId) {
        return await authFetch(`/admin/users/${userId}`);
    },

    async updateUserRole(userId, role) {
        return await authFetch(`/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role })
        });
    },

    async approveNutritionist(nutritionistId) {
        return await authFetch(`/admin/nutritionists/${nutritionistId}/approve`, {
            method: 'PUT'
        });
    },

    async rejectNutritionist(nutritionistId, reason) {
        return await authFetch(`/admin/nutritionists/${nutritionistId}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ reason })
        });
    },

    async getPendingNutritionists() {
        return await authFetch('/admin/nutritionists/pending');
    },

    async deleteUser(userId) {
        return await authFetch(`/admin/users/${userId}`, {
            method: 'DELETE'
        });
    },

    async getSystemStats() {
        return await authFetch('/admin/stats');
    }
};

// ==================== NUTRITIONIST API ====================
export const nutritionistAPI = {
    async getDashboard() {
        return await authFetch('/nutritionist/dashboard');
    },

    async getClients() {
        return await authFetch('/nutritionist/clients');
    },

    async getClientById(clientId) {
        return await authFetch(`/nutritionist/clients/${clientId}`);
    },

    async createMealPlanTemplate(templateData) {
        return await authFetch('/nutritionist/templates', {
            method: 'POST',
            body: JSON.stringify(templateData)
        });
    },

    async getTemplates() {
        return await authFetch('/nutritionist/templates');
    },

    async updateTemplate(templateId, templateData) {
        return await authFetch(`/nutritionist/templates/${templateId}`, {
            method: 'PUT',
            body: JSON.stringify(templateData)
        });
    },

    async deleteTemplate(templateId) {
        return await authFetch(`/nutritionist/templates/${templateId}`, {
            method: 'DELETE'
        });
    },

    async createMealPlan(mealPlanData) {
        return await authFetch('/nutritionist/plans', {
            method: 'POST',
            body: JSON.stringify(mealPlanData)
        });
    },

    async getMealPlans() {
        return await authFetch('/nutritionist/plans');
    },

    async assignMealPlan(userId, mealPlanId) {
        return await authFetch('/nutritionist/assign-plan', {
            method: 'POST',
            body: JSON.stringify({ userId, mealPlanId })
        });
    },

    async getClientProgress(clientId) {
        return await authFetch(`/nutritionist/clients/${clientId}/progress`);
    },

    async addClientNotes(clientId, notes) {
        return await authFetch(`/nutritionist/clients/${clientId}/notes`, {
            method: 'POST',
            body: JSON.stringify({ notes })
        });
    }
};

// ==================== MEAL PLAN API ====================
export const mealPlanAPI = {
    async getMealPlan(id) {
        return await authFetch(`/meal-plans/${id}`);
    },

    async updateMealPlan(id, data) {
        return await authFetch(`/meal-plans/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async getMeals(id) {
        return await authFetch(`/meal-plans/${id}/meals`);
    },

    async addMeal(id, mealData) {
        return await authFetch(`/meal-plans/${id}/meals`, {
            method: 'POST',
            body: JSON.stringify(mealData)
        });
    },

    async updateMeal(planId, mealId, mealData) {
        return await authFetch(`/meal-plans/${planId}/meals/${mealId}`, {
            method: 'PUT',
            body: JSON.stringify(mealData)
        });
    },

    async deleteMeal(planId, mealId) {
        return await authFetch(`/meal-plans/${planId}/meals/${mealId}`, {
            method: 'DELETE'
        });
    },

    async getMealPlanNutrition(id) {
        return await authFetch(`/meal-plans/${id}/nutrition`);
    }
};

// ==================== TRACKING API ====================
export const trackingAPI = {
    async logMeal(mealData) {
        return await authFetch('/tracking/meals', {
            method: 'POST',
            body: JSON.stringify(mealData)
        });
    },

    async getMealLogs(startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        return await authFetch(`/tracking/meals?${params}`);
    },

    async updateMealLog(logId, mealData) {
        return await authFetch(`/tracking/meals/${logId}`, {
            method: 'PUT',
            body: JSON.stringify(mealData)
        });
    },

    async deleteMealLog(logId) {
        return await authFetch(`/tracking/meals/${logId}`, {
            method: 'DELETE'
        });
    },

    async logWeight(weight, date = new Date()) {
        return await authFetch('/tracking/weight', {
            method: 'POST',
            body: JSON.stringify({ weight, date })
        });
    },

    async getWeightHistory(days = 30) {
        return await authFetch(`/tracking/weight?days=${days}`);
    },

    async logWater(amount, date = new Date()) {
        return await authFetch('/tracking/water', {
            method: 'POST',
            body: JSON.stringify({ amount, date })
        });
    },

    async getWaterLogs(date = new Date()) {
        const dateStr = date.toISOString().split('T')[0];
        return await authFetch(`/tracking/water?date=${dateStr}`);
    },

    async getProgress(days = 7) {
        return await authFetch(`/tracking/progress?days=${days}`);
    },

    async getNutritionSummary(startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        return await authFetch(`/tracking/nutrition-summary?${params}`);
    },

    async getComplianceReport(startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        return await authFetch(`/tracking/compliance?${params}`);
    }
};

// ==================== FOOD ITEM API ====================
export const foodAPI = {
    async searchFoods(query, limit = 20) {
        const params = new URLSearchParams({ query, limit });
        return await authFetch(`/foods/search?${params}`);
    },

    async getFoodById(foodId) {
        return await authFetch(`/foods/${foodId}`);
    },

    async getFoodNutrition(foodId, quantity = 100) {
        return await authFetch(`/foods/${foodId}/nutrition?quantity=${quantity}`);
    },

    async addCustomFood(foodData) {
        return await authFetch('/foods/custom', {
            method: 'POST',
            body: JSON.stringify(foodData)
        });
    },

    async getCustomFoods() {
        return await authFetch('/foods/custom');
    },

    async updateCustomFood(foodId, foodData) {
        return await authFetch(`/foods/custom/${foodId}`, {
            method: 'PUT',
            body: JSON.stringify(foodData)
        });
    },

    async deleteCustomFood(foodId) {
        return await authFetch(`/foods/custom/${foodId}`, {
            method: 'DELETE'
        });
    }
};

// ==================== UTILITY FUNCTIONS ====================
export const utilityAPI = {
    async testConnection() {
        try {
            console.log(`Testing connection to: ${API_BASE}`);
            const start = Date.now();

            const token = await tokenManager.getToken();
            const response = await fetch(`${API_BASE}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            const time = Date.now() - start;
            console.log(`Connection response: ${response.status} in ${time}ms`);

            return {
                success: response.status !== 500,
                status: response.status,
                time,
                message: response.ok ? 'Connection successful' : 'Server reachable but returned error'
            };
        } catch (error) {
            console.error('Connection test failed:', error.message);
            return {
                success: false,
                error: error.message,
                message: 'Failed to connect to server'
            };
        }
    },

    async uploadFile(file, endpoint) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = await tokenManager.getToken();
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new APIError(error.message || 'Upload failed', response.status);
            }

            return await response.json();
        } catch (error) {
            console.error('File upload error:', error);
            throw error;
        }
    }
};

// ==================== DEBUG FUNCTIONS ====================
export const debugAPI = {
    async checkAuth() {
        console.log('=== Auth Debug ===');
        const hasToken = await tokenManager.hasToken();
        const token = await tokenManager.getToken();

        console.log('Has token:', hasToken);
        console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');

        if (token) {
            try {
                const user = await authAPI.getCurrentUser();
                console.log('Token is valid, user:', user);
                return { valid: true, user };
            } catch (error) {
                console.log('Token is invalid:', error.message);
                return { valid: false, error: error.message };
            }
        } else {
            console.log('No token found');
            return { valid: false, error: 'No token' };
        }
    },

    async clearAuth() {
        await tokenManager.removeToken();
        console.log('Auth cleared');
    }
};

// ==================== LEGACY FUNCTIONS (for backward compatibility) ====================
export async function SignIn(email, password) {
    return await authAPI.signIn(email, password);
}

export async function SignUp(username, email, password, role = 'user') {
    return await authAPI.signUp({ username, email, password, role });
}

export async function getCurrentUser() {
    return await authAPI.getCurrentUser();
}

export async function getUserRoles() {
    const userData = await authAPI.getCurrentUser();
    return userData.user.role;
}

export async function logout() {
    return await authAPI.logout();
}

export async function testConnection() {
    return await utilityAPI.testConnection();
}

// Export all APIs as a single object for easier imports
const API = {
    auth: authAPI,
    user: userAPI,
    admin: adminAPI,
    nutritionist: nutritionistAPI,
    mealPlan: mealPlanAPI,
    tracking: trackingAPI,
    food: foodAPI,
    utility: utilityAPI,
    debug: debugAPI
};

export default API;