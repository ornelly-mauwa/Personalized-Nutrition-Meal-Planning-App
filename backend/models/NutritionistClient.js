// models/nutritionistClient.js
module.exports = (sequelize, DataTypes) => {
    const NutritionistClient = sequelize.define('NutritionistClient', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nutritionist_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        client_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        assigned_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'completed'),
            defaultValue: 'active'
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        tableName: 'nutritionist_clients',
        indexes: [
            {
                unique: true,
                fields: ['nutritionist_id', 'client_id']
            }
        ]
    });

    NutritionistClient.associate = (models) => {
        NutritionistClient.belongsTo(models.User, {
            as: 'nutritionist',
            foreignKey: 'nutritionist_id'
        });
        NutritionistClient.belongsTo(models.User, {
            as: 'client',
            foreignKey: 'client_id'
        });
    };

    return NutritionistClient;
};