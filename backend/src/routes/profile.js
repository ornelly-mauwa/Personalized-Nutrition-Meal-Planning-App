const express = require('express');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const NutritionistProfile = require('../models/NutritionistProfile');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Create/update user profile
router.post('/user', authenticate, authorize('user'), async (req, res) => {
    try {
        // Find existing profile or create new one
        let userProfile = await UserProfile.findOne({ userId: req.user._id });

        const profileData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            gender: req.body.gender,
            height: req.body.height,
            currentWeight: req.body.currentWeight,
            targetWeight: req.body.targetWeight,
            allergies: req.body.allergies || [],
            dietaryRestrictions: req.body.dietaryRestrictions || [],
            fitnessGoal: req.body.fitnessGoal,
            activityLevel: req.body.activityLevel
        };

        if (userProfile) {
            // Update existing profile
            Object.keys(profileData).forEach(key => {
                if (profileData[key] !== undefined) {
                    userProfile[key] = profileData[key];
                }
            });

            await userProfile.save();
        } else {
            // Create new profile
            userProfile = new UserProfile({
                userId: req.user._id,
                ...profileData
            });

            await userProfile.save();
        }

        res.send(userProfile);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get current user profile
router.get('/user/me', authenticate, authorize('user'), async (req, res) => {
    try {
        const userProfile = await UserProfile.findOne({ userId: req.user._id });

        if (!userProfile) {
            return res.status(404).send({ error: 'Profile not found' });
        }

        res.send(userProfile);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Create nutritionist profile (for already registered nutritionists)
router.post('/nutritionist', authenticate, authorize('nutritionist'), async (req, res) => {
    try {
        // Check if profile already exists
        let nutritionistProfile = await NutritionistProfile.findOne({ userId: req.user._id });

        if (nutritionistProfile) {
            return res.status(400).send({ error: 'Nutritionist profile already exists' });
        }

        // Create new profile
        nutritionistProfile = new NutritionistProfile({
            userId: req.user._id,
            qualification: req.body.qualification,
            specialization: req.body.specialization,
            bio: req.body.bio,
            contactInfo: req.body.contactInfo
        });

        await nutritionistProfile.save();
        res.status(201).send(nutritionistProfile);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Update nutritionist profile
router.patch('/nutritionist', authenticate, authorize('nutritionist'), async (req, res) => {
    try {
        const nutritionistProfile = await NutritionistProfile.findOne({ userId: req.user._id });

        if (!nutritionistProfile) {
            return res.status(404).send({ error: 'Nutritionist profile not found' });
        }

        const updates = req.body;
        const allowedUpdates = ['qualification', 'specialization', 'bio', 'contactInfo'];

        const isValidOperation = Object.keys(updates).every(update =>
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates' });
        }

        Object.keys(updates).forEach(update => {
            nutritionistProfile[update] = updates[update];
        });

        await nutritionistProfile.save();
        res.send(nutritionistProfile);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get nutritionist profile
router.get('/nutritionist/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.role !== 'nutritionist') {
            return res.status(404).send({ error: 'Nutritionist not found' });
        }

        const nutritionistProfile = await NutritionistProfile.findOne({ userId: req.params.id });

        if (!nutritionistProfile) {
            return res.status(404).send({ error: 'Nutritionist profile not found' });
        }

        // Only return approved nutritionist profiles to regular users
        if (req.user.role === 'user' && !nutritionistProfile.isApproved) {
            return res.status(404).send({ error: 'Nutritionist profile not found' });
        }

        res.send(nutritionistProfile);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Admin approve nutritionist profile
router.patch('/nutritionist/:id/approve', authenticate, authorize('admin'), async (req, res) => {
    try {
        const nutritionistProfile = await NutritionistProfile.findOne({ userId: req.params.id });

        if (!nutritionistProfile) {
            return res.status(404).send({ error: 'Nutritionist profile not found' });
        }

        nutritionistProfile.isApproved = true;
        nutritionistProfile.approvedAt = new Date();
        nutritionistProfile.approvedBy = req.user._id;

        await nutritionistProfile.save();
        res.send(nutritionistProfile);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// List all nutritionists (for users to browse)
router.get('/nutritionists', authenticate, async (req, res) => {
    try {
        const query = { isApproved: true };

        // Filter by specialization if provided
        if (req.query.specialization) {
            query.specialization = { $regex: req.query.specialization, $options: 'i' };
        }

        const nutritionistProfiles = await NutritionistProfile.find(query)
            .populate('userId', 'email'); // Get associated user data

        res.send(nutritionistProfiles);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Admin get all pending nutritionist approvals
router.get('/nutritionist/approvals/pending', authenticate, authorize('admin'), async (req, res) => {
    try {
        const pendingProfiles = await NutritionistProfile.find({ isApproved: false })
            .populate('userId', 'email');

        res.send(pendingProfiles);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get user profile (for nutritionists)
router.get('/user/:id', authenticate, authorize('nutritionist'), async (req, res) => {
    try {
        // Check if nutritionist has a meal plan for this user
        const hasMealPlan = await MealPlan.findOne({
            nutritionistId: req.user._id,
            userId: req.params.id
        });

        if (!hasMealPlan) {
            return res.status(403).send({ error: 'Unauthorized to view this profile' });
        }

        const userProfile = await UserProfile.findOne({ userId: req.params.id });

        if (!userProfile) {
            return res.status(404).send({ error: 'User profile not found' });
        }

        res.send(userProfile);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;