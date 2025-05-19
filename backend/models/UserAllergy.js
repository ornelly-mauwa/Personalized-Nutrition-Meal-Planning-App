// models/UserAllergy.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserAllergy = sequelize.define('UserAllergy', {
        allergy_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE'
        },
        allergy_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        severity: {
            type: DataTypes.STRING(50),
            comment: 'mild, moderate, severe'
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'user_allergies',
        timestamps: false
    });

    // Associations
    UserAllergy.associate = (models) => {
        // UserAllergy belongs to User
        UserAllergy.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return UserAllergy;
};