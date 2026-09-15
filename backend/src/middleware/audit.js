import { AuditLogModel } from '../schema/auditLog.js';

export const auditSensitiveRequest = (req, res, next) => {
  res.on('finish', () => {
    const isSensitive = req.path.startsWith('/admin') || req.path.startsWith('/donations') || req.path.startsWith('/beneficiaries') || req.path.startsWith('/memberships');
    if (!isSensitive) return;
    void AuditLogModel.create({ actorId: req.userId, action: `${req.method} ${req.path}`, method: req.method, path: req.path, statusCode: res.statusCode, ip: req.ip, userAgent: req.get('user-agent')?.slice(0, 500) }).catch((error) => console.error('Audit log write failed', error?.message || 'unknown error'));
  });
  next();
};
