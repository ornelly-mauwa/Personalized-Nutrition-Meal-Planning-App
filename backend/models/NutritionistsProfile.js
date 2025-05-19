// models/NutritionistProfile.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const NutritionistProfile = sequelize.define('NutritionistProfile', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE'
        },
        specialization: {
            type: DataTypes.STRING(100)
        },
        certification: {
            type: DataTypes.TEXT
        },
        experience_years: {
            type: DataTypes.INTEGER
        },
        bio: {
            type: DataTypes.TEXT
        },
        is_approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        approved_by: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        approved_at: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'nutritionist_profiles',
        timestamps: false
    });

    // Associations
    NutritionistProfile.associate = (models) => {
        // NutritionistProfile belongs to User
        NutritionistProfile.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        // NutritionistProfile belongs to approver User
        NutritionistProfile.belongsTo(models.User, {
            foreignKey: 'approved_by',
            as: 'approver'
        });
    };

    return NutritionistProfile;
};