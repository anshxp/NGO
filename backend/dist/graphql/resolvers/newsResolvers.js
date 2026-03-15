"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityResolvers = exports.newsResolvers = void 0;
var news_1 = require("../../schema/news");
var activity_1 = require("../../schema/activity");
exports.newsResolvers = {
    Query: {
        getAllNews: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, news_1.NewsModel.find({ status: 'published' })
                            .populate('authorId')
                            .sort({ publishedDate: -1 })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        getNewsBySlug: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var news;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, news_1.NewsModel.findOne({ slug: args.slug }).populate('authorId')];
                    case 1:
                        news = _a.sent();
                        if (!news) return [3 /*break*/, 3];
                        news.views = (news.views || 0) + 1;
                        return [4 /*yield*/, news.save()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, news];
                }
            });
        }); },
        getAdminNews: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, news_1.NewsModel.find().populate('authorId').sort({ created_at: -1 })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }
    },
    Mutation: {
        createNews: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var slug, news, savedNews;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        slug = args.title.toLowerCase().replace(/\s+/g, '-');
                        news = new news_1.NewsModel({
                            title: args.title,
                            slug: slug,
                            content: args.content,
                            excerpt: args.excerpt,
                            imageUrl: args.imageUrl,
                            authorId: context.userId,
                            status: 'draft'
                        });
                        return [4 /*yield*/, news.save()];
                    case 1:
                        savedNews = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, savedNews.toObject()), { success: true })];
                }
            });
        }); },
        updateNews: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var news;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, news_1.NewsModel.findByIdAndUpdate(args.id, {
                                title: args.title,
                                content: args.content,
                                excerpt: args.excerpt,
                                imageUrl: args.imageUrl,
                                status: args.status
                            }, { new: true })];
                    case 1:
                        news = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, news === null || news === void 0 ? void 0 : news.toObject()), { success: true })];
                }
            });
        }); },
        publishNews: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var news;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, news_1.NewsModel.findByIdAndUpdate(args.id, { status: 'published', publishedDate: new Date() }, { new: true })];
                    case 1:
                        news = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, news === null || news === void 0 ? void 0 : news.toObject()), { success: true })];
                }
            });
        }); },
        deleteNews: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, news_1.NewsModel.findByIdAndDelete(args.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: 'News deleted' }];
                }
            });
        }); }
    }
};
exports.activityResolvers = {
    Query: {
        getActivities: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, activity_1.ActivityModel.find({ status: 'published' })
                            .populate('authorId')
                            .populate('likes')
                            .populate('comments.userId')
                            .sort({ created_at: -1 })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        getActivityById: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, activity_1.ActivityModel.findById(args.id)
                            .populate('authorId')
                            .populate('likes')
                            .populate('comments.userId')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }
    },
    Mutation: {
        createActivity: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var activity, savedActivity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user)
                            throw new Error('Authentication required');
                        activity = new activity_1.ActivityModel({
                            title: args.title,
                            description: args.description,
                            imageUrls: args.imageUrls || [],
                            authorId: context.userId,
                            status: 'published'
                        });
                        return [4 /*yield*/, activity.save()];
                    case 1:
                        savedActivity = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, savedActivity.toObject()), { success: true })];
                }
            });
        }); },
        likeActivity: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var activity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user)
                            throw new Error('Authentication required');
                        return [4 /*yield*/, activity_1.ActivityModel.findById(args.activityId)];
                    case 1:
                        activity = _a.sent();
                        if (!activity)
                            throw new Error('Activity not found');
                        if (!activity.likes.includes(context.userId)) {
                            activity.likes.push(context.userId);
                        }
                        return [4 /*yield*/, activity.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, activity.toObject()), { success: true })];
                }
            });
        }); },
        commentOnActivity: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var activity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user)
                            throw new Error('Authentication required');
                        return [4 /*yield*/, activity_1.ActivityModel.findById(args.activityId)];
                    case 1:
                        activity = _a.sent();
                        if (!activity)
                            throw new Error('Activity not found');
                        activity.comments.push({
                            userId: context.userId,
                            comment: args.comment,
                            createdAt: new Date()
                        });
                        return [4 /*yield*/, activity.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, activity.toObject()), { success: true })];
                }
            });
        }); },
        deleteActivity: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var activity;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, activity_1.ActivityModel.findById(args.id)];
                    case 1:
                        activity = _b.sent();
                        if ((activity === null || activity === void 0 ? void 0 : activity.authorId.toString()) !== context.userId && ((_a = context.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, activity_1.ActivityModel.findByIdAndDelete(args.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, { success: true, message: 'Activity deleted' }];
                }
            });
        }); }
    }
};
