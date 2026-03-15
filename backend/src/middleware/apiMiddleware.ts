import { Request, Response, NextFunction } from 'express';
import { verifyToken, isTokenExpired } from '../utils/tokenManager';
import { UserModel } from '../schema/user';

export interface AuthenticatedRequest extends Request {
    userId?: string;
    user?: any;
    token?: string;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            req.userId = undefined;
            req.user = undefined;
            return next();
        }

        if (isTokenExpired(token)) {
            return res.status(401).json({ error: 'Token expired' });
        }

        const decoded = verifyToken(token);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.userId = decoded.userId;
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).json({ error: error.message || 'Unauthorized' });
    }
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userId || !req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

export const requireMember = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || (req.user.role !== 'member' && req.user.role !== 'volunteer')) {
        return res.status(403).json({ error: 'Member access required' });
    }
    next();
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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
