import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { UserModel } from '../schema/user';

export interface AuthRequest extends Request {
    userId?: string;
    user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Authentication required');
        }

        const decoded = verifyToken(token);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }

        req.userId = decoded.userId;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            throw new Error('Admin access required');
        }
        next();
    } catch (error) {
        res.status(403).json({ error: 'Admin access required' });
    }
};
