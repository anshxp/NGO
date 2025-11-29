"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipResolvers = void 0;
const membership_1 = require("../../schema/membership");
const user_1 = require("../../schema/user");
const qrcode_1 = require("../../utils/qrcode");
const pdfGenerator_1 = require("../../utils/pdfGenerator");
const email_1 = require("../../utils/email");
exports.membershipResolvers = {
    Query: {
        getMemberships: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await membership_1.MembershipModel.find()
                .populate('userId')
                .populate('designationId');
        },
        getMembershipById: async (args, context) => {
            const membership = await membership_1.MembershipModel.findById(args.id)
                .populate('userId')
                .populate('designationId');
            return membership;
        },
        getMembershipsByStatus: async (args, context) => {
            return await membership_1.MembershipModel.find({ membershipStatus: args.status })
                .populate('userId')
                .populate('designationId');
        }
    },
    Mutation: {
        registerMembership: async (args, context) => {
            try {
                const { userId, designationId, membershipFee } = args;
                const user = await user_1.UserModel.findById(userId);
                if (!user)
                    throw new Error('User not found');
                const memberId = `MEM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const qrData = `${memberId}|${user.email}|${new Date().toISOString()}`;
                const qrCode = await (0, qrcode_1.generateQRCodeDataURL)(qrData);
                // Generate ID Card
                const idCardPath = await (0, pdfGenerator_1.generateMembershipIDCard)({
                    memberId,
                    name: user.name,
                    email: user.email,
                    designation: args.designationName || 'Member',
                    joinDate: new Date().toLocaleDateString()
                }, qrData);
                const membership = new membership_1.MembershipModel({
                    memberId,
                    userId,
                    designationId,
                    membershipStatus: 'active',
                    membershipFee,
                    joiningDate: new Date(),
                    qrCode,
                    idCardUrl: idCardPath
                });
                const savedMembership = await membership.save();
                // Update user membership data
                user.membershipId = memberId;
                user.membershipStatus = 'active';
                user.membershipFee = membershipFee;
                user.membershipPaidDate = new Date();
                await user.save();
                // Send receipt email
                await (0, email_1.sendMembershipReceipt)({
                    email: user.email,
                    name: user.name,
                    membershipId: memberId,
                    membershipFee
                });
                return {
                    ...savedMembership.toObject(),
                    success: true,
                    message: 'Membership registered successfully'
                };
            }
            catch (error) {
                throw new Error(`Membership registration failed: ${error.message}`);
            }
        },
        renewMembership: async (args, context) => {
            try {
                const { membershipId } = args;
                const membership = await membership_1.MembershipModel.findByIdAndUpdate(membershipId, {
                    membershipStatus: 'active',
                    renewalDate: new Date(),
                    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                }, { new: true }).populate('userId');
                return {
                    ...membership?.toObject(),
                    success: true,
                    message: 'Membership renewed successfully'
                };
            }
            catch (error) {
                throw new Error(`Membership renewal failed: ${error.message}`);
            }
        },
        suspendMembership: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const membership = await membership_1.MembershipModel.findByIdAndUpdate(args.membershipId, { membershipStatus: 'suspended' }, { new: true });
            return {
                ...membership?.toObject(),
                success: true,
                message: 'Membership suspended'
            };
        }
    }
};
