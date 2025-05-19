/*// models/User.js
'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email must be a valid email address'
        }
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY
    },
    gender: {
      type: DataTypes.STRING(50)
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    profile_picture: {
      type: DataTypes.STRING(255)
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    last_login: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'users',
    timestamps: false,
    hooks: {
      // Hash password before saving
      beforeCreate: async (user) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      }
    }
  });

  // Instance method to check password
  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password_hash);
  };

  // Associations with debugging
  User.associate = (models) => {
    console.log('=== Debugging User associations ===');
    console.log('Available models:', Object.keys(models));

    // Check each model before creating associations
    const requiredModels = [
      'Role', 'NutritionistProfile', 'UserHealthProfile', 'UserAllergy',
      'FoodItem', 'MealPlanTemplate', 'UserMealPlan', 'UserMealLog',
      'UserWeightLog', 'SystemLog'
    ];

    requiredModels.forEach(modelName => {
      if (!models[modelName]) {
        console.error(`❌ Missing model: ${modelName}`);
      } else {
        console.log(`✅ Found model: ${modelName}`);
      }
    });

    // User has many roles (many-to-many)
    if (models.Role) {
      User.belongsToMany(models.Role, {
        through: 'user_roles',
        foreignKey: 'user_id',
        as: 'roles'
      });
    }

    // User has one nutritionist profile
    if (models.NutritionistProfile) {
      User.hasOne(models.NutritionistProfile, {
        foreignKey: 'user_id',
        as: 'nutritionist_profile'
      });
    }

    // User has one health profile
    if (models.UserHealthProfile) {
      User.hasOne(models.UserHealthProfile, {
        foreignKey: 'user_id',
        as: 'health_profile'
      });
    }

    // User has many allergies
    if (models.UserAllergy) {
      User.hasMany(models.UserAllergy, {
        foreignKey: 'user_id',
        as: 'allergies'
      });
    }

    // User created many food items
    if (models.FoodItem) {
      User.hasMany(models.FoodItem, {
        foreignKey: 'created_by',
        as: 'created_food_items'
      });
    }

    // User created many meal plan templates
    if (models.MealPlanTemplate) {
      User.hasMany(models.MealPlanTemplate, {
        foreignKey: 'created_by',
        as: 'created_templates'
      });
    }

    // User has many meal plans
    if (models.UserMealPlan) {
      User.hasMany(models.UserMealPlan, {
        foreignKey: 'user_id',
        as: 'meal_plans'
      });

      // User created many meal plans (as nutritionist)
      User.hasMany(models.UserMealPlan, {
        foreignKey: 'created_by',
        as: 'created_meal_plans'
      });
    }

    // User has many meal logs
    if (models.UserMealLog) {
      User.hasMany(models.UserMealLog, {
        foreignKey: 'user_id',
        as: 'meal_logs'
      });
    }

    // User has many weight logs
    if (models.UserWeightLog) {
      User.hasMany(models.UserWeightLog, {
        foreignKey: 'user_id',
        as: 'weight_logs'
      });
    }

    // User is assigned to many nutritionists
    // User (as nutritionist) has many assigned users
    // Note: Self-referencing associations use the same model (User)
    User.belongsToMany(models.User, {
      through: 'nutritionist_assignments',
      foreignKey: 'user_id',
      as: 'assigned_nutritionists',
      otherKey: 'nutritionist_id'
    });

    User.belongsToMany(models.User, {
      through: 'nutritionist_assignments',
      foreignKey: 'nutritionist_id',
      as: 'assigned_users',
      otherKey: 'user_id'
    });

    // User has many system logs
    if (models.SystemLog) {
      User.hasMany(models.SystemLog, {
        foreignKey: 'user_id',
        as: 'system_logs'
      });
    }

    console.log('=== User associations completed ===');
  };

  return User;
};*/
// models/User.js
'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email must be a valid email address'
        }
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY
    },
    gender: {
      type: DataTypes.STRING(50)
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    profile_picture: {
      type: DataTypes.STRING(255)
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    last_login: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'users',
    timestamps: false,
    hooks: {
      // Hash password before saving
      beforeCreate: async (user) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      }
    }
  });

  // Instance method to check password
  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password_hash);
  };

  // Associations with debugging
  User.associate = (models) => {
    console.log('=== Debugging User associations ===');
    console.log('Available models:', Object.keys(models));

    // Check each model before creating associations
    const requiredModels = [
      'Role', 'NutritionistProfile', 'UserHealthProfile', 'UserAllergy',
      'FoodItem', 'TemplateMeal', 'UserMealPlan', 'MealLog',
      'WeightLog'
    ];

    requiredModels.forEach(modelName => {
      if (!models[modelName]) {
        console.error(`❌ Missing model: ${modelName}`);
      } else {
        console.log(`✅ Found model: ${modelName}`);
      }
    });

    // User has many roles (many-to-many)
    if (models.Role) {
      User.belongsToMany(models.Role, {
        through: 'user_roles',
        foreignKey: 'user_id',
        as: 'roles'
      });
    }

    // User has one nutritionist profile
    if (models.NutritionistProfile) {
      User.hasOne(models.NutritionistProfile, {
        foreignKey: 'user_id',
        as: 'nutritionist_profile'
      });
    }

    // User has one health profile
    if (models.UserHealthProfile) {
      User.hasOne(models.UserHealthProfile, {
        foreignKey: 'user_id',
        as: 'health_profile'
      });
    }

    // User has many allergies
    if (models.UserAllergy) {
      User.hasMany(models.UserAllergy, {
        foreignKey: 'user_id',
        as: 'allergies'
      });
    }

    // User created many food items
    if (models.FoodItem) {
      User.hasMany(models.FoodItem, {
        foreignKey: 'created_by',
        as: 'created_food_items'
      });
    }

    // User created many meal plan templates
    if (models.TemplateMeal) {
      User.hasMany(models.TemplateMeal, {
        foreignKey: 'created_by',
        as: 'created_templates'
      });
    }

    // User has many meal plans
    if (models.UserMealPlan) {
      User.hasMany(models.UserMealPlan, {
        foreignKey: 'user_id',
        as: 'meal_plans'
      });

      // User created many meal plans (as nutritionist)
      User.hasMany(models.UserMealPlan, {
        foreignKey: 'created_by',
        as: 'created_meal_plans'
      });
    }

    // User has many meal logs
    if (models.MealLog) {
      User.hasMany(models.MealLog, {
        foreignKey: 'user_id',
        as: 'meal_logs'
      });
    }

    // User has many weight logs
    if (models.WeightLog) {
      User.hasMany(models.WeightLog, {
        foreignKey: 'user_id',
        as: 'weight_logs'
      });
    }

    // User is assigned to many nutritionists
    // User (as nutritionist) has many assigned users
    // Note: Self-referencing associations use the same model (User)
    User.belongsToMany(models.User, {
      through: 'nutritionist_assignments',
      foreignKey: 'user_id',
      as: 'assigned_nutritionists',
      otherKey: 'nutritionist_id'
    });

    User.belongsToMany(models.User, {
      through: 'nutritionist_assignments',
      foreignKey: 'nutritionist_id',
      as: 'assigned_users',
      otherKey: 'user_id'
    });

    // User has many system logs (comment out if SystemLog doesn't exist)
    // if (models.SystemLog) {
    //   User.hasMany(models.SystemLog, {
    //     foreignKey: 'user_id',
    //     as: 'system_logs'
    //   });
    // }

    console.log('=== User associations completed ===');
  };

  return User;
};