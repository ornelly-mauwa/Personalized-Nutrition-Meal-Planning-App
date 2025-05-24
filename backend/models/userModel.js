import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Your Sequelize connection

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50],
            notEmpty: true,
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 15],
        },
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'nutritionist'),
        defaultValue: 'user',
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verificationCode: {
        type: DataTypes.STRING,
    },
    verificationCodeValidation: {
        type: DataTypes.INTEGER,
    },
    forgotPasswordCode: {
        type: DataTypes.STRING,
    },
    forgotPasswordCodeValidation: {
        type: DataTypes.INTEGER,
    },
}, {
    timestamps: true,
});

export default User;
