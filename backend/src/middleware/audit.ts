import { NextFunction, Response } from 'express';
import { AuditLogModel } from '../schema/auditLog';
import { AuthRequest } from './auth';

export const auditSensitiveRequest = (req: AuthRequest, res: Response, next: NextFunction) => {
    res.on('finish', () => {
        const isSensitive = req.path.startsWith('/admin') || req.path.startsWith('/donations') || req.path.startsWith('/beneficiaries') || req.path.startsWith('/memberships');
        if (!isSensitive) return;
        void AuditLogModel.create({
            actorId: req.userId,
            action: `${req.method} ${req.path}`,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            ip: req.ip,
            userAgent: req.get('user-agent')?.slice(0, 500)
        }).catch((error) => console.error('Audit log write failed', error?.message || 'unknown error'));
    });
    next();
};
