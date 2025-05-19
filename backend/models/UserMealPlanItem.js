// models/userMealPlanItem.js
module.exports = (sequelize, DataTypes) => {
    const UserMealPlanItem = sequelize.define('UserMealPlanItem', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        meal_plan_id: {
            type: DataTypes.UUID,
            allowNull: false,
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
        day_of_week: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 7
            }
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
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        tableName: 'user_meal_plan_items'
    });

    UserMealPlanItem.associate = (models) => {
        UserMealPlanItem.belongsTo(models.UserMealPlan, {
            as: 'mealPlan',
            foreignKey: 'meal_plan_id'
        });
        UserMealPlanItem.belongsTo(models.MealType, {
            as: 'mealType',
            foreignKey: 'meal_type_id'
        });
        UserMealPlanItem.belongsTo(models.FoodItem, {
            as: 'foodItem',
            foreignKey: 'food_item_id'
        });
    };

    return UserMealPlanItem;
};