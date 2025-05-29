import useprofile from '../models/index.js';
//import { use } from '../routers/nutritionistRoutes.js';

const { Profile, User } = useprofile;
// Get a user's profile
export const getProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const profile = await Profile.findOne({
            where: { userId },
            include: [{ model: User, attributes: ['username', 'email', 'role'] }],
        });

        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Create a profile (only if it doesn't exist)
export const createProfile = async (req, res) => {
    try {
        const { userId, age, weight, height, gender, goalCalories, goalProtein, goalCarbs, goalFats, allergies } = req.body;

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

        res.status(201).json(profile);
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
};

// Update a user's profile
export const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;

    try {
        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        await profile.update(updates);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Delete a user's profile (optional)
export const deleteProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const profile = await Profile.findOne({ where: { userId } });

        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        await profile.destroy();
        res.json({ message: 'Profile deleted' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ error: 'Failed to delete profile' });
    }
};
