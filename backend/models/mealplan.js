'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MealPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MealPlan.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    nutritionistId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    goal: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MealPlan',
  });
  return MealPlan;
};