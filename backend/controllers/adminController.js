// controllers/adminController.js
import User from '../models/userModel.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'isApproved'],
        });
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
};
// controllers/adminController.js
export const approveNutritionist = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user || user.role !== 'nutritionist') {
            return res.status(404).json({ error: "Nutritionist not found" });
        }

        user.isApproved = true; // or user.status = 'approved'
        await user.save();

        res.json({ message: "Nutritionist approved", user });
    } catch (error) {
        console.error("Error approving nutritionist:", error);
        res.status(500).json({ error: "Failed to approve nutritionist" });
    }
};
export const rejectNutritionist = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user || user.role !== 'nutritionist') {
            return res.status(404).json({ error: "Nutritionist not found" });
        }
        user.isApproved = false; // or user.status = 'rejected'
        await user.save();
        res.json({ message: "Nutritionist rejected", user });
    } catch (error) {
        console.error("Error rejecting nutritionist:", error);
        res.status(500).json({ error: "Failed to reject nutritionist" });
    }
};  