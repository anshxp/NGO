import { EnquiryModel } from '../../schema/enquiry';
import { sendEnquiryResponseEmail } from '../../utils/email';

export const enquiryResolvers = {
    Query: {
        getEnquiries: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await EnquiryModel.find()
                .sort({ created_at: -1 });
        },
        getEnquiryById: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await EnquiryModel.findById(args.id);
        },
        getNewEnquiries: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await EnquiryModel.find({ status: 'new' });
        }
    },
    Mutation: {
        submitEnquiry: async (args: any, context: any) => {
            console.log('\n🔵 ===== submitEnquiry CALLED =====');
            console.log('📝 Arguments received:', JSON.stringify(args, null, 2));
            console.log('👤 Context user:', context.user ? `${context.user.name} (${context.user.role})` : 'No user');
            
            try {
                const { name, email, phone, subject, message } = args;
                
                console.log('📦 Destructured values:', { name, email, phone, subject, message });

                const enquiry = new EnquiryModel({
                    name,
                    email,
                    phone,
                    subject,
                    message,
                    status: 'new'
                });

                console.log('💾 Saving enquiry to database...');
                const savedEnquiry = await enquiry.save();
                console.log('✅ Enquiry saved successfully:', savedEnquiry._id);

                // Auto-response email
                try {
                    console.log('📧 Attempting to send auto-response email to:', email);
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

                    console.log('🔗 Email config - Host:', process.env.EMAIL_HOST, 'User:', process.env.EMAIL_USER);
                    
                    await transporter.sendMail({
                        from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                        to: email,
                        subject: `Enquiry Confirmation - ${subject}`,
                        html: autoResponseHTML
                    });
                    
                    console.log('✅ Email sent successfully');
                } catch (emailError) {
                    console.error('⚠️ Email sending error:', emailError.message);
                }

                const response = { success: true, message: 'Enquiry submitted successfully' };
                console.log('✅ Returning response:', response);
                console.log('🔵 ===== submitEnquiry SUCCESS =====\n');
                return response;
            } catch (error) {
                console.error('\n❌ ===== submitEnquiry ERROR =====');
                console.error('💬 Error message:', error.message);
                console.error('📍 Error stack:', error.stack);
                console.error('❌ ===== END ERROR =====\n');
                throw new Error(`Failed to submit enquiry: ${error.message}`);
            }
        },

        markEnquiryAsRead: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const enquiry = await EnquiryModel.findByIdAndUpdate(
                args.id,
                { status: 'read' },
                { new: true }
            );

            return { ...enquiry?.toObject(), success: true };
        },

        replyToEnquiry: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            try {
                const enquiry = await EnquiryModel.findById(args.id);
                if (!enquiry) throw new Error('Enquiry not found');

                enquiry.reply = args.reply;
                enquiry.repliedBy = context.userId;
                enquiry.repliedAt = new Date();
                enquiry.status = 'replied';

                const savedEnquiry = await enquiry.save();

                // Send reply email
                await sendEnquiryResponseEmail({
                    email: enquiry.email,
                    name: enquiry.name,
                    response: args.reply
                });

                return { ...savedEnquiry.toObject(), success: true, message: 'Reply sent successfully' };
            } catch (error) {
                throw new Error(`Failed to reply: ${error.message}`);
            }
        },

        deleteEnquiry: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            await EnquiryModel.findByIdAndDelete(args.id);
            return { success: true, message: 'Enquiry deleted' };
        }
    }
};
