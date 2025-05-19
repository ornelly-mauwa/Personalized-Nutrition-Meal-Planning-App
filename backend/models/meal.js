'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Meal.init({
    mealPlanId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    day: DataTypes.INTEGER,
    time: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Meal',
  });
  return Meal;
};