// models/TemplateMeal.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const TemplateMeal = sequelize.define('TemplateMeal', {
        template_meal_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        template_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'meal_plan_templates',
                key: 'template_id'
            },
            onDelete: 'CASCADE'
        },
        meal_type_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'meal_types',
                key: 'type_id'
            }
        },
        day_of_week: {
            type: DataTypes.INTEGER,
            comment: '1 = Monday, 7 = Sunday'
        },
        name: {
            type: DataTypes.STRING(255)
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'template_meals',
        timestamps: false
    });

    // Associations
    TemplateMeal.associate = (models) => {
        // Comment out or remove the association with MealPlanTemplate
        // since it doesn't exist in your models
        /* 
        TemplateMeal.belongsTo(models.MealPlanTemplate, {
            foreignKey: 'template_id',
            as: 'template'
        });
        */

        // TemplateMeal belongs to MealType
        TemplateMeal.belongsTo(models.MealType, {
            foreignKey: 'meal_type_id',
            as: 'meal_type'
        });

        // TemplateMeal has many template meal items
        TemplateMeal.hasMany(models.TemplateMealItem, {
            foreignKey: 'template_meal_id',
            as: 'meal_items'
        });
    };

    return TemplateMeal;
};