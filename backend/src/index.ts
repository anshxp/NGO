import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { connectDB } from './connection/db';
import { typeDefs } from './graphql/typeDefs';
import { flattenedResolvers } from './graphql/resolvers';
import { verifyToken } from './utils/auth';
import { UserModel } from './schema/user';
import { authMiddleware, adminMiddleware, getAuthToken, AuthRequest } from './middleware/auth';
import mongoose from 'mongoose';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT || 7856);

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured and at least 32 characters long');
}
if (isProduction && !process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL must be configured in production');
}

const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

if (!isProduction) {
    allowedOrigins.push('http://localhost:5173', 'http://localhost:8080', 'http://127.0.0.1:5173', 'http://127.0.0.1:8080');
}

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

app.use(helmet({
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { error: 'Too many authentication attempts. Please try again later.' }
});

app.use(generalLimiter);

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'ngo-api' });
});

app.get('/ready', (_req: Request, res: Response) => {
    const ready = mongoose.connection.readyState === 1;
    res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready' });
});

// Admin reports: authentication AND authorization are enforced server-side.
app.post('/api/admin/reports/:reportType', authLimiter, authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const validTypes = new Set(['membership', 'donations', 'projects', 'beneficiaries', 'expenses', 'campaigns', 'income-expense']);
        const { reportType } = req.params;
        if (!validTypes.has(reportType)) return res.status(400).json({ error: 'Invalid report type' });

        // This endpoint is intentionally not pretending mock data is production data.
        // Real report generation must be implemented against the authoritative models before launch.
        return res.status(501).json({ error: 'Report generation is not available yet' });
    } catch (_error) {
        console.error('Report generation failed');
        return res.status(500).json({ error: 'Failed to generate report' });
    }
});

const getContext = async ({ req, res }: any) => {
    const token = getAuthToken(req);
    if (!token) return { req, res };

    try {
        const decoded = verifyToken(token);
        const user = await UserModel.findById(decoded.userId).select('-password');
        if (!user) return { req, res };
        return { userId: decoded.userId, user, req, res };
    } catch (_error) {
        return { req, res };
    }
};

app.use('/graphql', graphqlHTTP(async (req: any, res: any) => ({
    schema: buildSchema(typeDefs),
    rootValue: flattenedResolvers,
    context: await getContext({ req, res }),
    graphiql: !isProduction && process.env.ENABLE_GRAPHIQL === 'true',
    customFormatErrorFn: (error: any) => {
        console.error('GraphQL request failed', {
            path: error.path,
            message: error.message
        });

        return {
            message: isProduction ? 'Request could not be completed' : error.message,
            locations: error.locations,
            path: error.path
        };
    }
})));

app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error('Unhandled HTTP error', err?.message || 'unknown error');
    if (res.headersSent) return;
    res.status(500).json({ error: 'Internal server error' });
});

async function start() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`NGO API listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error starting server');
        process.exit(1);
    }
}

start();
