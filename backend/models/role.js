// models/Role.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        role_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'roles',
        timestamps: false
    });

    // Associations
    Role.associate = (models) => {
        // Role belongs to many users (many-to-many)
        Role.belongsToMany(models.User, {
            through: 'user_roles',
            foreignKey: 'role_id',
            as: 'users'
        });
    };

    return Role;
};