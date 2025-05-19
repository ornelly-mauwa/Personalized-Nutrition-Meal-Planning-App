// models/TemplateMealItem.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const TemplateMealItem = sequelize.define('TemplateMealItem', {
        template_meal_item_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        template_meal_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'template_meals',
                key: 'template_meal_id'
            },
            onDelete: 'CASCADE'
        },
        food_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'food_items',
                key: 'food_id'
            }
        },
        quantity: {
            type: DataTypes.DECIMAL(6, 2)
        },
        unit: {
            type: DataTypes.STRING(50)
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'template_meal_items',
        timestamps: false
    });

    // Associations
    TemplateMealItem.associate = (models) => {
        // TemplateMealItem belongs to TemplateMeal
        TemplateMealItem.belongsTo(models.TemplateMeal, {
            foreignKey: 'template_meal_id',
            as: 'template_meal'
        });

        // TemplateMealItem belongs to FoodItem
        TemplateMealItem.belongsTo(models.FoodItem, {
            foreignKey: 'food_id',
            as: 'food_item'
        });
    };

    return TemplateMealItem;
};