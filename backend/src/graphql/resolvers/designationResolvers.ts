import { DesignationModel } from '../../schema/designation';

export const designationResolvers = {
    Query: {
        getDesignations: async (args: any, context: any) => {
            const { limit = 50, offset = 0 } = args;
            return await DesignationModel.find().limit(limit).skip(offset);
        },
        getDesignation: async (args: any, context: any) => {
            return await DesignationModel.findById(args.id);
        }
    },
    Mutation: {
        createDesignation: async (args: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const { input } = args;
            const existing = await DesignationModel.findOne({ code: input.code });
            if (existing) {
                throw new Error('Designation with this code already exists');
            }
            const designation = new DesignationModel({
                name: input.name,
                code: input.code,
                fee: input.fee,
                description: input.description
            });
            await designation.save();
            return designation;
        },
        updateDesignation: async (args: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const { id, input } = args;
            const designation = await DesignationModel.findByIdAndUpdate(
                id,
                { ...input, updated_at: new Date() },
                { new: true }
            );
            if (!designation) {
                throw new Error('Designation not found');
            }
            return designation;
        },
        deleteDesignation: async (args: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const res = await DesignationModel.findByIdAndDelete(args.id);
            return !!res;
        }
    }
};
