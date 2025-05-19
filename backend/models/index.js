'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/config');

// Get environment-specific config
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: true
    }
  });
}

// Import all models
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Role = require('./Role')(sequelize, Sequelize.DataTypes);
const UserHealthProfile = require('./UserHealthProfile')(sequelize, Sequelize.DataTypes);
const NutritionistProfile = require('./nutritionistProfile')(sequelize, Sequelize.DataTypes);
const UserAllergy = require('./UserAllergy')(sequelize, Sequelize.DataTypes);
const FoodItem = require('./FoodItem')(sequelize, Sequelize.DataTypes);
const MealType = require('./MealType')(sequelize, Sequelize.DataTypes);
const TemplateMeal = require('./TemplateMeal')(sequelize, Sequelize.DataTypes);
const TemplateMealItem = require('./TemplateMealItem')(sequelize, Sequelize.DataTypes);
const UserMealPlan = require('./UserMealPlan')(sequelize, Sequelize.DataTypes);
const UserMealPlanItem = require('./UserMealPlanItem')(sequelize, Sequelize.DataTypes);
const MealLog = require('./MealLog')(sequelize, Sequelize.DataTypes);
const WeightLog = require('./WeightLog')(sequelize, Sequelize.DataTypes);
const NutritionistClient = require('./NutritionistClient')(sequelize, Sequelize.DataTypes);

// Create models object
const models = {
  User,
  Role,
  UserHealthProfile,
  NutritionistProfile,
  UserAllergy,
  FoodItem,
  MealType,
  TemplateMeal,
  TemplateMealItem,
  UserMealPlan,
  UserMealPlanItem,
  MealLog,
  WeightLog,
  NutritionistClient,
  sequelize,
  Sequelize
};

// Set up associations defined in each model
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Additional explicit associations (if not defined in individual model files)
// User allergies (many-to-many)
User.belongsToMany(FoodItem, {
  through: UserAllergy,
  as: 'allergies',
  foreignKey: 'user_id',
  otherKey: 'food_item_id'
});

FoodItem.belongsToMany(User, {
  through: UserAllergy,
  as: 'allergicUsers',
  foreignKey: 'food_item_id',
  otherKey: 'user_id'
});

// Nutritionist-Client relationship (many-to-many)
User.belongsToMany(User, {
  through: NutritionistClient,
  as: 'clients',
  foreignKey: 'nutritionist_id',
  otherKey: 'client_id'
});

User.belongsToMany(User, {
  through: NutritionistClient,
  as: 'nutritionists',
  foreignKey: 'client_id',
  otherKey: 'nutritionist_id'
});

module.exports = models;