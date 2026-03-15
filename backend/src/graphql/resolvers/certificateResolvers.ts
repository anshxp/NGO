import { CertificateModel } from '../../schema/certificate';
import { VisitorCertificateModel } from '../../schema/visitorCertificate';
import { generateQRCodeDataURL } from '../../utils/qrcode';
import { generateCertificate } from '../../utils/pdfGenerator';
import { sendCertificateEmail } from '../../utils/email';
import { v4 as uuidv4 } from 'uuid';

export const certificateResolvers = {
    Query: {
        getCertificates: async (args: any, context: any) => {
            return await CertificateModel.find({ recipientType: 'member' });
        },
        getVisitorCertificates: async (args: any, context: any) => {
            return await VisitorCertificateModel.find();
        },
        verifyCertificate: async (args: any, context: any) => {
            const { verificationCode } = args;
            const certificate = await CertificateModel.findOne({ verificationCode });
            if (!certificate) throw new Error('Certificate not found');
            return { ...certificate.toObject(), isVerified: true };
        },
        verifyVisitorCertificate: async (args: any, context: any) => {
            const { verificationCode } = args;
            const certificate = await VisitorCertificateModel.findOne({ verificationCode });
            if (!certificate) throw new Error('Certificate not found');
            return { ...certificate.toObject(), isVerified: true };
        }
    },
    Mutation: {
        issueCertificate: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            try {
                const { recipientId, title, description, recipientEmail, recipientName } = args;
                const verificationCode = uuidv4();
                const certificateId = `CERT-${Date.now()}`;

                const qrData = `${certificateId}|${verificationCode}|${new Date().toISOString()}`;
                const qrCode = await generateQRCodeDataURL(qrData);

                // Generate PDF
                const pdfPath = await generateCertificate(
                    {
                        recipientName,
                        title,
                        description,
                        issueDate: new Date().toLocaleDateString(),
                        verificationCode
                    },
                    qrData
                );

                const certificate = new CertificateModel({
                    certificateId,
                    recipientId,
                    recipientType: 'member',
                    recipientName,
                    recipientEmail,
                    title,
                    description,
                    qrCode,
                    pdfUrl: pdfPath,
                    verificationCode,
                    issueDate: new Date()
                });

                const savedCertificate = await certificate.save();

                // Send email
                await sendCertificateEmail({
                    email: recipientEmail,
                    name: recipientName,
                    certificateTitle: title,
                    certificateFile: pdfPath,
                    verificationCode
                });

                return {
                    ...savedCertificate.toObject(),
                    success: true,
                    message: 'Certificate issued successfully'
                };
            } catch (error) {
                throw new Error(`Certificate issuance failed: ${error.message}`);
            }
        },

        issueVisitorCertificate: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            try {
                const { visitorName, visitorEmail, visitorPhone, title, description, template } = args;
                const verificationCode = uuidv4();
                const certificateId = `VCERT-${Date.now()}`;

                const qrData = `${certificateId}|${verificationCode}|${new Date().toISOString()}`;
                const qrCode = await generateQRCodeDataURL(qrData);

                // Generate PDF with selected template
                const pdfPath = await generateCertificate(
                    {
                        recipientName: visitorName,
                        title,
                        description,
                        issueDate: new Date().toLocaleDateString(),
                        verificationCode
                    },
                    qrData
                );

                const certificate = new VisitorCertificateModel({
                    certificateId,
                    visitorName,
                    visitorEmail,
                    visitorPhone,
                    certificateTemplate: template,
                    title,
                    description,
                    qrCode,
                    pdfUrl: pdfPath,
                    verificationCode,
                    issueDate: new Date()
                });

                const savedCertificate = await certificate.save();

                // Send email
                await sendCertificateEmail({
                    email: visitorEmail,
                    name: visitorName,
                    certificateTitle: title,
                    certificateFile: pdfPath,
                    verificationCode
                });

                return {
                    ...savedCertificate.toObject(),
                    success: true,
                    message: 'Visitor certificate issued successfully'
                };
            } catch (error) {
                throw new Error(`Visitor certificate issuance failed: ${error.message}`);
            }
        }
    }
};
