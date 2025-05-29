// models/Meal.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Meal = sequelize.define('Meal', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    dayOfWeek: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mealType: {
        type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snacks'),
        allowNull: false,
    },
    name: DataTypes.STRING,
    calories: DataTypes.INTEGER,
    protein: DataTypes.INTEGER,
    carbs: DataTypes.INTEGER,
    fats: DataTypes.INTEGER,
}, {
    timestamps: true,
});

export default Meal;
