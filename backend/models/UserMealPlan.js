// models/userMealPlan.js
module.exports = (sequelize, DataTypes) => {
    const UserMealPlan = sequelize.define('UserMealPlan', {
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
        nutritionist_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
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
        target_fats: {
            type: DataTypes.DECIMAL(5, 2)
        },
        status: {
            type: DataTypes.ENUM('active', 'completed', 'paused', 'cancelled'),
            defaultValue: 'active'
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        tableName: 'user_meal_plans'
    });

    UserMealPlan.associate = (models) => {
        UserMealPlan.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id'
        });
        UserMealPlan.belongsTo(models.User, {
            as: 'nutritionist',
            foreignKey: 'nutritionist_id'
        });
        UserMealPlan.hasMany(models.UserMealPlanItem, {
            as: 'mealPlanItems',
            foreignKey: 'meal_plan_id'
        });
        UserMealPlan.hasMany(models.MealLog, {
            as: 'mealLogs',
            foreignKey: 'meal_plan_id'
        });
    };

    return UserMealPlan;
};