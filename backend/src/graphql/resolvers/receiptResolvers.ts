import { ReceiptModel } from '../../schema/receipt';

export const receiptResolvers = {
    Query: {
        getReceipts: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await ReceiptModel.find()
                .populate('userId')
                .sort({ date: -1 });
        },
        getUserReceipts: async (args: any, context: any) => {
            return await ReceiptModel.find({ userId: context.userId })
                .sort({ date: -1 });
        },
        getReceiptsByType: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await ReceiptModel.find({ receiptType: args.type })
                .populate('userId')
                .sort({ date: -1 });
        }
    },
    Mutation: {
        createReceipt: async (args: any, context: any) => {
            if (!context.user) throw new Error('Authentication required');

            try {
                const receiptId = `REC-${Date.now()}`;
                const receipt = new ReceiptModel({
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
            } catch (error: any) {
                throw new Error(`Receipt creation failed: ${error.message}`);
            }
        },

        voidReceipt: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const receipt = await ReceiptModel.findByIdAndUpdate(
                args.id,
                { status: 'voided' },
                { new: true }
            );

            return { ...receipt?.toObject(), success: true };
        }
    }
};
