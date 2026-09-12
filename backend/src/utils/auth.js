import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32)
        throw new Error('JWT_SECRET must be configured and at least 32 characters long');
    return secret;
};
export const generateToken = (userId, tokenVersion = 0) => jwt.sign({ userId, tokenVersion }, getJwtSecret(), { algorithm: 'HS256', expiresIn: '15m', issuer: process.env.JWT_ISSUER || 'ngo-api', audience: process.env.JWT_AUDIENCE || 'ngo-web' });
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'], issuer: process.env.JWT_ISSUER || 'ngo-api', audience: process.env.JWT_AUDIENCE || 'ngo-web' });
        if (typeof decoded === 'string' || !decoded.userId || typeof decoded.userId !== 'string')
            throw new Error('Invalid token payload');
        return { userId: decoded.userId, tokenVersion: Number(decoded.tokenVersion || 0) };
    }
    catch (_error) {
        throw new Error('Invalid or expired token');
    }
};
export const hashPassword = async (password) => { if (password.length < 12)
    throw new Error('Password must be at least 12 characters long'); return bcrypt.hash(password, await bcrypt.genSalt(12)); };
export const comparePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);
export const generateReferralCode = () => `NGO${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
export const generateMembershipId = (userId) => `NGO${new Date().getFullYear()}${userId.substring(0, 4).toUpperCase()}${crypto.randomInt(0, 1000000).toString().padStart(6, '0')}`;
