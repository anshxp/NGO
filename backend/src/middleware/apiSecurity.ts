import { Response, NextFunction } from 'express';
import { authMiddleware, adminMiddleware, AuthRequest } from './auth';

const adminPath = /^\/admin(?:\/|$)/;
const protectedPath = /^\/(users(?:\/|$)|donations\/user(?:\/|$)|memberships(?:\/|$)|events\/[^/]+\/register$|internships\/[^/]+\/apply$|messages(?:\/|$)|receipts(?:\/|$))/;

export const apiSecurity = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (adminPath.test(req.path)) return authMiddleware(req, res, (err?: any) => err ? next(err) : adminMiddleware(req, res, next));
    if (protectedPath.test(req.path)) return authMiddleware(req, res, next);
    return next();
};
