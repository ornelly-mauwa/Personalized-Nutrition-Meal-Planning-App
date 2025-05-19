
// utils/helpers.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Password utilities
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// JWT utilities
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Pagination utilities
const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        items,
        totalPages,
        currentPage,
        hasNext: currentPage < totalPages - 1,
        hasPrev: currentPage > 0
    };
};

// Date utilities
const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

const getDateRange = (days = 7) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
    };
};

const isDateInRange = (date, startDate, endDate) => {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return checkDate >= start && checkDate <= end;
};

// Nutritional calculation utilities
const calculateBMR = (weight, height, age, gender) => {
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return Math.round(bmr);
};

const calculateTDEE = (bmr, activityLevel) => {
    const activityFactors = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extremely_active': 1.9
    };

    const factor = activityFactors[activityLevel] || 1.2;
    return Math.round(bmr * factor);
};

const calculateMacros = (calories, goal) => {
    let proteinRatio, carbRatio, fatRatio;

    switch (goal) {
        case 'weight_loss':
            proteinRatio = 0.35;
            carbRatio = 0.25;
            fatRatio = 0.40;
            break;
        case 'muscle_gain':
            proteinRatio = 0.30;
            carbRatio = 0.45;
            fatRatio = 0.25;
            break;
        case 'weight_gain':
            proteinRatio = 0.25;
            carbRatio = 0.50;
            fatRatio = 0.25;
            break;
        default: // maintenance
            proteinRatio = 0.25;
            carbRatio = 0.45;
            fatRatio = 0.30;
    }

    return {
        protein: Math.round((calories * proteinRatio) / 4), // 4 calories per gram
        carbs: Math.round((calories * carbRatio) / 4),     // 4 calories per gram
        fats: Math.round((calories * fatRatio) / 9)        // 9 calories per gram
    };
};

const calculateNutritionFromFood = (foodItem, quantity, unit = 'g') => {
    // Convert quantity to grams if needed
    let quantityInGrams = quantity;

    // You can extend this with more unit conversions
    const conversionFactors = {
        'g': 1,
        'kg': 1000,
        'oz': 28.35,
        'lb': 453.59,
        'cup': 200, // approximate, varies by food
        'tbsp': 15,
        'tsp': 5
    };

    if (conversionFactors[unit]) {
        quantityInGrams = quantity * conversionFactors[unit];
    }

    const factor = quantityInGrams / 100; // Food items are per 100g

    return {
        calories: Math.round(foodItem.calories_per_100g * factor),
        protein: parseFloat((foodItem.protein_per_100g * factor).toFixed(2)),
        carbs: parseFloat((foodItem.carbs_per_100g * factor).toFixed(2)),
        fats: parseFloat((foodItem.fats_per_100g * factor).toFixed(2)),
        fiber: parseFloat(((foodItem.fiber_per_100g || 0) * factor).toFixed(2)),
        sugar: parseFloat(((foodItem.sugar_per_100g || 0) * factor).toFixed(2)),
        sodium: parseFloat(((foodItem.sodium_per_100g || 0) * factor).toFixed(2))
    };
};

// Response utilities
const sendResponse = (res, statusCode, success, message, data = null) => {
    const response = {
        success,
        message
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

const sendSuccess = (res, message, data = null, statusCode = 200) => {
    return sendResponse(res, statusCode, true, message, data);
};

// Array utilities
const removeDuplicates = (array, key) => {
    if (!key) {
        return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
};

const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = item[key];
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(item);
        return groups;
    }, {});
};

// String utilities
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const generateSlug = (str) => {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Validation utilities
const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

module.exports = {
    // Password utilities
    hashPassword,
    comparePassword,

    // JWT utilities
    generateToken,
    verifyToken,

    // Pagination utilities
    getPagination,
    getPagingData,

    // Date utilities
    formatDate,
    getDateRange,
    isDateInRange,

    // Nutritional calculation utilities
    calculateBMR,
    calculateTDEE,
    calculateMacros,
    calculateNutritionFromFood,

    // Response utilities
    sendResponse,
    sendError,
    sendSuccess,

    // Array utilities
    removeDuplicates,
    groupBy,

    // String utilities
    capitalize,
    generateSlug,

    // Validation utilities
    isValidUUID,
    isValidEmail
};