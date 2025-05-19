// models/MealType.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const MealType = sequelize.define('MealType', {
        type_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'meal_types',
        timestamps: false
    });

    // Associations
    MealType.associate = (models) => {
        // MealType has many template meals
        MealType.hasMany(models.TemplateMeal, {
            foreignKey: 'meal_type_id',
            as: 'template_meals'
        });

        // MealType has many plan meals
        MealType.hasMany(models.PlanMeal, {
            foreignKey: 'meal_type_id',
            as: 'plan_meals'
        });

        // MealType has many user meal logs
        MealType.hasMany(models.UserMealLog, {
            foreignKey: 'meal_type_id',
            as: 'meal_logs'
        });
    };

    return MealType;
};