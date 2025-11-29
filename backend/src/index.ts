import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { connectDB } from './connection/db';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { verifyToken } from './utils/auth';
import { UserModel } from './schema/user';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'NGO Management Server Running' });
});

// GraphQL context - extract user from token
const getContext = async ({ req }: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
        try {
            const decoded = verifyToken(token);
            const user = await UserModel.findById(decoded.userId);
            return { userId: decoded.userId, user };
        } catch (error) {
            return {};
        }
    }
    
    return {};
};

// GraphQL endpoint
app.use(
    '/graphql',
    graphqlHTTP(async (req) => ({
        schema: buildSchema(typeDefs),
        rootValue: resolvers,
        context: await getContext({ req }),
        graphiql: process.env.NODE_ENV !== 'production'
    }))
);

async function start() {
    try {
        await connectDB();
        const PORT = process.env.PORT || 4000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
        });
    } catch (err) {
        console.error('❌ Error Starting the Server: ', err);
        process.exit(1);
    }
}

start();
