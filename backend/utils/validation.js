const { body, param, query, validationResult } = require('express-validator');
const { User, Role, FoodItem } = require('../models');

// Custom validator to check if validation errors exist
const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Authentication validation rules
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .custom(async (email) => {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('Email already in use');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('username')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('First name can only contain letters and spaces'),

    body('roleId')
        .isInt({ min: 1 })
        .withMessage('Valid role ID is required')
        .custom(async (roleId) => {
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error('Invalid role selected');
            }
            return true;
        }),
    checkValidationErrors
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    checkValidationErrors
];

// User profile validation rules
const updateProfileValidation = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('First name can only contain letters and spaces'),
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('Last name can only contain letters and spaces'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .custom(async (email, { req }) => {
            const existingUser = await User.findOne({
                where: {
                    email,
                    id: { [require('sequelize').Op.ne]: req.user.id }
                }
            });
            if (existingUser) {
                throw new Error('Email already in use');
            }
            return true;
        }),
    checkValidationErrors
];

// Health profile validation rules
const healthProfileValidation = [
    body('age')
        .isInt({ min: 1, max: 120 })
        .withMessage('Age must be between 1 and 120'),
    body('gender')
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other'),
    body('height')
        .isFloat({ min: 50, max: 300 })
        .withMessage('Height must be between 50 and 300 cm'),
    body('weight')
        .isFloat({ min: 20, max: 500 })
        .withMessage('Weight must be between 20 and 500 kg'),
    body('activityLevel')
        .isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
        .withMessage('Invalid activity level'),
    body('goal')
        .isIn(['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle'])
        .withMessage('Invalid goal'),
    body('medicalConditions')
        .optional()
        .isArray()
        .withMessage('Medical conditions must be an array'),
    body('medicalConditions.*')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Each medical condition must be a string with max 100 characters'),
    checkValidationErrors
];

// Nutritionist profile validation rules
const nutritionistProfileValidation = [
    body('licenseNumber')
        .trim()
        .isLength({ min: 5, max: 50 })
        .withMessage('License number must be between 5 and 50 characters'),
    body('specializations')
        .isArray({ min: 1 })
        .withMessage('At least one specialization is required'),
    body('specializations.*')
        .isString()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Each specialization must be a string with max 100 characters'),
    body('experience')
        .isInt({ min: 0, max: 50 })
        .withMessage('Experience must be between 0 and 50 years'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Bio must not exceed 1000 characters'),
    checkValidationErrors
];

// Meal plan validation rules
const mealPlanValidation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Meal plan name must be between 3 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    body('startDate')
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    body('endDate')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((endDate, { req }) => {
            if (new Date(endDate) <= new Date(req.body.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),
    body('targetCalories')
        .isInt({ min: 800, max: 5000 })
        .withMessage('Target calories must be between 800 and 5000'),
    body('targetProtein')
        .isFloat({ min: 0, max: 500 })
        .withMessage('Target protein must be between 0 and 500g'),
    body('targetCarbs')
        .isFloat({ min: 0, max: 1000 })
        .withMessage('Target carbs must be between 0 and 1000g'),
    body('targetFats')
        .isFloat({ min: 0, max: 300 })
        .withMessage('Target fats must be between 0 and 300g'),
    checkValidationErrors
];

// Meal template validation rules
const mealTemplateValidation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Template name must be between 3 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    body('category')
        .isIn(['weight_loss', 'weight_gain', 'muscle_building', 'maintenance', 'medical'])
        .withMessage('Invalid template category'),
    body('templateMeals')
        .isArray({ min: 1 })
        .withMessage('At least one template meal is required'),
    checkValidationErrors
];

// Meal logging validation rules
const mealLogValidation = [
    body('mealTypeId')
        .isInt({ min: 1 })
        .withMessage('Valid meal type ID is required'),
    body('consumedAt')
        .isISO8601()
        .withMessage('Consumed at must be a valid date'),
    body('foodItems')
        .isArray({ min: 1 })
        .withMessage('At least one food item is required'),
    body('foodItems.*.foodItemId')
        .isInt({ min: 1 })
        .withMessage('Valid food item ID is required')
        .custom(async (foodItemId) => {
            const foodItem = await FoodItem.findByPk(foodItemId);
            if (!foodItem) {
                throw new Error('Food item not found');
            }
            return true;
        }),
    body('foodItems.*.quantity')
        .isFloat({ min: 0.1, max: 10000 })
        .withMessage('Quantity must be between 0.1 and 10000'),
    body('foodItems.*.unit')
        .isIn(['grams', 'ml', 'pieces', 'cups', 'tablespoons', 'teaspoons'])
        .withMessage('Invalid unit'),
    checkValidationErrors
];

// Weight tracking validation rules
const weightLogValidation = [
    body('weight')
        .isFloat({ min: 20, max: 500 })
        .withMessage('Weight must be between 20 and 500 kg'),
    body('loggedAt')
        .optional()
        .isISO8601()
        .withMessage('Logged at must be a valid date'),
    checkValidationErrors
];

// Food item validation rules
const foodItemValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Food name must be between 2 and 100 characters'),
    body('brand')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Brand must not exceed 100 characters'),
    body('caloriesPer100g')
        .isFloat({ min: 0, max: 1000 })
        .withMessage('Calories per 100g must be between 0 and 1000'),
    body('proteinPer100g')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Protein per 100g must be between 0 and 100g'),
    body('carbsPer100g')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Carbs per 100g must be between 0 and 100g'),
    body('fatsPer100g')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Fats per 100g must be between 0 and 100g'),
    body('fiberPer100g')
        .optional()
        .isFloat({ min: 0, max: 50 })
        .withMessage('Fiber per 100g must be between 0 and 50g'),
    body('sugarPer100g')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Sugar per 100g must be between 0 and 100g'),
    checkValidationErrors
];

// Allergy validation rules
const allergyValidation = [
    body('allergens')
        .isArray({ min: 1 })
        .withMessage('At least one allergen is required'),
    body('allergens.*')
        .isString()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Each allergen must be between 2 and 50 characters'),
    body('severity')
        .optional()
        .isIn(['mild', 'moderate', 'severe'])
        .withMessage('Severity must be mild, moderate, or severe'),
    checkValidationErrors
];

// Parameter validation rules
const idParamValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    checkValidationErrors
];

const userIdParamValidation = [
    param('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
    checkValidationErrors
];

// Query validation rules
const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    checkValidationErrors
];

const dateRangeValidation = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((endDate, { req }) => {
            if (req.query.startDate && new Date(endDate) <= new Date(req.query.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),
    checkValidationErrors
];

// Custom validators
const validateRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role.name)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Insufficient permissions'
            });
        }
        next();
    };
};

const validateOwnership = (resourcePath = 'userId') => {
    return (req, res, next) => {
        const resourceUserId = req.params[resourcePath] || req.body[resourcePath];

        // Admin can access any resource
        if (req.user.role.name === 'admin') {
            return next();
        }

        // Users can only access their own resources
        if (req.user.id.toString() !== resourceUserId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only access your own resources'
            });
        }

        next();
    };
};

const validateRegistration = (data) => {
    const errors = [];

    // Check required fields
    if (!data.email) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.push({ field: 'email', message: 'Email is invalid' });
    }

    if (!data.password) {
        errors.push({ field: 'password', message: 'Password is required' });
    } else if (data.password.length < 6) {
        errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    }

    // Since the frontend is sending username but backend needs firstName/lastName
    // We'll handle that here
    if (!data.username) {
        errors.push({ field: 'username', message: 'Username is required' });
    } else if (data.username.length < 3) {
        errors.push({ field: 'username', message: 'Username must be at least 3 characters' });
    }

    // For role validation
    const validRoles = ['user', 'nutritionist', 'admin'];
    if (data.role && !validRoles.includes(data.role)) {
        errors.push({ field: 'role', message: 'Invalid role selected' });
    }

    return errors;
};

const validateLogin = (data) => {
    const errors = [];

    if (!data.email) {
        errors.push({ field: 'email', message: 'Email is required' });
    }

    if (!data.password) {
        errors.push({ field: 'password', message: 'Password is required' });
    }

    return errors;
};

module.exports = {
    // Authentication
    registerValidation,
    loginValidation,

    // Profile management
    updateProfileValidation,
    healthProfileValidation,
    nutritionistProfileValidation,

    // Meal planning
    mealPlanValidation,
    mealTemplateValidation,

    // Tracking
    mealLogValidation,
    weightLogValidation,

    // Food management
    foodItemValidation,
    allergyValidation,

    // Parameter validation
    idParamValidation,
    userIdParamValidation,

    // Query validation
    paginationValidation,
    dateRangeValidation,

    // Custom validators
    validateRole,
    validateOwnership,
    checkValidationErrors,
    validateRegistration
};