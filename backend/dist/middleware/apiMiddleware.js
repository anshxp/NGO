"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.requireMember = exports.requireAdmin = exports.requireAuth = exports.authMiddleware = void 0;
const tokenManager_1 = require("../utils/tokenManager");
const user_1 = require("../schema/user");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            req.userId = undefined;
            req.user = undefined;
            return next();
        }
        if ((0, tokenManager_1.isTokenExpired)(token)) {
            return res.status(401).json({ error: 'Token expired' });
        }
        const decoded = (0, tokenManager_1.verifyToken)(token);
        const user = await user_1.UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.userId = decoded.userId;
        req.user = user;
        req.token = token;
        next();
    }
    catch (error) {
        res.status(401).json({ error: error.message || 'Unauthorized' });
    }
};
exports.authMiddleware = authMiddleware;
const requireAuth = (req, res, next) => {
    if (!req.userId || !req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireMember = (req, res, next) => {
    if (!req.user || (req.user.role !== 'member' && req.user.role !== 'volunteer')) {
        return res.status(403).json({ error: 'Member access required' });
    }
    next();
};
exports.requireMember = requireMember;
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
};
exports.errorHandler = errorHandler;
