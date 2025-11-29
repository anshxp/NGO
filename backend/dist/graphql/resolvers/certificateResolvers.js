"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateResolvers = void 0;
const certificate_1 = require("../../schema/certificate");
const visitorCertificate_1 = require("../../schema/visitorCertificate");
const qrcode_1 = require("../../utils/qrcode");
const pdfGenerator_1 = require("../../utils/pdfGenerator");
const email_1 = require("../../utils/email");
const uuid_1 = require("uuid");
exports.certificateResolvers = {
    Query: {
        getCertificates: async (args, context) => {
            return await certificate_1.CertificateModel.find({ recipientType: 'member' });
        },
        getVisitorCertificates: async (args, context) => {
            return await visitorCertificate_1.VisitorCertificateModel.find();
        },
        verifyCertificate: async (args, context) => {
            const { verificationCode } = args;
            const certificate = await certificate_1.CertificateModel.findOne({ verificationCode });
            if (!certificate)
                throw new Error('Certificate not found');
            return { ...certificate.toObject(), isVerified: true };
        },
        verifyVisitorCertificate: async (args, context) => {
            const { verificationCode } = args;
            const certificate = await visitorCertificate_1.VisitorCertificateModel.findOne({ verificationCode });
            if (!certificate)
                throw new Error('Certificate not found');
            return { ...certificate.toObject(), isVerified: true };
        }
    },
    Mutation: {
        issueCertificate: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            try {
                const { recipientId, title, description, recipientEmail, recipientName } = args;
                const verificationCode = (0, uuid_1.v4)();
                const certificateId = `CERT-${Date.now()}`;
                const qrData = `${certificateId}|${verificationCode}|${new Date().toISOString()}`;
                const qrCode = await (0, qrcode_1.generateQRCodeDataURL)(qrData);
                // Generate PDF
                const pdfPath = await (0, pdfGenerator_1.generateCertificate)({
                    recipientName,
                    title,
                    description,
                    issueDate: new Date().toLocaleDateString(),
                    verificationCode
                }, qrData);
                const certificate = new certificate_1.CertificateModel({
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
                await (0, email_1.sendCertificateEmail)({
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
            }
            catch (error) {
                throw new Error(`Certificate issuance failed: ${error.message}`);
            }
        },
        issueVisitorCertificate: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            try {
                const { visitorName, visitorEmail, visitorPhone, title, description, template } = args;
                const verificationCode = (0, uuid_1.v4)();
                const certificateId = `VCERT-${Date.now()}`;
                const qrData = `${certificateId}|${verificationCode}|${new Date().toISOString()}`;
                const qrCode = await (0, qrcode_1.generateQRCodeDataURL)(qrData);
                // Generate PDF with selected template
                const pdfPath = await (0, pdfGenerator_1.generateCertificate)({
                    recipientName: visitorName,
                    title,
                    description,
                    issueDate: new Date().toLocaleDateString(),
                    verificationCode
                }, qrData);
                const certificate = new visitorCertificate_1.VisitorCertificateModel({
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
                await (0, email_1.sendCertificateEmail)({
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
            }
            catch (error) {
                throw new Error(`Visitor certificate issuance failed: ${error.message}`);
            }
        }
    }
};
