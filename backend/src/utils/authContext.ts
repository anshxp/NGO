import { UserModel } from '../schema/user';

export interface AuthContext {
    userId?: string;
    user?: any;
    isAuthenticated: boolean;
    role?: string;
}

export const createAuthContext = async (userId?: string, user?: any): Promise<AuthContext> => {
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

export const isAdmin = (context: AuthContext): boolean => {
    return context.isAuthenticated && context.role === 'admin';
};

export const isMember = (context: AuthContext): boolean => {
    return context.isAuthenticated && (context.role === 'member' || context.role === 'volunteer');
};

export const requireAuth = (context: AuthContext): void => {
    if (!context.isAuthenticated) {
        throw new Error('Authentication required');
    }
};

export const requireAdmin = (context: AuthContext): void => {
    if (!isAdmin(context)) {
        throw new Error('Admin access required');
    }
};

export const requireMember = (context: AuthContext): void => {
    if (!isMember(context)) {
        throw new Error('Member access required');
    }
};
