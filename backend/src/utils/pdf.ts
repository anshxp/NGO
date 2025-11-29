import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { IDonate } from '../schema/donate';

export const generateDonationPDF = async (donation: IDonate): Promise<string> => {
    const receiptsDir = path.join(process.cwd(), 'receipts');
    if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });

    const filePath = path.join(receiptsDir, `donation_${donation.transactionId}.pdf`);

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
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
        if (donation.orderId) doc.text(`Order ID: ${donation.orderId}`);
        if (donation.paymentId) doc.text(`Payment ID: ${donation.paymentId}`);
        doc.text(`Date: ${donation.timestamp.toLocaleString()}`);
        doc.moveDown();

        doc.fontSize(10).fillColor('#666').text('Thank you for supporting our mission.', { align: 'center' });
        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};
