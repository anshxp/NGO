import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { generateQRCodeBuffer } from './qrcode';
export const generateMembershipIDCard = async (memberData, qrCodeData) => {
    const cardsDir = path.join(process.cwd(), 'membership_cards');
    if (!fs.existsSync(cardsDir))
        fs.mkdirSync(cardsDir, { recursive: true });
    const filePath = path.join(cardsDir, `membership_${memberData.memberId}.pdf`);
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: [400, 250] });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            // Header
            doc.fillColor('#2196F3').rect(0, 0, 400, 60).fill();
            doc.fillColor('white').fontSize(20).text('NGO Membership', 20, 15, { width: 360 });
            // Member Details
            doc.fillColor('#333');
            doc.fontSize(12).text(`ID: ${memberData.memberId}`, 20, 80);
            doc.fontSize(14).text(`${memberData.name}`, 20, 100, { width: 360 });
            doc.fontSize(10).text(`Designation: ${memberData.designation}`, 20, 125);
            doc.fontSize(10).text(`Email: ${memberData.email}`, 20, 145);
            doc.fontSize(10).text(`Joined: ${memberData.joinDate}`, 20, 165);
            // QR Code
            try {
                const qrBuffer = await generateQRCodeBuffer(qrCodeData);
                doc.image(qrBuffer, 280, 80, { width: 100 });
            }
            catch (error) {
                console.log('QR code generation skipped');
            }
            // Footer
            doc.fillColor('#999').fontSize(8).text('This card is non-transferable. Please preserve it.', 20, 200, { width: 360 });
            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        }
        catch (error) {
            reject(error);
        }
    });
};
export const generateCertificate = async (certificateData, qrCodeData) => {
    const certificatesDir = path.join(process.cwd(), 'certificates');
    if (!fs.existsSync(certificatesDir))
        fs.mkdirSync(certificatesDir, { recursive: true });
    const filePath = path.join(certificatesDir, `certificate_${certificateData.verificationCode}.pdf`);
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 40 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            // Decorative border
            doc.strokeColor('#2196F3').lineWidth(2).rect(50, 50, 500, 600).stroke();
            doc.strokeColor('#2196F3').lineWidth(1).rect(60, 60, 480, 580).stroke();
            // Certificate title
            doc.fillColor('#2196F3').fontSize(36).text('CERTIFICATE OF ACHIEVEMENT', {
                align: 'center',
                width: 480
            });
            doc.moveDown(2);
            // Recipient name
            doc.fillColor('#333').fontSize(24).text(certificateData.recipientName, {
                align: 'center',
                width: 480,
                underline: true
            });
            doc.moveDown(2);
            // Certificate body
            doc.fillColor('#666').fontSize(12).text('This is to certify that', { align: 'center', width: 480 });
            doc.text(certificateData.title, { align: 'center', width: 480 });
            if (certificateData.description) {
                doc.moveDown();
                doc.fontSize(11).text(certificateData.description, { align: 'center', width: 480 });
            }
            doc.moveDown(2);
            // Issue date
            doc.fontSize(10).text(`Date of Issue: ${certificateData.issueDate}`, { align: 'center', width: 480 });
            // QR Code
            try {
                const qrBuffer = await generateQRCodeBuffer(qrCodeData);
                doc.image(qrBuffer, 240, 380, { width: 80 });
            }
            catch (error) {
                console.log('QR code generation skipped');
            }
            doc.moveDown(6);
            // Verification code
            doc.fontSize(8).text(`Verification Code: ${certificateData.verificationCode}`, {
                align: 'center',
                width: 480
            });
            // Footer
            doc.fontSize(9).fillColor('#999').text('This certificate is digitally verified and can be authenticated at our portal.', {
                align: 'center',
                width: 480
            });
            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        }
        catch (error) {
            reject(error);
        }
    });
};
export const generateAppointmentLetter = async (letterData, qrCodeData) => {
    const lettersDir = path.join(process.cwd(), 'appointment_letters');
    if (!fs.existsSync(lettersDir))
        fs.mkdirSync(lettersDir, { recursive: true });
    const filePath = path.join(lettersDir, `appointment_${letterData.name}_${Date.now()}.pdf`);
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            // Header
            doc.fontSize(16).text('APPOINTMENT LETTER', { align: 'center' });
            doc.moveDown();
            // Content
            doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
            doc.moveDown();
            doc.text(`Dear ${letterData.name},`, { align: 'left' });
            doc.moveDown();
            doc.fontSize(11).text(`We are pleased to offer you the position of ${letterData.designation} with our organization.`, {
                width: 450
            });
            doc.moveDown();
            doc.text('Position Details:', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10).text(`• Designation: ${letterData.designation}`);
            doc.text(`• Start Date: ${letterData.startDate}`);
            if (letterData.salaryStipend) {
                doc.text(`• Stipend: ₹${letterData.salaryStipend}/month`);
            }
            doc.moveDown();
            doc.text('Key Responsibilities:', { underline: true });
            doc.moveDown(0.5);
            letterData.responsibilities.forEach(resp => {
                doc.text(`• ${resp}`);
            });
            doc.moveDown(2);
            doc.text('We look forward to your contribution to our mission.', { width: 450 });
            doc.moveDown(2);
            // QR Code
            try {
                const qrBuffer = await generateQRCodeBuffer(qrCodeData);
                doc.image(qrBuffer, 400, doc.y + 50, { width: 80 });
            }
            catch (error) {
                console.log('QR code generation skipped');
            }
            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        }
        catch (error) {
            reject(error);
        }
    });
};
export const generate80GReceipt = async (receiptData, qrCodeData) => {
    const receiptsDir = path.join(process.cwd(), '80g_receipts');
    if (!fs.existsSync(receiptsDir))
        fs.mkdirSync(receiptsDir, { recursive: true });
    const filePath = path.join(receiptsDir, `80g_${receiptData.transactionId}.pdf`);
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 40 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            // Header
            doc.fillColor('#27AE60').fontSize(20).text('80G TAX BENEFIT RECEIPT', { align: 'center' });
            doc.moveDown();
            // Receipt Details
            doc.fontSize(12).fillColor('#333');
            doc.text(`Receipt Number: ${receiptData.transactionId}`, { width: 450 });
            doc.text(`Date: ${receiptData.date}`, { width: 450 });
            doc.moveDown();
            // Donor Details
            doc.text('Donor Information:', { underline: true });
            doc.fontSize(11);
            doc.text(`Name: ${receiptData.donorName}`, { width: 450 });
            if (receiptData.panNumber) {
                doc.text(`PAN: ${receiptData.panNumber}`, { width: 450 });
            }
            doc.moveDown();
            // Donation Details
            doc.fontSize(12).text('Donation Details:', { underline: true });
            doc.fontSize(11);
            doc.text(`Amount: ₹${receiptData.amount.toLocaleString('en-IN')}`, { width: 450 });
            doc.moveDown();
            // Tax Benefits
            doc.fontSize(11).text('80G Tax Benefit Information:', { underline: true });
            doc.fontSize(10).fillColor('#666');
            doc.text('This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.', {
                width: 450
            });
            doc.text('Please mention the receipt number while filing your income tax return.', { width: 450 });
            // QR Code
            try {
                const qrBuffer = await generateQRCodeBuffer(qrCodeData);
                doc.image(qrBuffer, 400, 450, { width: 100 });
            }
            catch (error) {
                console.log('QR code generation skipped');
            }
            // Footer
            doc.fontSize(9).fillColor('#999').text('This is an electronically generated receipt. No signature required.', {
                align: 'center',
                width: 450
            });
            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        }
        catch (error) {
            reject(error);
        }
    });
};
export const generateReportPDF = async (reportTitle, reportContent) => {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir))
        fs.mkdirSync(reportsDir, { recursive: true });
    const timestamp = new Date().toISOString().split('T')[0];
    const filePath = path.join(reportsDir, `${reportTitle}_${timestamp}.pdf`);
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 40 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            // Title
            doc.fontSize(18).text(reportTitle, { align: 'center' });
            doc.fontSize(10).fillColor('#999').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
            doc.moveDown(2);
            // Content sections
            reportContent.forEach(section => {
                doc.fontSize(14).fillColor('#333').text(section.section, { underline: true });
                doc.moveDown();
                if (Array.isArray(section.data)) {
                    section.data.forEach(item => {
                        doc.fontSize(11).text(`• ${JSON.stringify(item)}`);
                    });
                }
                else {
                    doc.fontSize(11).text(JSON.stringify(section.data, null, 2));
                }
                doc.moveDown();
            });
            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        }
        catch (error) {
            reject(error);
        }
    });
};
