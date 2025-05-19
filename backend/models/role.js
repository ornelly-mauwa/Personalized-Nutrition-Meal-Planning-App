// models/User.js
'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Email must be a valid email address'
                }
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        date_of_birth: {
            type: DataTypes.DATEONLY
        },
        gender: {
            type: DataTypes.STRING(50)
        },
        phone: {
            type: DataTypes.STRING(20)
        },
        profile_picture: {
            type: DataTypes.STRING(255)
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        last_login: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'users',
        timestamps: false,
        hooks: {
            // Hash password before saving
            beforeCreate: async (user) => {
                if (user.password_hash) {
                    const salt = await bcrypt.genSalt(10);
                    user.password_hash = await bcrypt.hash(user.password_hash, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password_hash')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password_hash = await bcrypt.hash(user.password_hash, salt);
                }
            }
        }
    });

    // Instance method to check password
    User.prototype.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password_hash);
    };

    // Associations
    User.associate = (models) => {
        // User has many roles (many-to-many)
        User.belongsToMany(models.Role, {
            through: 'user_roles',
            foreignKey: 'user_id',
            as: 'roles'
        });

        // User has one nutritionist profile
        User.hasOne(models.NutritionistProfile, {
            foreignKey: 'user_id',
            as: 'nutritionist_profile'
        });

        // User has one health profile
        User.hasOne(models.UserHealthProfile, {
            foreignKey: 'user_id',
            as: 'health_profile'
        });

        // User has many allergies
        User.hasMany(models.UserAllergy, {
            foreignKey: 'user_id',
            as: 'allergies'
        });

        // User created many food items
        User.hasMany(models.FoodItem, {
            foreignKey: 'created_by',
            as: 'created_food_items'
        });

        // User created many meal plan templates
        User.hasMany(models.MealPlanTemplate, {
            foreignKey: 'created_by',
            as: 'created_templates'
        });

        // User has many meal plans
        User.hasMany(models.UserMealPlan, {
            foreignKey: 'user_id',
            as: 'meal_plans'
        });

        // User created many meal plans (as nutritionist)
        User.hasMany(models.UserMealPlan, {
            foreignKey: 'created_by',
            as: 'created_meal_plans'
        });

        // User has many meal logs
        User.hasMany(models.UserMealLog, {
            foreignKey: 'user_id',
            as: 'meal_logs'
        });

        // User has many weight logs
        User.hasMany(models.UserWeightLog, {
            foreignKey: 'user_id',
            as: 'weight_logs'
        });

        // User is assigned to many nutritionists
        User.belongsToMany(models.User, {
            through: 'nutritionist_assignments',
            foreignKey: 'user_id',
            as: 'assigned_nutritionists',
            otherKey: 'nutritionist_id'
        });

        // User (as nutritionist) has many assigned users
        User.belongsToMany(models.User, {
            through: 'nutritionist_assignments',
            foreignKey: 'nutritionist_id',
            as: 'assigned_users',
            otherKey: 'user_id'
        });

        // User has many system logs
        User.hasMany(models.SystemLog, {
            foreignKey: 'user_id',
            as: 'system_logs'
        });
    };

    return User;
};