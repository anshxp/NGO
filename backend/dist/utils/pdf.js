"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDonationPDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateDonationPDF = async (donation) => {
    const receiptsDir = path_1.default.join(process.cwd(), 'receipts');
    if (!fs_1.default.existsSync(receiptsDir))
        fs_1.default.mkdirSync(receiptsDir, { recursive: true });
    const filePath = path_1.default.join(receiptsDir, `donation_${donation.transactionId}.pdf`);
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default({ margin: 50 });
        const stream = fs_1.default.createWriteStream(filePath);
        doc.pipe(stream);
        doc.fontSize(22).fillColor('#333').text('Donation Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Transaction ID: ${donation.transactionId}`);
        doc.text(`Donator: ${donation.isAnonymous ? 'Anonymous' : donation.donator}`);
        doc.text(`Email: ${donation.donatorEmail}`);
        doc.text(`Amount: ₹${donation.amount.toFixed(2)}`);
        doc.text(`Donation Type: ${donation.donation_type}`);
        doc.text(`Payment Method: ${donation.payment_method}`);
        doc.text(`Payment Status: ${donation.payment_status}`);
        if (donation.orderId)
            doc.text(`Order ID: ${donation.orderId}`);
        if (donation.paymentId)
            doc.text(`Payment ID: ${donation.paymentId}`);
        doc.text(`Date: ${donation.timestamp.toLocaleString()}`);
        doc.moveDown();
        doc.fontSize(10).fillColor('#666').text('Thank you for supporting our mission.', { align: 'center' });
        doc.end();
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};
exports.generateDonationPDF = generateDonationPDF;
