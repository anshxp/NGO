export const createAuthContext = async (userId, user) => {
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
export const isAdmin = (context) => {
    return context.isAuthenticated && context.role === 'admin';
};
export const isMember = (context) => {
    return context.isAuthenticated && (context.role === 'member' || context.role === 'volunteer');
};
export const requireAuth = (context) => {
    if (!context.isAuthenticated) {
        throw new Error('Authentication required');
    }
};
export const requireAdmin = (context) => {
    if (!isAdmin(context)) {
        throw new Error('Admin access required');
    }
};
export const requireMember = (context) => {
    if (!isMember(context)) {
        throw new Error('Member access required');
    }
};
