"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptResolvers = void 0;
const receipt_1 = require("../../schema/receipt");
exports.receiptResolvers = {
    Query: {
        getReceipts: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await receipt_1.ReceiptModel.find()
                .populate('userId')
                .sort({ date: -1 });
        },
        getUserReceipts: async (args, context) => {
            return await receipt_1.ReceiptModel.find({ userId: context.userId })
                .sort({ date: -1 });
        },
        getReceiptsByType: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await receipt_1.ReceiptModel.find({ receiptType: args.type })
                .populate('userId')
                .sort({ date: -1 });
        }
    },
    Mutation: {
        createReceipt: async (args, context) => {
            if (!context.user)
                throw new Error('Authentication required');
            try {
                const receiptId = `REC-${Date.now()}`;
                const receipt = new receipt_1.ReceiptModel({
                    receiptId,
                    receiptType: args.receiptType,
                    userId: context.userId,
                    referenceId: args.referenceId,
                    amount: args.amount,
                    paymentMethod: args.paymentMethod,
                    transactionId: args.transactionId,
                    pdfUrl: args.pdfUrl,
                    qrCode: args.qrCode
                });
                const savedReceipt = await receipt.save();
                return { ...savedReceipt.toObject(), success: true };
            }
            catch (error) {
                throw new Error(`Receipt creation failed: ${error.message}`);
            }
        },
        voidReceipt: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const receipt = await receipt_1.ReceiptModel.findByIdAndUpdate(args.id, { status: 'voided' }, { new: true });
            return { ...receipt?.toObject(), success: true };
        }
    }
};
