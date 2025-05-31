import useprofile from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { Profile, User } = useprofile;

// Get a user's profile
export const getProfile = async (req, res) => {
    try {
        // FIX: Get userId from authenticated user's id property
        const userId = req.user.id; // Changed from req.user.userId to req.user.id

        console.log('=== GET PROFILE DEBUG ===');
        console.log('User ID from token:', userId);

        const profile = await Profile.findOne({
            where: { userId },
            include: [{ model: User, attributes: ['username', 'email', 'role'] }],
        });

        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        res.json({
            profile,
            token: req.token // Include existing token if needed
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

export const createProfile = async (req, res) => {
    try {
        console.log('=== CREATE PROFILE DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);
        console.log('Authenticated user:', req.user);
        console.log('req.user type:', typeof req.user);
        console.log('req.user exists:', !!req.user);

        // Check if req.user exists
        if (!req.user) {
            console.log('ERROR: req.user is undefined - authentication middleware not working');
            return res.status(401).json({ error: 'Authentication required' });
        }

        console.log('Available properties on req.user:', Object.keys(req.user));
        console.log('userId from req.user.id:', req.user.id); // Changed log message
        console.log('userId type:', typeof req.user.id); // Changed to check req.user.id

        // FIX: Get userId from req.user.id instead of req.user.userId
        const userId = req.user.id;

        // Additional check for userId
        if (!userId) {
            console.log('ERROR: userId is undefined or null');
            console.log('Trying alternative properties...');
            console.log('req.user.id:', req.user.id);
            console.log('req.user._id:', req.user._id);
            console.log('req.user.dataValues.id:', req.user.dataValues?.id);
            return res.status(400).json({ error: 'User ID not found in token' });
        }

        const { age, weight, height, gender, goalCalories, goalProtein, goalCarbs, goalFats, allergies } = req.body;

        const existing = await Profile.findOne({ where: { userId } });
        if (existing) return res.status(400).json({ error: 'Profile already exists' });

        const profile = await Profile.create({
            userId,
            age,
            weight,
            height,
            gender,
            goalCalories,
            goalProtein,
            goalCarbs,
            goalFats,
            allergies,
        });

        console.log('Profile created:', profile);

        // FIX: Generate token with correct user data from req.user properties
        const token = jwt.sign(
            {
                userId: req.user.id, // Changed from req.user.userId
                username: req.user.username || req.user.dataValues?.username,
                email: req.user.email || req.user.dataValues?.email,
                role: req.user.role || req.user.dataValues?.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Token generated:', token ? 'Yes' : 'No');
        console.log('Token length:', token ? token.length : 0);
        console.log('Full token:', token);

        // Prepare response object
        const responseObj = {
            message: 'Profile created successfully',
            profile: profile,
            token: token,
            user: {
                id: req.user.id, // Changed from req.user.userId
                username: req.user.username || req.user.dataValues?.username,
                email: req.user.email || req.user.dataValues?.email
            }
        };

        console.log('=== RESPONSE DEBUG ===');
        console.log('Response object keys:', Object.keys(responseObj));
        console.log('Token in response:', responseObj.token ? 'Present' : 'Missing');
        console.log('Token value in response:', responseObj.token);
        console.log('Response status: 201');

        res.status(201).json(responseObj);

        console.log('=== RESPONSE SENT ===');
        console.log('Response has been sent to client');

    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
};

// Update a user's profile
export const updateProfile = async (req, res) => {
    try {
        console.log('=== UPDATE PROFILE DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Authenticated user:', req.user);

        // FIX: Get userId from authenticated user's id property
        const userId = req.user.id; // Changed from req.user.userId
        const updates = req.body;

        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        await profile.update(updates);

        // FIX: Include token in response with correct user data
        const token = jwt.sign(
            {
                userId: req.user.id, // Changed from req.user.userId
                username: req.user.username || req.user.dataValues?.username,
                email: req.user.email || req.user.dataValues?.email,
                role: req.user.role || req.user.dataValues?.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Profile updated successfully',
            profile: profile,
            token: token
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: err.message });
    }
};

// Delete a user's profile (optional)
export const deleteProfile = async (req, res) => {
    try {
        console.log('=== DELETE PROFILE DEBUG ===');
        console.log('Authenticated user:', req.user);

        // FIX: Get userId from authenticated user's id property
        const userId = req.user.id; // Changed from req.user.userId

        const profile = await Profile.findOne({ where: { userId } });

        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        await profile.destroy();
        res.json({ message: 'Profile deleted' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ error: 'Failed to delete profile' });
    }
};