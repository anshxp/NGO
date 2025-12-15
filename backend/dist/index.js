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
// Reports endpoint
app.post('/api/admin/reports/:reportType', async (req, res) => {
    try {
        const { reportType } = req.params;
        const authHeader = req.headers.authorization;
        // Verify authentication
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = authHeader.substring(7);
        const decoded = (0, auth_1.verifyToken)(token);
        const user = await user_1.UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        // Generate mock report based on type
        const mockReports = {
            membership: { type: 'membership', title: 'Membership Report', data: [] },
            donations: { type: 'donations', title: 'Donation Report', data: [] },
            projects: { type: 'projects', title: 'Project Report', data: [] },
            beneficiaries: { type: 'beneficiaries', title: 'Beneficiary Report', data: [] },
            expenses: { type: 'expenses', title: 'Expense Report', data: [] },
            campaigns: { type: 'campaigns', title: 'Campaign Report', data: [] },
            'income-expense': { type: 'income-expense', title: 'Income vs Expense Report', data: [] }
        };
        const report = mockReports[reportType];
        if (!report) {
            return res.status(400).json({ error: 'Invalid report type' });
        }
        // For now, return a simple PDF response
        // In production, you would generate actual PDF with real data
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf"`);
        // Send a minimal PDF content
        const pdfContent = Buffer.from('%PDF-1.4\n' +
            '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
            '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
            '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<<>>>>endobj\n' +
            '4 0 obj<</Length 44>>stream\n' +
            'BT /F1 12 Tf 100 700 Td (' + report.title + ') Tj ET\n' +
            'endstream\n' +
            'endobj\n' +
            'xref\n0 5\n' +
            '0000000000 65535 f\n' +
            '0000000009 00000 n\n' +
            '0000000058 00000 n\n' +
            '0000000115 00000 n\n' +
            '0000000214 00000 n\n' +
            'trailer<</Size 5/Root 1 0 R>>\nstartxref\n308\n%%EOF', 'utf-8');
        res.send(pdfContent);
    }
    catch (error) {
        console.error('❌ Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
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
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/graphql', (0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
        process.env.FRONTEND_URL || 'http://localhost:5173'
    ],
    credentials: true
}), (0, express_graphql_1.graphqlHTTP)(async (req) => ({
    schema: (0, graphql_1.buildSchema)(typeDefs_1.typeDefs),
    rootValue: resolvers_1.flattenedResolvers,
    context: await getContext({ req }),
    graphiql: process.env.NODE_ENV !== 'production',
    formatError: (error) => {
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
})));
async function start() {
    try {
        await (0, db_1.connectDB)();
        const PORT = process.env.PORT || 7856;
        app.listen(PORT, () => {
            console.log(`✅ Database Connected Successfully`);
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
