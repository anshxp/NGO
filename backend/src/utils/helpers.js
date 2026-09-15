import crypto from 'crypto';
export const generateRandomCode = (length = 6) => {
    return crypto.randomBytes(length).toString('hex').substring(0, length).toUpperCase();
};
export const generateUniqueId = (prefix = '') => {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
};
export const generateMemberId = () => {
    return `MEM${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};
export const generateCertificateId = () => {
    return `CERT${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};
export const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};
export const generateReceiptId = () => {
    return `REC${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};
export const validateAmount = (amount) => {
    return amount > 0 && amount <= 10000000; // Max 1 Crore
};
export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
};
export const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency
    }).format(amount);
};
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
export const getMonthName = (monthNumber) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1] || '';
};
export const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};
export const isBirthday = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
};
export const calculateProgress = (current, total) => {
    if (total === 0)
        return 0;
    return Math.min(100, Math.round((current / total) * 100));
};
