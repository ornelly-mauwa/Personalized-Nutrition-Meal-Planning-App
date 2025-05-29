// roleMiddleware.js
export const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};

export const verifyNutritionist = (req, res, next) => {
    if (req.user?.role !== 'nutritionist') {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};

export const verifyUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};
