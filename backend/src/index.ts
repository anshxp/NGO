import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bodyParser from 'body-parser';
import { connectDB } from './connection/db';
import { typeDefs } from './graphql/typeDefs';
import { flattenedResolvers } from './graphql/resolvers';
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

// Reports endpoint
app.post('/api/admin/reports/:reportType', async (req: Request, res: Response) => {
    try {
        const { reportType } = req.params;
        const authHeader = req.headers.authorization;
        
        // Verify authentication
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Generate mock report based on type
        const mockReports: { [key: string]: any } = {
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
        const pdfContent = Buffer.from(
            '%PDF-1.4\n' +
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
            'trailer<</Size 5/Root 1 0 R>>\nstartxref\n308\n%%EOF',
            'utf-8'
        );
        
        res.send(pdfContent);
    } catch (error) {
        console.error('❌ Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    '/graphql',
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:8080',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:8080',
            process.env.FRONTEND_URL || 'http://localhost:5173'
        ],
        credentials: true
    }),
    graphqlHTTP(async (req: any) => ({
        schema: buildSchema(typeDefs),
        rootValue: flattenedResolvers,
        context: await getContext({ req }),
        graphiql: process.env.NODE_ENV !== 'production',
        formatError: (error: any) => {
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
    }))
);

async function start() {
    try {
        await connectDB();
        
        const PORT = process.env.PORT || 7856;

        app.listen(PORT, () => {
            console.log(`✅ Database Connected Successfully`);
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
        });
    } catch (err) {
        console.error('❌ Error Starting the Server: ', err);
        process.exit(1);
    }
}

start();
