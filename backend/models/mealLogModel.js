// models/MealLog.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const MealLog = sequelize.define('MealLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATEONLY,
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

export default MealLog;
