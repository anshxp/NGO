"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProgress = exports.isBirthday = exports.calculateAge = exports.getMonthName = exports.formatDate = exports.formatCurrency = exports.slugify = exports.validateAmount = exports.validatePhone = exports.validateEmail = exports.generateReceiptId = exports.generateTransactionId = exports.generateCertificateId = exports.generateMemberId = exports.generateUniqueId = exports.generateRandomCode = void 0;
var crypto_1 = __importDefault(require("crypto"));
exports.generateRandomCode = function (length) {
    if (length === void 0) { length = 6; }
    return crypto_1.default.randomBytes(length).toString('hex').substring(0, length).toUpperCase();
};
exports.generateUniqueId = function (prefix) {
    if (prefix === void 0) { prefix = ''; }
    return ("" + prefix + Date.now() + Math.random().toString(36).substr(2, 9)).toUpperCase();
};
exports.generateMemberId = function () {
    return ("MEM" + Date.now() + Math.random().toString(36).substr(2, 5)).toUpperCase();
};
exports.generateCertificateId = function () {
    return ("CERT" + Date.now() + Math.random().toString(36).substr(2, 5)).toUpperCase();
};
exports.generateTransactionId = function () {
    return ("TXN" + Date.now() + Math.random().toString(36).substr(2, 5)).toUpperCase();
};
exports.generateReceiptId = function () {
    return ("REC" + Date.now() + Math.random().toString(36).substr(2, 5)).toUpperCase();
};
exports.validateEmail = function (email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validatePhone = function (phone) {
    var phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};
exports.validateAmount = function (amount) {
    return amount > 0 && amount <= 10000000; // Max 1 Crore
};
exports.slugify = function (text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
};
exports.formatCurrency = function (amount, currency) {
    if (currency === void 0) { currency = 'INR'; }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency
    }).format(amount);
};
exports.formatDate = function (date) {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
exports.getMonthName = function (monthNumber) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1] || '';
};
exports.calculateAge = function (birthDate) {
    var today = new Date();
    var birth = new Date(birthDate);
    var age = today.getFullYear() - birth.getFullYear();
    var monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};
exports.isBirthday = function (birthDate) {
    var birth = new Date(birthDate);
    var today = new Date();
    return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
};
exports.calculateProgress = function (current, total) {
    if (total === 0)
        return 0;
    return Math.min(100, Math.round((current / total) * 100));
};
