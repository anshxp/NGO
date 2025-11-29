"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const user_1 = require("../../schema/user");
const auth_1 = require("../../utils/auth");
exports.userResolvers = {
    Query: {
        getUsers: async (_, { limit = 10, offset = 0 }) => {
            return await user_1.UserModel.find().limit(limit).skip(offset).populate('designation');
        },
        getUser: async (_, { id }) => {
            return await user_1.UserModel.findById(id).populate('designation referredBy');
        },
        getUserByReferralCode: async (_, { referralCode }) => {
            return await user_1.UserModel.findOne({ referralCode });
        },
        me: async (_, __, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            return await user_1.UserModel.findById(context.userId).populate('designation');
        }
    },
    Mutation: {
        register: async (_, { input }) => {
            const { name, email, password, phone, designation, dateOfBirth, address, referralCode } = input;
            // Check if user already exists
            const existingUser = await user_1.UserModel.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }
            // Hash password
            const hashedPassword = await (0, auth_1.hashPassword)(password);
            // Find referrer if referral code provided
            let referrer = null;
            if (referralCode) {
                referrer = await user_1.UserModel.findOne({ referralCode });
                if (!referrer) {
                    throw new Error('Invalid referral code');
                }
            }
            // Create user
            const user = new user_1.UserModel({
                name,
                email,
                password: hashedPassword,
                phone,
                designation,
                dateOfBirth,
                address,
                referralCode: (0, auth_1.generateReferralCode)(),
                referredBy: referrer?._id,
                membershipStatus: 'pending'
            });
            await user.save();
            // Update referrer's total referrals
            if (referrer) {
                referrer.totalReferrals += 1;
                await referrer.save();
            }
            // Generate token
            const token = (0, auth_1.generateToken)(user._id.toString());
            return {
                token,
                user
            };
        },
        login: async (_, { input }) => {
            const { email, password } = input;
            // Find user
            const user = await user_1.UserModel.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            // Verify password
            const isValidPassword = await (0, auth_1.comparePassword)(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }
            // Update last login
            user.lastLogin = new Date();
            await user.save();
            // Generate token
            const token = (0, auth_1.generateToken)(user._id.toString());
            return {
                token,
                user
            };
        },
        updateMembershipStatus: async (_, { userId, status }, context) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const user = await user_1.UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.membershipStatus = status;
            if (status === 'active' && !user.membershipId) {
                user.membershipId = (0, auth_1.generateMembershipId)(userId);
            }
            await user.save();
            return user;
        },
        generateMembershipId: async (_, { userId }, context) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const user = await user_1.UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            if (!user.membershipId) {
                user.membershipId = (0, auth_1.generateMembershipId)(userId);
                await user.save();
            }
            return user;
        }
    }
};
