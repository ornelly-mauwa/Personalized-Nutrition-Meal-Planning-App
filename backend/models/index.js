import User from './userModel.js';
import MealPlan from './mealPlanModel.js';
import Meal from './mealModel.js';
import MealLog from './mealLogModel.js';
import WeightLog from './weightLogModel.js';
import Profile from './profileModel.js';
// MealPlan belongs to a user and nutritionist
MealPlan.belongsTo(User, { as: 'user', foreignKey: 'userId' });
MealPlan.belongsTo(User, { as: 'nutritionist', foreignKey: 'nutritionistId' });
User.hasMany(MealPlan, { foreignKey: 'userId', as: 'assignedPlans' });
User.hasMany(MealPlan, { foreignKey: 'nutritionistId', as: 'createdPlans' });

// Meal belongs to MealPlan
Meal.belongsTo(MealPlan, { foreignKey: 'mealPlanId' });
MealPlan.hasMany(Meal, { foreignKey: 'mealPlanId' });

// MealLog and WeightLog belong to User
MealLog.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(MealLog, { foreignKey: 'userId' });

WeightLog.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(WeightLog, { foreignKey: 'userId' });

User.hasOne(Profile, { foreignKey: 'userId' });
Profile.belongsTo(User, { foreignKey: 'userId' });

export default {
    User,
    MealPlan,
    Meal,
    MealLog,
    WeightLog,
    Profile,
};