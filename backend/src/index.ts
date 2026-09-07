import express, { Express, Request, Response, RequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { connectDB } from './connection/db';
import { apiRouter } from './routes/api';
import adminRouter from './routes/admin';
import reportRouter from './routes/reports';
import { apiSecurity } from './middleware/apiSecurity';
import { auditSensitiveRequest } from './middleware/audit';
import mongoose from 'mongoose';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT || 7856);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be configured and at least 32 characters long');
if (isProduction && !process.env.FRONTEND_URL) throw new Error('FRONTEND_URL must be configured in production');

const allowedOrigins = (process.env.FRONTEND_URL || '').split(',').map((origin) => origin.trim()).filter(Boolean);
if (!isProduction) allowedOrigins.push('http://localhost:5173', 'http://localhost:8080', 'http://127.0.0.1:5173', 'http://127.0.0.1:8080');
const corsOptions = {
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('CORS origin denied'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

const app: Express = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: isProduction ? undefined : false, crossOriginEmbedderPolicy: false }) as any);
app.use(cors(corsOptions) as any);
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many requests. Please try again later.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, skipSuccessfulRequests: true, message: { error: 'Too many authentication attempts. Please try again later.' } });
const generalLimiterHandler: RequestHandler = (req, res, next) => void (generalLimiter as any)(req, res, next);
const authLimiterHandler: RequestHandler = (req, res, next) => void (authLimiter as any)(req, res, next);
app.use(generalLimiterHandler);
app.get('/health', (_req: Request, res: Response) => res.status(200).json({ status: 'ok', service: 'ngo-api' }));
app.get('/ready', (_req: Request, res: Response) => { const ready = mongoose.connection.readyState === 1; res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready' }); });
app.use('/api/auth/login', authLimiterHandler);
app.use('/api/auth/register', authLimiterHandler);

app.use('/api', apiSecurity);
app.use('/api', auditSensitiveRequest);
app.use('/api/admin/reports', reportRouter);
app.use('/api/admin', adminRouter);
app.use('/api', apiRouter);

app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error('Unhandled HTTP error', err?.message || 'unknown error');
    if (res.headersSent) return;
    res.status(500).json({ error: 'Internal server error' });
});

async function start() {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`NGO API listening on port ${PORT}`));
    } catch (_err) {
        console.error('Error starting server');
        process.exit(1);
    }
}
start();
