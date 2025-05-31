import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import sequelize from './config/db.js';
import { connectToDb } from './config/db.js';


import authRouter from './routers/authRoutes.js';
import mealPlanRoutes from './routers/mealPlanRoutes.js';
import mealLogRoutes from './routers/mealLogRoutes.js';
import weightLogRoutes from './routers/weightLogRoutes.js';
import adminRoutes from './routers/adminRoutes.js';
import trackingRoutes from './routers/trackingRoutes.js';
import profileRoutes from './routers/profileRoutes.js';
import mealSuggestionRoutes from './routers/mealsuggRoutes.js';
const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/meal-logs', mealLogRoutes);
app.use('/api/weight-logs', weightLogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/suggestions', mealSuggestionRoutes);
app.get('/', (req, res) => {
    res.json('Hello World from server');

});
const startServer = async () => {

    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Sync database models (creates tables if they don't exist)
        await sequelize.sync({
            force: false, // Set to true to recreate tables (WARNING: deletes data)
            alter: true   // Updates existing tables to match model definitions
        });
        console.log('✅ Database synced successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to database:', error);
        process.exit(1);
    }
};

startServer();


