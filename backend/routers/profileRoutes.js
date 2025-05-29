// routes/profileRoutes.js
import express from 'express';
import {
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile
} from '../controllers/profileController.js';

import authMiddleware from '../middleware/auth.js';
import { verifyUser } from '../middleware/verification.js';

const router = express.Router();

// All routes require user authentication and role verification
router.get('/', authMiddleware, verifyUser, getProfile);
router.post('/', authMiddleware, verifyUser, createProfile);
router.put('/', authMiddleware, verifyUser, updateProfile);
router.delete('/', authMiddleware, verifyUser, deleteProfile);

export default router;
