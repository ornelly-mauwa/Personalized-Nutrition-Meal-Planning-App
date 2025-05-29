// models/Profile.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

const Profile = sequelize.define('Profile', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  age: DataTypes.INTEGER,
  weight: DataTypes.FLOAT,
  height: DataTypes.FLOAT,
  gender: DataTypes.ENUM('male', 'female', 'other'),

  // GOALS
  goalCalories: DataTypes.INTEGER,
  goalProtein: DataTypes.INTEGER,
  goalCarbs: DataTypes.INTEGER,
  goalFats: DataTypes.INTEGER,

  // Allergies (JSON or comma-separated)
  allergies: {
    type: DataTypes.JSON, // or STRING if comma-separated
    defaultValue: [],
  },

  goals: DataTypes.STRING,
  activityLevel: DataTypes.STRING,
  dietPreferences: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },

}, {
  timestamps: true,
});

export default Profile;



