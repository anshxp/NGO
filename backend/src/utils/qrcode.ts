import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export const generateQRCode = async (data: string, filename: string): Promise<string> => {
    const qrDir = path.join(process.cwd(), 'qrcodes');
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

    const filePath = path.join(qrDir, `${filename}.png`);

    try {
        await QRCode.toFile(filePath, data, {
            errorCorrectionLevel: 'H' as const,
            width: 200,
            margin: 2
        });
        return filePath;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

export const generateQRCodeBuffer = async (data: string): Promise<Buffer> => {
    try {
        const buffer = await QRCode.toBuffer(data, {
            errorCorrectionLevel: 'H' as const,
            type: 'png' as const,
            width: 200,
            margin: 2
        });
        return buffer as unknown as Buffer;
    } catch (error) {
        console.error('Error generating QR code buffer:', error);
        throw error;
    }
};

export const generateQRCodeDataURL = async (data: string): Promise<string> => {
    try {
        const dataUrl = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'H' as const,
            width: 200,
            margin: 2
        });
        return dataUrl;
    } catch (error) {
        console.error('Error generating QR code data URL:', error);
        throw error;
    }
};
