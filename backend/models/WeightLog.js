// models/weightLog.js
module.exports = (sequelize, DataTypes) => {
    const WeightLog = sequelize.define('WeightLog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        weight: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        unit: {
            type: DataTypes.ENUM('kg', 'lbs'),
            defaultValue: 'kg'
        },
        logged_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        logged_time: {
            type: DataTypes.TIME,
            defaultValue: DataTypes.NOW
        },
        body_fat_percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        muscle_mass: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        tableName: 'weight_logs'
    });

    WeightLog.associate = (models) => {
        WeightLog.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id'
        });
    };

    return WeightLog;
};