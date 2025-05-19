// models/UserHealthProfile.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserHealthProfile = sequelize.define('UserHealthProfile', {
        profile_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE'
        },
        height: {
            type: DataTypes.DECIMAL(5, 2),
            comment: 'in cm'
        },
        current_weight: {
            type: DataTypes.DECIMAL(5, 2),
            comment: 'in kg'
        },
        target_weight: {
            type: DataTypes.DECIMAL(5, 2),
            comment: 'in kg'
        },
        activity_level: {
            type: DataTypes.STRING(50),
            comment: 'sedentary, light, moderate, very active, etc.'
        },
        health_conditions: {
            type: DataTypes.TEXT
        },
        dietary_preferences: {
            type: DataTypes.TEXT
        },
        last_updated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'user_health_profiles',
        timestamps: false
    });

    // Associations
    UserHealthProfile.associate = (models) => {
        // UserHealthProfile belongs to User
        UserHealthProfile.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return UserHealthProfile;
};