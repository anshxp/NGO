import { MembershipModel } from '../../schema/membership';
import { UserModel } from '../../schema/user';
import { generateQRCodeDataURL } from '../../utils/qrcode';
import { generateMembershipIDCard } from '../../utils/pdfGenerator';
import { sendMembershipReceipt } from '../../utils/email';
import { v4 as uuidv4 } from 'uuid';

export const membershipResolvers = {
    Query: {
        getMemberships: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await MembershipModel.find()
                .populate('userId')
                .populate('designationId');
        },
        getMembershipById: async (args: any, context: any) => {
            const membership = await MembershipModel.findById(args.id)
                .populate('userId')
                .populate('designationId');
            return membership;
        },
        getMembershipsByStatus: async (args: any, context: any) => {
            return await MembershipModel.find({ membershipStatus: args.status })
                .populate('userId')
                .populate('designationId');
        }
    },
    Mutation: {
        registerMembership: async (args: any, context: any) => {
            try {
                const { userId, designationId, membershipFee } = args;

                const user = await UserModel.findById(userId);
                if (!user) throw new Error('User not found');

                const memberId = `MEM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const qrData = `${memberId}|${user.email}|${new Date().toISOString()}`;
                const qrCode = await generateQRCodeDataURL(qrData);

                // Generate ID Card
                const idCardPath = await generateMembershipIDCard(
                    {
                        memberId,
                        name: user.name,
                        email: user.email,
                        designation: args.designationName || 'Member',
                        joinDate: new Date().toLocaleDateString()
                    },
                    qrData
                );

                const membership = new MembershipModel({
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
                await sendMembershipReceipt({
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
            } catch (error: any) {
                throw new Error(`Membership registration failed: ${error.message}`);
            }
        },

        renewMembership: async (args: any, context: any) => {
            try {
                const { membershipId } = args;

                const membership = await MembershipModel.findByIdAndUpdate(
                    membershipId,
                    {
                        membershipStatus: 'active',
                        renewalDate: new Date(),
                        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                    },
                    { new: true }
                ).populate('userId');

                return {
                    ...membership?.toObject(),
                    success: true,
                    message: 'Membership renewed successfully'
                };
            } catch (error: any) {
                throw new Error(`Membership renewal failed: ${error.message}`);
            }
        },

        suspendMembership: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const membership = await MembershipModel.findByIdAndUpdate(
                args.membershipId,
                { membershipStatus: 'suspended' },
                { new: true }
            );

            return {
                ...membership?.toObject(),
                success: true,
                message: 'Membership suspended'
            };
        }
    }
};
