"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityResolvers = exports.newsResolvers = void 0;
const news_1 = require("../../schema/news");
const activity_1 = require("../../schema/activity");
exports.newsResolvers = {
    Query: {
        getAllNews: async (args, context) => {
            return await news_1.NewsModel.find({ status: 'published' })
                .populate('authorId')
                .sort({ publishedDate: -1 });
        },
        getNewsBySlug: async (args, context) => {
            const news = await news_1.NewsModel.findOne({ slug: args.slug }).populate('authorId');
            if (news) {
                news.views = (news.views || 0) + 1;
                await news.save();
            }
            return news;
        },
        getAdminNews: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await news_1.NewsModel.find().populate('authorId').sort({ created_at: -1 });
        }
    },
    Mutation: {
        createNews: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const slug = args.title.toLowerCase().replace(/\s+/g, '-');
            const news = new news_1.NewsModel({
                title: args.title,
                slug,
                content: args.content,
                excerpt: args.excerpt,
                imageUrl: args.imageUrl,
                authorId: context.userId,
                status: 'draft'
            });
            const savedNews = await news.save();
            return { ...savedNews.toObject(), success: true };
        },
        updateNews: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const news = await news_1.NewsModel.findByIdAndUpdate(args.id, {
                title: args.title,
                content: args.content,
                excerpt: args.excerpt,
                imageUrl: args.imageUrl,
                status: args.status
            }, { new: true });
            return { ...news?.toObject(), success: true };
        },
        publishNews: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const news = await news_1.NewsModel.findByIdAndUpdate(args.id, { status: 'published', publishedDate: new Date() }, { new: true });
            return { ...news?.toObject(), success: true };
        },
        deleteNews: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            await news_1.NewsModel.findByIdAndDelete(args.id);
            return { success: true, message: 'News deleted' };
        }
    }
};
exports.activityResolvers = {
    Query: {
        getActivities: async (args, context) => {
            return await activity_1.ActivityModel.find({ status: 'published' })
                .populate('authorId')
                .populate('likes')
                .populate('comments.userId')
                .sort({ created_at: -1 });
        },
        getActivityById: async (args, context) => {
            return await activity_1.ActivityModel.findById(args.id)
                .populate('authorId')
                .populate('likes')
                .populate('comments.userId');
        }
    },
    Mutation: {
        createActivity: async (args, context) => {
            if (!context.user)
                throw new Error('Authentication required');
            const activity = new activity_1.ActivityModel({
                title: args.title,
                description: args.description,
                imageUrls: args.imageUrls || [],
                authorId: context.userId,
                status: 'published'
            });
            const savedActivity = await activity.save();
            return { ...savedActivity.toObject(), success: true };
        },
        likeActivity: async (args, context) => {
            if (!context.user)
                throw new Error('Authentication required');
            const activity = await activity_1.ActivityModel.findById(args.activityId);
            if (!activity)
                throw new Error('Activity not found');
            if (!activity.likes.includes(context.userId)) {
                activity.likes.push(context.userId);
            }
            await activity.save();
            return { ...activity.toObject(), success: true };
        },
        commentOnActivity: async (args, context) => {
            if (!context.user)
                throw new Error('Authentication required');
            const activity = await activity_1.ActivityModel.findById(args.activityId);
            if (!activity)
                throw new Error('Activity not found');
            activity.comments.push({
                userId: context.userId,
                comment: args.comment,
                createdAt: new Date()
            });
            await activity.save();
            return { ...activity.toObject(), success: true };
        },
        deleteActivity: async (args, context) => {
            const activity = await activity_1.ActivityModel.findById(args.id);
            if (activity?.authorId.toString() !== context.userId && context.user?.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            await activity_1.ActivityModel.findByIdAndDelete(args.id);
            return { success: true, message: 'Activity deleted' };
        }
    }
};
