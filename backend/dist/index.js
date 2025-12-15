"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const db_1 = require("./connection/db");
const typeDefs_1 = require("./graphql/typeDefs");
const resolvers_1 = require("./graphql/resolvers");
const auth_1 = require("./utils/auth");
const user_1 = require("./schema/user");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173', // Primary dev port
        'http://localhost:8080', // Alternative dev port
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
        process.env.FRONTEND_URL || 'http://localhost:5173' // Production URL
    ],
    credentials: true
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'NGO Management Server Running' });
});
// GraphQL context - extract user from token
const getContext = async ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
        try {
            const decoded = (0, auth_1.verifyToken)(token);
            const user = await user_1.UserModel.findById(decoded.userId);
            return { userId: decoded.userId, user };
        }
        catch (error) {
            console.error('❌ Token verification error:', error);
            return {};
        }
    }
    return {};
};
// GraphQL endpoint
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)(async (req) => {
    const context = await getContext({ req });
    return {
        schema: (0, graphql_1.buildSchema)(typeDefs_1.typeDefs),
        rootValue: {
            // Query resolvers - flat structure
            ...resolvers_1.resolvers.Query,
            // Mutation resolvers - flat structure
            ...resolvers_1.resolvers.Mutation
        },
        context,
        graphiql: process.env.NODE_ENV !== 'production',
        customFormatErrorFn: (error) => {
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
}));
async function start() {
    try {
        await (0, db_1.connectDB)();
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
        });
    }
    catch (err) {
        console.error('❌ Error Starting the Server: ', err);
        process.exit(1);
    }
}
start();
