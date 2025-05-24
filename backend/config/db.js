// db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
});

export const connectToDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL via Sequelize');
    } catch (error) {
        console.error('❌ Sequelize connection error:', error.message);
        process.exit(1);
    }
};

export default sequelize;
