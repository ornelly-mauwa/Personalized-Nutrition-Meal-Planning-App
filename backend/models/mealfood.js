'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MealFood extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MealFood.init({
    mealId: DataTypes.INTEGER,
    foodId: DataTypes.INTEGER,
    quantity: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'MealFood',
  });
  return MealFood;
};