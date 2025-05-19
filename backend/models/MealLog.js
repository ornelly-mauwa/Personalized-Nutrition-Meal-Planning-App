// models/mealLog.js
module.exports = (sequelize, DataTypes) => {
    const MealLog = sequelize.define('MealLog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        meal_plan_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'UserMealPlans',
                key: 'id'
            }
        },
        meal_type_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'MealTypes',
                key: 'id'
            }
        },
        food_item_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'FoodItems',
                key: 'id'
            }
        },
        logged_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        logged_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        quantity: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false
        },
        calories: {
            type: DataTypes.INTEGER
        },
        protein: {
            type: DataTypes.DECIMAL(5, 2)
        },
        carbs: {
            type: DataTypes.DECIMAL(5, 2)
        },
        fats: {
            type: DataTypes.DECIMAL(5, 2)
        },
        fiber: {
            type: DataTypes.DECIMAL(5, 2)
        },
        sugar: {
            type: DataTypes.DECIMAL(5, 2)
        },
        sodium: {
            type: DataTypes.DECIMAL(8, 2)
        },
        is_planned_meal: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        tableName: 'meal_logs'
    });

    MealLog.associate = (models) => {
        MealLog.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id'
        });
        MealLog.belongsTo(models.UserMealPlan, {
            as: 'mealPlan',
            foreignKey: 'meal_plan_id'
        });
        MealLog.belongsTo(models.MealType, {
            as: 'mealType',
            foreignKey: 'meal_type_id'
        });
        MealLog.belongsTo(models.FoodItem, {
            as: 'foodItem',
            foreignKey: 'food_item_id'
        });
    };

    return MealLog;
};