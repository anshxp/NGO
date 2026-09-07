import { verifyToken } from '../utils/auth.js';
import { UserModel } from '../schema/user.js';

export const getAuthToken = (req) => {
  const cookieToken = req.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith('ngo_access_token='))?.split('=').slice(1).join('=');
  if (cookieToken) return decodeURIComponent(cookieToken);
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();
  return undefined;
};

export const authMiddleware = async (req, res, next) => {
  try {
    const token = getAuthToken(req);
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    const decoded = verifyToken(token);
    const user = await UserModel.findById(decoded.userId).select('-password');
    if (!user || Number(user.tokenVersion || 0) !== decoded.tokenVersion) return res.status(401).json({ error: 'Authentication required' });
    req.userId = decoded.userId;
    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Authentication required' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  return next();
};
