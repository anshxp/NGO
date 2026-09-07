import { UserModel } from '../../schema/user';
import { generateToken, hashPassword, comparePassword, generateReferralCode, generateMembershipId } from '../../utils/auth';

const setAuthCookie = (context: any, token: string) => {
    const res = context?.res;
    if (!res?.cookie) return;
    res.cookie('ngo_access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 15 * 60 * 1000,
        path: '/'
    });
};

export const userResolvers = {
    Query: {
        getUsers: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') throw new Error('Unauthorized');
            const limit = Math.min(Math.max(args.limit || 10, 1), 100);
            const offset = Math.max(args.offset || 0, 0);
            return await UserModel.find().select('-password').limit(limit).skip(offset).populate('designation');
        },
        getUser: async (args: any, context: any) => {
            if (!context.user) throw new Error('Unauthorized');
            if (context.user.role !== 'admin' && context.userId !== args.id) throw new Error('Unauthorized');
            return await UserModel.findById(args.id).select('-password').populate('designation referredBy');
        },
        getUserByReferralCode: async (args: any) => {
            const user = await UserModel.findOne({ referralCode: args.referralCode }).select('name referralCode membershipId designation membershipStatus').populate('designation');
            return user;
        },
        me: async (_args: any, context: any) => {
            if (!context.userId) throw new Error('Not authenticated');
            return await UserModel.findById(context.userId).select('-password').populate('designation');
        }
    },
    Mutation: {
        register: async ({ input }: any, context: any) => {
            const { name, email, password, phone, designation, dateOfBirth, address, referralCode } = input;
            const normalizedEmail = String(email).trim().toLowerCase();
            const existingUser = await UserModel.findOne({ email: normalizedEmail });
            if (existingUser) throw new Error('Unable to register with those details');

            const hashedPassword = await hashPassword(password);
            let referrer = null;
            if (referralCode) {
                referrer = await UserModel.findOne({ referralCode });
                if (!referrer) throw new Error('Invalid referral code');
            }

            const user = new UserModel({
                name: String(name).trim(),
                email: normalizedEmail,
                password: hashedPassword,
                phone: String(phone).trim(),
                designation,
                dateOfBirth,
                address,
                referralCode: generateReferralCode(),
                referredBy: referrer?._id,
                membershipStatus: 'pending'
            });

            await user.save();
            if (referrer) {
                referrer.totalReferrals += 1;
                await referrer.save();
            }

            const token = generateToken((user._id as any).toString());
            setAuthCookie(context, token);
            return { token, user };
        },
        login: async ({ input }: any, context: any) => {
            const email = String(input.email).trim().toLowerCase();
            const user = await UserModel.findOne({ email });
            if (!user || !(await comparePassword(input.password, user.password))) {
                throw new Error('Invalid credentials');
            }

            user.lastLogin = new Date();
            await user.save();

            const token = generateToken((user._id as any).toString());
            setAuthCookie(context, token);
            return { token, user };
        },
        updateMembershipStatus: async (args: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') throw new Error('Unauthorized');
            if (!['active', 'inactive', 'pending'].includes(args.status)) throw new Error('Invalid membership status');

            const user = await UserModel.findById(args.userId);
            if (!user) throw new Error('User not found');
            user.membershipStatus = args.status;
            if (args.status === 'active' && !user.membershipId) user.membershipId = generateMembershipId(args.userId);
            await user.save();
            return user;
        },
        generateMembershipId: async (args: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') throw new Error('Unauthorized');
            const user = await UserModel.findById(args.userId);
            if (!user) throw new Error('User not found');
            if (!user.membershipId) {
                user.membershipId = generateMembershipId(args.userId);
                await user.save();
            }
            return user;
        }
    }
};
