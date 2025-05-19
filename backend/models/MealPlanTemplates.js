// models/MealPlanTemplate.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const MealPlanTemplate = sequelize.define('MealPlanTemplate', {
        template_id: {
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
        created_by: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        target_calories: {
            type: DataTypes.INTEGER
        },
        target_protein: {
            type: DataTypes.DECIMAL(5, 2)
        },
        target_carbs: {
            type: DataTypes.DECIMAL(5, 2)
        },
        target_fat: {
            type: DataTypes.DECIMAL(5, 2)
        },
        is_public: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'meal_plan_templates',
        timestamps: false
    });

    // Associations
    MealPlanTemplate.associate = (models) => {
        // MealPlanTemplate belongs to creator User
        MealPlanTemplate.belongsTo(models.User, {
            foreignKey: 'created_by',
            as: 'creator'
        });

        // MealPlanTemplate has many template meals
        MealPlanTemplate.hasMany(models.TemplateMeal, {
            foreignKey: 'template_id',
            as: 'meals'
        });

        // MealPlanTemplate has many user meal plans
        MealPlanTemplate.hasMany(models.UserMealPlan, {
            foreignKey: 'template_id',
            as: 'user_meal_plans'
        });
    };

    return MealPlanTemplate;
};