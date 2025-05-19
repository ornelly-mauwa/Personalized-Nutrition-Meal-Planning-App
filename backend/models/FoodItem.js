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

    // Associations with debugging and error checking
    FoodItem.associate = (models) => {
        console.log('=== Debugging FoodItem associations ===');
        console.log('Available models:', Object.keys(models));

        // FoodItem belongs to creator User
        if (models.User) {
            FoodItem.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'creator'
            });
            console.log('✅ FoodItem.belongsTo User - OK');
        } else {
            console.error('❌ User model not found for FoodItem association');
        }

        // FoodItem has many template meal items
        if (models.TemplateMealItem) {
            FoodItem.hasMany(models.TemplateMealItem, {
                foreignKey: 'food_id',
                as: 'template_meal_items'
            });
            console.log('✅ FoodItem.hasMany TemplateMealItem - OK');
        } else {
            console.error('❌ TemplateMealItem model not found');
        }

        // FoodItem has many plan meal items (using the correct model name)
        if (models.UserMealPlanItem) {
            FoodItem.hasMany(models.UserMealPlanItem, {
                foreignKey: 'food_id',
                as: 'plan_meal_items'
            });
            console.log('✅ FoodItem.hasMany UserMealPlanItem - OK');
        } else {
            console.error('❌ UserMealPlanItem model not found (you might need to create this association)');
        }

        // FoodItem has many log food items (this model seems to be missing)
        // Comment this out until you create the LogFoodItem model or find the correct model name
        // if (models.LogFoodItem) {
        //     FoodItem.hasMany(models.LogFoodItem, {
        //         foreignKey: 'food_id',
        //         as: 'log_food_items'
        //     });
        //     console.log('✅ FoodItem.hasMany LogFoodItem - OK');
        // } else {
        //     console.error('❌ LogFoodItem model not found');
        // }

        console.log('=== FoodItem associations completed ===');
    };

    return FoodItem;
};