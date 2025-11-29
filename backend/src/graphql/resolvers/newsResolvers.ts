import { NewsModel } from '../../schema/news';
import { ActivityModel } from '../../schema/activity';

export const newsResolvers = {
    Query: {
        getAllNews: async (args: any, context: any) => {
            return await NewsModel.find({ status: 'published' })
                .populate('authorId')
                .sort({ publishedDate: -1 });
        },
        getNewsBySlug: async (args: any, context: any) => {
            const news = await NewsModel.findOne({ slug: args.slug }).populate('authorId');
            if (news) {
                news.views = (news.views || 0) + 1;
                await news.save();
            }
            return news;
        },
        getAdminNews: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await NewsModel.find().populate('authorId').sort({ created_at: -1 });
        }
    },
    Mutation: {
        createNews: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const slug = args.title.toLowerCase().replace(/\s+/g, '-');
            const news = new NewsModel({
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

        updateNews: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const news = await NewsModel.findByIdAndUpdate(
                args.id,
                {
                    title: args.title,
                    content: args.content,
                    excerpt: args.excerpt,
                    imageUrl: args.imageUrl,
                    status: args.status
                },
                { new: true }
            );

            return { ...news?.toObject(), success: true };
        },

        publishNews: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const news = await NewsModel.findByIdAndUpdate(
                args.id,
                { status: 'published', publishedDate: new Date() },
                { new: true }
            );

            return { ...news?.toObject(), success: true };
        },

        deleteNews: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            await NewsModel.findByIdAndDelete(args.id);
            return { success: true, message: 'News deleted' };
        }
    }
};

export const activityResolvers = {
    Query: {
        getActivities: async (args: any, context: any) => {
            return await ActivityModel.find({ status: 'published' })
                .populate('authorId')
                .populate('likes')
                .populate('comments.userId')
                .sort({ created_at: -1 });
        },
        getActivityById: async (args: any, context: any) => {
            return await ActivityModel.findById(args.id)
                .populate('authorId')
                .populate('likes')
                .populate('comments.userId');
        }
    },
    Mutation: {
        createActivity: async (args: any, context: any) => {
            if (!context.user) throw new Error('Authentication required');

            const activity = new ActivityModel({
                title: args.title,
                description: args.description,
                imageUrls: args.imageUrls || [],
                authorId: context.userId,
                status: 'published'
            });

            const savedActivity = await activity.save();
            return { ...savedActivity.toObject(), success: true };
        },

        likeActivity: async (args: any, context: any) => {
            if (!context.user) throw new Error('Authentication required');

            const activity = await ActivityModel.findById(args.activityId);
            if (!activity) throw new Error('Activity not found');

            if (!activity.likes.includes(context.userId)) {
                activity.likes.push(context.userId);
            }

            await activity.save();
            return { ...activity.toObject(), success: true };
        },

        commentOnActivity: async (args: any, context: any) => {
            if (!context.user) throw new Error('Authentication required');

            const activity = await ActivityModel.findById(args.activityId);
            if (!activity) throw new Error('Activity not found');

            activity.comments.push({
                userId: context.userId,
                comment: args.comment,
                createdAt: new Date()
            });

            await activity.save();
            return { ...activity.toObject(), success: true };
        },

        deleteActivity: async (args: any, context: any) => {
            const activity = await ActivityModel.findById(args.id);
            if (activity?.authorId.toString() !== context.userId && context.user?.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            await ActivityModel.findByIdAndDelete(args.id);
            return { success: true, message: 'Activity deleted' };
        }
    }
};
