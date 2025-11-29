"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignResolvers = void 0;
const campaign_1 = require("../../schema/campaign");
const email_1 = require("../../utils/email");
exports.campaignResolvers = {
    Query: {
        getCampaigns: async (args, context) => {
            return await campaign_1.CampaignModel.find({ status: { $ne: 'cancelled' } })
                .populate('organizer')
                .populate('donors')
                .sort({ startDate: -1 });
        },
        getCampaignById: async (args, context) => {
            return await campaign_1.CampaignModel.findById(args.id)
                .populate('organizer')
                .populate('donors');
        },
        getActiveCampaigns: async (args, context) => {
            return await campaign_1.CampaignModel.find({ status: 'active' })
                .populate('organizer')
                .populate('donors');
        }
    },
    Mutation: {
        createCampaign: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            try {
                const campaign = new campaign_1.CampaignModel({
                    title: args.title,
                    description: args.description,
                    goal: args.goal,
                    startDate: new Date(),
                    endDate: args.endDate,
                    imageUrl: args.imageUrl,
                    organizer: context.userId,
                    status: 'active'
                });
                const savedCampaign = await campaign.save();
                return { ...savedCampaign.toObject(), success: true };
            }
            catch (error) {
                throw new Error(`Campaign creation failed: ${error.message}`);
            }
        },
        donateToCampaign: async (args, context) => {
            try {
                const campaign = await campaign_1.CampaignModel.findById(args.campaignId);
                if (!campaign)
                    throw new Error('Campaign not found');
                campaign.raised = (campaign.raised || 0) + args.amount;
                campaign.donationCount = (campaign.donationCount || 0) + 1;
                if (!campaign.donors.includes(context.userId)) {
                    campaign.donors.push(context.userId);
                }
                if (campaign.raised >= campaign.goal) {
                    campaign.status = 'completed';
                }
                const savedCampaign = await campaign.save();
                // Send campaign update
                const user = await require('../../schema/user').UserModel.findById(context.userId);
                if (user) {
                    await (0, email_1.sendCampaignUpdateEmail)({
                        email: user.email,
                        name: user.name,
                        campaignTitle: campaign.title,
                        progress: Math.min(100, Math.round((campaign.raised / campaign.goal) * 100)),
                        totalRaised: campaign.raised,
                        goal: campaign.goal
                    });
                }
                return { ...savedCampaign.toObject(), success: true };
            }
            catch (error) {
                throw new Error(`Donation failed: ${error.message}`);
            }
        },
        updateCampaign: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const campaign = await campaign_1.CampaignModel.findByIdAndUpdate(args.id, {
                title: args.title,
                description: args.description,
                status: args.status
            }, { new: true });
            return { ...campaign?.toObject(), success: true };
        },
        closeCampaign: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const campaign = await campaign_1.CampaignModel.findByIdAndUpdate(args.id, { status: 'completed' }, { new: true });
            return { ...campaign?.toObject(), success: true, message: 'Campaign closed' };
        }
    }
};
