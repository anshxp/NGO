import { Request, Response, NextFunction } from 'express';

export const csrfOriginGuard = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== 'production' || ['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const cookie = req.headers.cookie || '';
    if (!cookie.includes('ngo_access_token=')) return next();
    const origin = req.headers.origin;
    const allowed = (process.env.FRONTEND_URL || '').split(',').map((value) => value.trim()).filter(Boolean);
    if (!origin || !allowed.includes(origin)) return res.status(403).json({ error: 'Request origin denied' });
    return next();
};
