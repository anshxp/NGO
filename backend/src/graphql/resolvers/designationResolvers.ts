import { DesignationModel } from '../../schema/designation';

export const designationResolvers = {
    Query: {
        getDesignations: async (_: any, { limit = 50, offset = 0 }: any) => {
            return await DesignationModel.find().limit(limit).skip(offset);
        },
        getDesignation: async (_: any, { id }: any) => {
            return await DesignationModel.findById(id);
        }
    },
    Mutation: {
        createDesignation: async (_: any, { input }: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
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
        updateDesignation: async (_: any, { id, input }: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
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
        deleteDesignation: async (_: any, { id }: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const res = await DesignationModel.findByIdAndDelete(id);
            return !!res;
        }
    }
};
