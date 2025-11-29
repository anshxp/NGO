"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProgress = exports.isBirthday = exports.calculateAge = exports.getMonthName = exports.formatDate = exports.formatCurrency = exports.slugify = exports.validateAmount = exports.validatePhone = exports.validateEmail = exports.generateReceiptId = exports.generateTransactionId = exports.generateCertificateId = exports.generateMemberId = exports.generateUniqueId = exports.generateRandomCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRandomCode = (length = 6) => {
    return crypto_1.default.randomBytes(length).toString('hex').substring(0, length).toUpperCase();
};
exports.generateRandomCode = generateRandomCode;
const generateUniqueId = (prefix = '') => {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
};
exports.generateUniqueId = generateUniqueId;
const generateMemberId = () => {
    return `MEM${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};
exports.generateMemberId = generateMemberId;
const generateCertificateId = () => {
    return `CERT${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};
exports.generateCertificateId = generateCertificateId;
const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};
exports.generateTransactionId = generateTransactionId;
const generateReceiptId = () => {
    return `REC${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};
exports.generateReceiptId = generateReceiptId;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};
exports.validatePhone = validatePhone;
const validateAmount = (amount) => {
    return amount > 0 && amount <= 10000000; // Max 1 Crore
};
exports.validateAmount = validateAmount;
const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
};
exports.slugify = slugify;
const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
exports.formatDate = formatDate;
const getMonthName = (monthNumber) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1] || '';
};
exports.getMonthName = getMonthName;
const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};
exports.calculateAge = calculateAge;
const isBirthday = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
};
exports.isBirthday = isBirthday;
const calculateProgress = (current, total) => {
    if (total === 0)
        return 0;
    return Math.min(100, Math.round((current / total) * 100));
};
exports.calculateProgress = calculateProgress;
