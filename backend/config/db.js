// config/db.js
const { sequelize } = require('../models');

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sync all models with database
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database synchronized successfully.');
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

const closeDB = async () => {
    try {
        await sequelize.close();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
};

module.exports = {
    connectDB,
    closeDB,
    sequelize
};