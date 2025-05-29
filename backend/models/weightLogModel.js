// models/WeightLog.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const WeightLog = sequelize.define('WeightLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default WeightLog;
