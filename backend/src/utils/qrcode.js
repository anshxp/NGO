import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
export const generateQRCode = async (data, filename) => {
    const qrDir = path.join(process.cwd(), 'qrcodes');
    if (!fs.existsSync(qrDir))
        fs.mkdirSync(qrDir, { recursive: true });
    const filePath = path.join(qrDir, `${filename}.png`);
    try {
        await QRCode.toFile(filePath, data, {
            errorCorrectionLevel: 'H',
            width: 200,
            margin: 2
        });
        return filePath;
    }
    catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};
export const generateQRCodeBuffer = async (data) => {
    try {
        const buffer = await QRCode.toBuffer(data, {
            errorCorrectionLevel: 'H',
            type: 'png',
            width: 200,
            margin: 2
        });
        return buffer;
    }
    catch (error) {
        console.error('Error generating QR code buffer:', error);
        throw error;
    }
};
export const generateQRCodeDataURL = async (data) => {
    try {
        const dataUrl = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'H',
            width: 200,
            margin: 2
        });
        return dataUrl;
    }
    catch (error) {
        console.error('Error generating QR code data URL:', error);
        throw error;
    }
};
