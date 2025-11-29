"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCodeDataURL = exports.generateQRCodeBuffer = exports.generateQRCode = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateQRCode = async (data, filename) => {
    const qrDir = path_1.default.join(process.cwd(), 'qrcodes');
    if (!fs_1.default.existsSync(qrDir))
        fs_1.default.mkdirSync(qrDir, { recursive: true });
    const filePath = path_1.default.join(qrDir, `${filename}.png`);
    try {
        await qrcode_1.default.toFile(filePath, data, {
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
exports.generateQRCode = generateQRCode;
const generateQRCodeBuffer = async (data) => {
    try {
        const buffer = await qrcode_1.default.toBuffer(data, {
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
exports.generateQRCodeBuffer = generateQRCodeBuffer;
const generateQRCodeDataURL = async (data) => {
    try {
        const dataUrl = await qrcode_1.default.toDataURL(data, {
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
exports.generateQRCodeDataURL = generateQRCodeDataURL;
