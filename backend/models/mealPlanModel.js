// models/MealPlan.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const MealPlan = sequelize.define('MealPlan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default MealPlan;
