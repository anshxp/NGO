"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.designationResolvers = void 0;
const designation_1 = require("../../schema/designation");
exports.designationResolvers = {
    Query: {
        getDesignations: async (_, { limit = 50, offset = 0 }) => {
            return await designation_1.DesignationModel.find().limit(limit).skip(offset);
        },
        getDesignation: async (_, { id }) => {
            return await designation_1.DesignationModel.findById(id);
        }
    },
    Mutation: {
        createDesignation: async (_, { input }, context) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const existing = await designation_1.DesignationModel.findOne({ code: input.code });
            if (existing) {
                throw new Error('Designation with this code already exists');
            }
            const designation = new designation_1.DesignationModel({
                name: input.name,
                code: input.code,
                fee: input.fee,
                description: input.description
            });
            await designation.save();
            return designation;
        },
        updateDesignation: async (_, { id, input }, context) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const designation = await designation_1.DesignationModel.findByIdAndUpdate(id, { ...input, updated_at: new Date() }, { new: true });
            if (!designation) {
                throw new Error('Designation not found');
            }
            return designation;
        },
        deleteDesignation: async (_, { id }, context) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const res = await designation_1.DesignationModel.findByIdAndDelete(id);
            return !!res;
        }
    }
};
