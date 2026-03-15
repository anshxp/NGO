"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var express_graphql_1 = require("express-graphql");
var graphql_1 = require("graphql");
var db_1 = require("./connection/db");
var typeDefs_1 = require("./graphql/typeDefs");
var resolvers_1 = require("./graphql/resolvers");
var auth_1 = require("./utils/auth");
var user_1 = require("./schema/user");
dotenv_1.default.config();
var app = express_1.default();
// Middleware
app.use(cors_1.default({
    origin: [
        'http://localhost:5173',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
        process.env.FRONTEND_URL || 'http://localhost:5173' // Production URL
    ],
    credentials: true
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', function (req, res) {
    res.json({ status: 'OK', message: 'NGO Management Server Running' });
});
// Reports endpoint
app.post('/api/admin/reports/:reportType', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reportType, authHeader, token, decoded, user, mockReports, report, pdfContent, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                reportType = req.params.reportType;
                authHeader = req.headers.authorization;
                // Verify authentication
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                }
                token = authHeader.substring(7);
                decoded = auth_1.verifyToken(token);
                return [4 /*yield*/, user_1.UserModel.findById(decoded.userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ error: 'User not found' })];
                }
                mockReports = {
                    membership: { type: 'membership', title: 'Membership Report', data: [] },
                    donations: { type: 'donations', title: 'Donation Report', data: [] },
                    projects: { type: 'projects', title: 'Project Report', data: [] },
                    beneficiaries: { type: 'beneficiaries', title: 'Beneficiary Report', data: [] },
                    expenses: { type: 'expenses', title: 'Expense Report', data: [] },
                    campaigns: { type: 'campaigns', title: 'Campaign Report', data: [] },
                    'income-expense': { type: 'income-expense', title: 'Income vs Expense Report', data: [] }
                };
                report = mockReports[reportType];
                if (!report) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid report type' })];
                }
                // For now, return a simple PDF response
                // In production, you would generate actual PDF with real data
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', "attachment; filename=\"" + reportType + "-report-" + new Date().toISOString().split('T')[0] + ".pdf\"");
                pdfContent = Buffer.from('%PDF-1.4\n' +
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
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('❌ Error generating report:', error_1);
                res.status(500).json({ error: 'Failed to generate report' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GraphQL context - extract user from token
var getContext = function (_a) {
    var req = _a.req;
    return __awaiter(void 0, void 0, void 0, function () {
        var token, decoded, user, error_2;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', '');
                    if (!token) return [3 /*break*/, 4];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    decoded = auth_1.verifyToken(token);
                    return [4 /*yield*/, user_1.UserModel.findById(decoded.userId)];
                case 2:
                    user = _c.sent();
                    return [2 /*return*/, { userId: decoded.userId, user: user }];
                case 3:
                    error_2 = _c.sent();
                    console.error('❌ Token verification error:', error_2);
                    return [2 /*return*/, {}];
                case 4: return [2 /*return*/, {}];
            }
        });
    });
};
// GraphQL endpoint
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/graphql', cors_1.default({
    origin: [
        'http://localhost:5173',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
        process.env.FRONTEND_URL || 'http://localhost:5173'
    ],
    credentials: true
}), express_graphql_1.graphqlHTTP(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = {
                    schema: graphql_1.buildSchema(typeDefs_1.typeDefs),
                    rootValue: resolvers_1.flattenedResolvers
                };
                return [4 /*yield*/, getContext({ req: req })];
            case 1: return [2 /*return*/, (_a.context = _b.sent(),
                    _a.graphiql = process.env.NODE_ENV !== 'production',
                    _a.formatError = function (error) {
                        var _a, _b;
                        var errorSource = ((_b = (_a = error.originalError) === null || _a === void 0 ? void 0 : _a.stack) === null || _b === void 0 ? void 0 : _b.split('\n')[1]) || 'Unknown source';
                        var resolverName = error.path ? error.path.join('.') : 'Unknown resolver';
                        var errorLocation = error.locations ? "Line " + error.locations[0].line + ", Column " + error.locations[0].column : 'No location';
                        console.error('\n🔴 ===== GraphQL ERROR =====');
                        console.error("\uD83D\uDCCD Resolver/Query: " + resolverName);
                        console.error("\uD83D\uDCC2 Location: " + errorLocation);
                        console.error("\uD83D\uDCAC Message: " + error.message);
                        console.error("\uD83D\uDCCC Source: " + errorSource);
                        if (error.originalError) {
                            console.error("\uD83D\uDD17 Original Error:", error.originalError);
                        }
                        console.error('🔴 ===== END ERROR =====\n');
                        return error;
                    },
                    _a)];
        }
    });
}); }));
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var PORT_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.connectDB()];
                case 1:
                    _a.sent();
                    PORT_1 = process.env.PORT || 7856;
                    app.listen(PORT_1, function () {
                        console.log("\u2705 Database Connected Successfully");
                        console.log("\uD83D\uDE80 Server running on http://localhost:" + PORT_1);
                        console.log("\uD83D\uDCCA GraphQL endpoint: http://localhost:" + PORT_1 + "/graphql");
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error('❌ Error Starting the Server: ', err_1);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
start();
