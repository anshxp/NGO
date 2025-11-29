"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireMember = exports.requireAdmin = exports.requireAuth = exports.isMember = exports.isAdmin = exports.createAuthContext = void 0;
const createAuthContext = async (userId, user) => {
    if (!userId || !user) {
        return {
            isAuthenticated: false
        };
    }
    return {
        userId,
        user,
        isAuthenticated: true,
        role: user.role
    };
};
exports.createAuthContext = createAuthContext;
const isAdmin = (context) => {
    return context.isAuthenticated && context.role === 'admin';
};
exports.isAdmin = isAdmin;
const isMember = (context) => {
    return context.isAuthenticated && (context.role === 'member' || context.role === 'volunteer');
};
exports.isMember = isMember;
const requireAuth = (context) => {
    if (!context.isAuthenticated) {
        throw new Error('Authentication required');
    }
};
exports.requireAuth = requireAuth;
const requireAdmin = (context) => {
    if (!(0, exports.isAdmin)(context)) {
        throw new Error('Admin access required');
    }
};
exports.requireAdmin = requireAdmin;
const requireMember = (context) => {
    if (!(0, exports.isMember)(context)) {
        throw new Error('Member access required');
    }
};
exports.requireMember = requireMember;
