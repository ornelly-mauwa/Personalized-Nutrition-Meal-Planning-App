// controllers/adminController.js
const { User, Role, NutritionistProfile, UserMealPlan } = require('../models');
const { validateRoleUpdate, validateNutritionistApproval } = require('../utils/validation');
const { Op } = require('sequelize');

/**
 * Controller for admin-specific operations
 */
class AdminController {
    /**
     * Get all users in the system
     */
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
                include: [
                    {
                        model: Role,
                        attributes: ['name']
                    }
                ],
                attributes: { exclude: ['password_hash'] } // Exclude sensitive information
            });

            return res.json(users);
        } catch (error) {
            console.error('Error getting all users:', error);
            return res.status(500).json({ message: 'Failed to retrieve users' });
        }
    }

    /**
     * Update a user's role
     */
    async updateUserRole(req, res) {
        try {
            const { error } = validateRoleUpdate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const userId = req.params.id;
            const { roleId } = req.body;

            // Validate that the user exists
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Validate that the role exists
            const role = await Role.findByPk(roleId);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            // Update the user's role
            await user.update({ roleId });

            return res.json({
                message: 'User role updated successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    role: role.name
                }
            });
        } catch (error) {
            console.error('Error updating user role:', error);
            return res.status(500).json({ message: 'Failed to update user role' });
        }
    }

    /**
     * Approve a nutritionist account
     */
    async approveNutritionist(req, res) {
        try {
            const { error } = validateNutritionistApproval(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const nutritionistId = req.params.id;
            const { approved } = req.body;

            // Find the nutritionist profile
            const nutritionistProfile = await NutritionistProfile.findOne({
                where: { userId: nutritionistId },
                include: [User]
            });

            if (!nutritionistProfile) {
                return res.status(404).json({ message: 'Nutritionist profile not found' });
            }

            // Update approval status
            await nutritionistProfile.update({ isApproved: approved });

            // If approving, make sure the user has the nutritionist role
            if (approved) {
                const nutritionistRole = await Role.findOne({
                    where: { name: 'nutritionist' }
                });

                if (nutritionistRole) {
                    await nutritionistProfile.User.update({ roleId: nutritionistRole.id });
                }
            }

            return res.json({
                message: `Nutritionist ${approved ? 'approved' : 'disapproved'} successfully`,
                nutritionist: {
                    id: nutritionistProfile.userId,
                    name: `${nutritionistProfile.User.firstName} ${nutritionistProfile.User.lastName}`,
                    isApproved: nutritionistProfile.isApproved
                }
            });
        } catch (error) {
            console.error('Error approving nutritionist:', error);
            return res.status(500).json({ message: 'Failed to update nutritionist approval status' });
        }
    }

    /**
     * Get admin dashboard statistics
     */
    async getDashboard(req, res) {
        try {
            // Count total users
            const userCount = await User.count();

            // Count users by role
            const usersByRole = await User.findAll({
                attributes: ['roleId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
                include: [
                    {
                        model: Role,
                        attributes: ['name']
                    }
                ],
                group: ['roleId', 'Role.id', 'Role.name']
            });

            // Count pending nutritionist approvals
            const pendingApprovals = await NutritionistProfile.count({
                where: { isApproved: false }
            });

            // Count active meal plans
            const activeMealPlans = await UserMealPlan.count({
                where: {
                    endDate: {
                        [Op.gte]: new Date()
                    }
                }
            });

            // Get recent registrations (last 10)
            const recentRegistrations = await User.findAll({
                attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'],
                include: [
                    {
                        model: Role,
                        attributes: ['name']
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: 10
            });

            // Get pending nutritionist approvals
            const pendingNutritionists = await NutritionistProfile.findAll({
                where: { isApproved: false },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt']
                    }
                ],
                order: [['createdAt', 'ASC']]
            });

            return res.json({
                userCount,
                usersByRole,
                pendingApprovals,
                activeMealPlans,
                recentRegistrations,
                pendingNutritionists
            });
        } catch (error) {
            console.error('Error getting admin dashboard:', error);
            return res.status(500).json({ message: 'Failed to retrieve dashboard data' });
        }
    }
}

module.exports = new AdminController();