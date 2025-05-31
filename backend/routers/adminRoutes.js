import express from 'express';
import {
    getAllUsers,
    deleteUser,
    approveNutritionist,
    rejectNutritionist
} from '../controllers/adminController.js';

import authMiddleware from '../middleware/auth.js'; // Make sure this is correct path
import { verifyAdmin } from '../middleware/verification.js'; // also fix this path if needed

const router = express.Router();

// Only an authenticated admin can access these routes
router.get('/users/:id', authMiddleware, verifyAdmin, getAllUsers);
router.put('/approve-nutritionist/:id', authMiddleware, verifyAdmin, approveNutritionist);
router.put('/reject-nutritionist/:id', authMiddleware, verifyAdmin, rejectNutritionist);

// Optionally, add delete route if needed
// router.delete('/users/:id', authMiddleware, verifyAdmin, deleteUser);

export default router;
