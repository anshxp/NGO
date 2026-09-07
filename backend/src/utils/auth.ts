import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be configured and at least 32 characters long');
    }
    return secret;
};

export const generateToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        getJwtSecret(),
        {
            algorithm: 'HS256',
            expiresIn: '15m',
            issuer: process.env.JWT_ISSUER || 'ngo-api',
            audience: process.env.JWT_AUDIENCE || 'ngo-web'
        }
    );
};

export const verifyToken = (token: string): { userId: string } => {
    try {
        const decoded = jwt.verify(token, getJwtSecret(), {
            algorithms: ['HS256'],
            issuer: process.env.JWT_ISSUER || 'ngo-api',
            audience: process.env.JWT_AUDIENCE || 'ngo-web'
        });

        if (typeof decoded === 'string' || !decoded.userId || typeof decoded.userId !== 'string') {
            throw new Error('Invalid token payload');
        }

        return { userId: decoded.userId };
    } catch (_error) {
        throw new Error('Invalid or expired token');
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    if (password.length < 12) {
        throw new Error('Password must be at least 12 characters long');
    }
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const generateReferralCode = (): string => {
    return `NGO${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
};

export const generateMembershipId = (userId: string): string => {
    const year = new Date().getFullYear();
    const random = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
    return `NGO${year}${userId.substring(0, 4).toUpperCase()}${random}`;
};
