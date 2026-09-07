import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { UserModel } from '../schema/user';

export interface AuthRequest extends Request {
    userId?: string;
    user?: any;
}

export const getAuthToken = (req: Request): string | undefined => {
    const cookieToken = req.headers.cookie
        ?.split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith('ngo_access_token='))
        ?.split('=').slice(1).join('=');

    if (cookieToken) return decodeURIComponent(cookieToken);

    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) return header.slice(7).trim();
    return undefined;
};

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = getAuthToken(req);
        if (!token) return res.status(401).json({ error: 'Authentication required' });

        const decoded = verifyToken(token);
        const user = await UserModel.findById(decoded.userId).select('-password');
        if (!user) return res.status(401).json({ error: 'Authentication required' });

        req.userId = decoded.userId;
        req.user = user;
        next();
    } catch (_error) {
        return res.status(401).json({ error: 'Authentication required' });
    }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
