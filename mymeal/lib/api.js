/*// Replace with your dev machine's IP or use localhost if you're using a simulator
const API_BASE = 'http://192.168.10.160:8000/api';

// Function to make authenticated requests
const authFetch = async (endpoint, options = {}) => {
    // Get token from global context
    const token = global.authToken;

    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    return fetch(`${API_BASE}${endpoint}`, options);
};

// Auth functions
export async function SignIn(email, password) {
    try {
        console.log(`Attempting login to ${API_BASE}/users/login with email: ${email}`);

        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Login failed with status:', response.status);
            console.error('Response data:', data);
            throw new Error(data.message || data.errors?.join(', ') || 'Login failed');
        }

        console.log('Login successful:', data.user);
        return data;
    } catch (error) {
        console.error('Login error:', error.message);
        throw error;
    }
}

export async function SignUp(username, email, password, role = 'user') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Extended to 15 seconds

    try {
        console.log(`Sending registration to ${API_BASE}/users/register:`, {
            username,
            email,
            role
        });

        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Try to parse JSON response
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned non-JSON response');
        }

        if (!response.ok) {
            console.error('Registration failed with status:', response.status);
            console.error('Response data:', data);
            throw new Error(data.message || data.errors?.join(', ') || 'Registration failed');
        }

        console.log('Registration successful:', data.user);
        return data;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.error('Registration request timed out');
            throw new Error('Request timed out - server may be unreachable');
        }

        console.error('Registration error:', error);
        throw error;
    }
}

// Add a connection test function that you can call when debugging
export async function testConnection() {
    try {
        console.log(`Testing connection to: ${API_BASE}`);
        const start = Date.now();

        // Try a simple GET request to your server
        const response = await fetch(`${API_BASE}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include token if available
                ...(global.authToken ? { 'Authorization': `Bearer ${global.authToken}` } : {})
            }
        });

        const time = Date.now() - start;
        console.log(`Connection response: ${response.status} in ${time}ms`);

        return {
            success: response.status !== 500,
            status: response.status,
            time
        };
    } catch (error) {
        console.error('Connection test failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function getCurrentUser() {
    try {
        const response = await authFetch('/users/me');

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch user data');
        }

        return response.json();
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
}

export async function getUserRoles() {
    try {
        const response = await authFetch('/users/roles');

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch user roles');
        }

        const data = await response.json();
        return data.role;
    } catch (error) {
        console.error('Get user roles error:', error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await authFetch('/users/logout', {
            method: 'POST'
        });

        return response.json();
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
} */

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

// Function to make authenticated requests with better error handling
const authFetch = async (endpoint, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
        // Get token from global context
        const token = global.authToken;

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
            const data = await authFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
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
            const data = await authFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            console.log('Registration successful:', data.user);
            return data;
        } catch (error) {
            console.error('Registration error:', error.message);
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const data = await authFetch('/auth/me');
            return data;
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            await authFetch('/auth/logout', { method: 'POST' });
            return true;
        } catch (error) {
            console.error('Logout error:', error);
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

            const response = await fetch(`${API_BASE}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(global.authToken ? { 'Authorization': `Bearer ${global.authToken}` } : {})
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
            const token = global.authToken;
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
export const API = {
    auth: authAPI,
    user: userAPI,
    admin: adminAPI,
    nutritionist: nutritionistAPI,
    mealPlan: mealPlanAPI,
    tracking: trackingAPI,
    food: foodAPI,
    utility: utilityAPI
};

export default API;
