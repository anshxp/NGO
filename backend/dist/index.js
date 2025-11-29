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
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
            return {};
        }
    }
    return {};
};
// GraphQL endpoint
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)(async (req) => ({
    schema: (0, graphql_1.buildSchema)(typeDefs_1.typeDefs),
    rootValue: resolvers_1.resolvers,
    context: await getContext({ req }),
    graphiql: process.env.NODE_ENV !== 'production'
})));
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
