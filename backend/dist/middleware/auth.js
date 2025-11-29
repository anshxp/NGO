"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const auth_1 = require("../utils/auth");
const user_1 = require("../schema/user");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new Error('Authentication required');
        }
        const decoded = (0, auth_1.verifyToken)(token);
        const user = await user_1.UserModel.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }
        req.userId = decoded.userId;
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            throw new Error('Admin access required');
        }
        next();
    }
    catch (error) {
        res.status(403).json({ error: 'Admin access required' });
    }
};
exports.adminMiddleware = adminMiddleware;
