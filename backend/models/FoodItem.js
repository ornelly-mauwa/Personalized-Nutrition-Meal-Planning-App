// models/FoodItem.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const FoodItem = sequelize.define('FoodItem', {
        food_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        serving_size: {
            type: DataTypes.STRING(100)
        },
        calories: {
            type: DataTypes.INTEGER
        },
        protein: {
            type: DataTypes.DECIMAL(5, 2),
            comment: 'in grams'
        },
        carbs: {
            type: DataTypes.DECIMAL(5, 2),
            comment: 'in grams'
        },
        fat: {
            type: DataTypes.DECIMAL(5, 2),
            comment: 'in grams'
        },
        fiber: {
            type: DataTypes.DECIMAL(5, 2),
            comment: 'in grams'
        },
        sugar: {
            type: DataTypes.DECIMAL(5, 2),
            comment: 'in grams'
        },
        sodium: {
            type: DataTypes.DECIMAL(5, 2),
            comment: 'in mg'
        },
        created_by: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'food_items',
        timestamps: false
    });

    // Associations
    FoodItem.associate = (models) => {
        // FoodItem belongs to creator User
        FoodItem.belongsTo(models.User, {
            foreignKey: 'created_by',
            as: 'creator'
        });

        // FoodItem has many template meal items
        FoodItem.hasMany(models.TemplateMealItem, {
            foreignKey: 'food_id',
            as: 'template_meal_items'
        });

        // FoodItem has many plan meal items
        FoodItem.hasMany(models.PlanMealItem, {
            foreignKey: 'food_id',
            as: 'plan_meal_items'
        });

        // FoodItem has many log food items
        FoodItem.hasMany(models.LogFoodItem, {
            foreignKey: 'food_id',
            as: 'log_food_items'
        });
    };

    return FoodItem;
};