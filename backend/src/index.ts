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
    origin: [
        'http://localhost:5173',   // Primary dev port
        'http://localhost:8080',   // Alternative dev port
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
        process.env.FRONTEND_URL || 'http://localhost:5173'  // Production URL
    ],
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
            console.error('❌ Token verification error:', error);
            return {};
        }
    }
    
    return {};
};

// GraphQL endpoint
app.use(
    '/graphql',
    graphqlHTTP(async (req) => {
        const context = await getContext({ req });
        
        return {
            schema: buildSchema(typeDefs),
            rootValue: {
                // Query resolvers - flat structure
                ...resolvers.Query,
                // Mutation resolvers - flat structure
                ...resolvers.Mutation
            },
            context,
            graphiql: process.env.NODE_ENV !== 'production',
            customFormatErrorFn: (error: any) => {
                // Log all GraphQL errors to console with detailed information
                const errorSource = error.originalError?.stack?.split('\n')[1] || 'Unknown source';
                const resolverName = error.path ? error.path.join('.') : 'Unknown resolver';
                const errorLocation = error.locations ? `Line ${error.locations[0].line}, Column ${error.locations[0].column}` : 'No location';
                
                console.error('\n🔴 ===== GraphQL ERROR =====');
                console.error(`📍 Resolver/Query: ${resolverName}`);
                console.error(`📂 Location: ${errorLocation}`);
                console.error(`💬 Message: ${error.message}`);
                console.error(`📌 Source: ${errorSource}`);
                if (error.originalError) {
                    console.error(`🔗 Original Error:`, error.originalError);
                }
                console.error('🔴 ===== END ERROR =====\n');
                return error;
            }
        };
    })
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
