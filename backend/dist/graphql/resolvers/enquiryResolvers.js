"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryResolvers = void 0;
const enquiry_1 = require("../../schema/enquiry");
const email_1 = require("../../utils/email");
exports.enquiryResolvers = {
    Query: {
        getEnquiries: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await enquiry_1.EnquiryModel.find()
                .sort({ created_at: -1 });
        },
        getEnquiryById: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await enquiry_1.EnquiryModel.findById(args.id);
        },
        getNewEnquiries: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await enquiry_1.EnquiryModel.find({ status: 'new' });
        }
    },
    Mutation: {
        submitEnquiry: async (args, context) => {
            try {
                const { name, email, phone, subject, message } = args;
                const enquiry = new enquiry_1.EnquiryModel({
                    name,
                    email,
                    phone,
                    subject,
                    message,
                    status: 'new'
                });
                const savedEnquiry = await enquiry.save();
                // Auto-response email
                const autoResponseHTML = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
                            .content { background: #f5f5f5; padding: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Thank You for Your Enquiry</h1>
                            </div>
                            <div class="content">
                                <p>Dear ${name},</p>
                                <p>Thank you for reaching out to us. We have received your enquiry and will respond shortly.</p>
                                <p><strong>Enquiry Subject:</strong> ${subject}</p>
                                <p>Our team will review your message and get back to you soon.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `;
                // Send auto-response email
                const nodemailer = require('nodemailer');
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.EMAIL_PORT || '587'),
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                    to: email,
                    subject: `Enquiry Confirmation - ${subject}`,
                    html: autoResponseHTML
                });
                return { ...savedEnquiry.toObject(), success: true, message: 'Enquiry submitted successfully' };
            }
            catch (error) {
                throw new Error(`Failed to submit enquiry: ${error.message}`);
            }
        },
        markEnquiryAsRead: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const enquiry = await enquiry_1.EnquiryModel.findByIdAndUpdate(args.id, { status: 'read' }, { new: true });
            return { ...enquiry?.toObject(), success: true };
        },
        replyToEnquiry: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            try {
                const enquiry = await enquiry_1.EnquiryModel.findById(args.id);
                if (!enquiry)
                    throw new Error('Enquiry not found');
                enquiry.reply = args.reply;
                enquiry.repliedBy = context.userId;
                enquiry.repliedAt = new Date();
                enquiry.status = 'replied';
                const savedEnquiry = await enquiry.save();
                // Send reply email
                await (0, email_1.sendEnquiryResponseEmail)({
                    email: enquiry.email,
                    name: enquiry.name,
                    response: args.reply
                });
                return { ...savedEnquiry.toObject(), success: true, message: 'Reply sent successfully' };
            }
            catch (error) {
                throw new Error(`Failed to reply: ${error.message}`);
            }
        },
        deleteEnquiry: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            await enquiry_1.EnquiryModel.findByIdAndDelete(args.id);
            return { success: true, message: 'Enquiry deleted' };
        }
    }
};
