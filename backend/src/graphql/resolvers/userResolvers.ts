import { UserModel } from '../../schema/user';
import { generateToken, hashPassword, comparePassword, generateReferralCode, generateMembershipId } from '../../utils/auth';

export const userResolvers = {
    Query: {
        getUsers: async (args: any, context: any) => {
            const { limit = 10, offset = 0 } = args;
            return await UserModel.find().limit(limit).skip(offset).populate('designation');
        },
        getUser: async (args: any, context: any) => {
            return await UserModel.findById(args.id).populate('designation referredBy');
        },
        getUserByReferralCode: async (args: any, context: any) => {
            return await UserModel.findOne({ referralCode: args.referralCode });
        },
        me: async (args: any, context: any) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            return await UserModel.findById(context.userId).populate('designation');
        }
    },
    Mutation: {
        register: async ({ input }: any, context: any) => {
            const { name, email, password, phone, designation, dateOfBirth, address, referralCode } = input;

            // Check if user already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Find referrer if referral code provided
            let referrer = null;
            if (referralCode) {
                referrer = await UserModel.findOne({ referralCode });
                if (!referrer) {
                    throw new Error('Invalid referral code');
                }
            }

            // Create user
            const user = new UserModel({
                name,
                email,
                password: hashedPassword,
                phone,
                designation,
                dateOfBirth,
                address,
                referralCode: generateReferralCode(),
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
            const token = generateToken((user._id as any).toString());

            return {
                token,
                user
            };
        },
        login: async ({ input }: any, context: any) => {
            const { email, password } = input;

            // Find user
            const user = await UserModel.findOne({ email });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Verify password
            const isValidPassword = await comparePassword(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Generate token
            const token = generateToken((user._id as any).toString());

            return {
                token,
                user
            };
        },
        updateMembershipStatus: async (args: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const { userId, status } = args;
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            user.membershipStatus = status;
            if (status === 'active' && !user.membershipId) {
                user.membershipId = generateMembershipId(userId);
            }

            await user.save();
            return user;
        },
        generateMembershipId: async (args: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const { userId } = args;
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            if (!user.membershipId) {
                user.membershipId = generateMembershipId(userId);
                await user.save();
            }

            return user;
        }
    }
};
