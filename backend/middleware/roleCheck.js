// middleware/roleCheck.js
const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const userRole = req.user.role?.name;
            if (!userRole) {
                return res.status(403).json({ message: 'No role assigned to user' });
            }

            // Check if user's role is in the allowed roles array
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: 'Access denied. Insufficient permissions.',
                    required: allowedRoles,
                    current: userRole
                });
            }

            next();
        } catch (error) {
            console.error('Role check middleware error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
};

// Helper functions for specific roles
const requireAdmin = roleCheck(['admin']);
const requireNutritionist = roleCheck(['admin', 'nutritionist']);
const requireUser = roleCheck(['admin', 'nutritionist', 'user']);

// Permission-based middleware
const hasPermission = (permission) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const userPermissions = req.user.role?.permissions || [];

            if (!userPermissions.includes(permission)) {
                return res.status(403).json({
                    message: 'Access denied. Missing required permission.',
                    required: permission
                });
            }

            next();
        } catch (error) {
            console.error('Permission check middleware error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
};

module.exports = {
    roleCheck,
    requireAdmin,
    requireNutritionist,
    requireUser,
    hasPermission
};