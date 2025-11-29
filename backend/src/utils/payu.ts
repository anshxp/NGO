import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

interface PayUConfig {
    merchantKey: string;
    merchantSalt: string;
    baseUrl: string;
}

const payuConfig: PayUConfig = {
    merchantKey: process.env.PAYU_MERCHANT_KEY || '',
    merchantSalt: process.env.PAYU_MERCHANT_SALT || '',
    baseUrl: process.env.NODE_ENV === 'production'
        ? 'https://secure.payu.in'
        : 'https://test.payu.in'
};

export const createPayUOrder = async (
    amount: number,
    orderId: string,
    userEmail: string,
    userName: string,
    redirectUrl: string
) => {
    try {
        const txnid = orderId;
        const hash = generatePayUHash(txnid, amount);

        const formData = new URLSearchParams({
            key: payuConfig.merchantKey,
            txnid,
            amount: amount.toString(),
            productinfo: 'NGO Donation',
            firstname: userName,
            email: userEmail,
            phone: '',
            surl: `${redirectUrl}?status=success`,
            furl: `${redirectUrl}?status=failed`,
            hash
        });

        // Return the form data for frontend form submission
        return {
            baseUrl: `${payuConfig.baseUrl}/_payment`,
            formData: Object.fromEntries(formData)
        };
    } catch (error) {
        console.error('PayU order creation failed:', error);
        throw new Error('Failed to create PayU payment order');
    }
};

export const verifyPayUPayment = async (
    txnid: string,
    amount: string,
    productinfo: string,
    firstname: string,
    email: string,
    status: string,
    hash: string
): Promise<boolean> => {
    try {
        const verifyHash = generatePayUHash(txnid, parseFloat(amount));
        
        if (verifyHash !== hash) {
            console.error('PayU hash verification failed');
            return false;
        }

        return status === 'success';
    } catch (error) {
        console.error('PayU verification failed:', error);
        return false;
    }
};

const generatePayUHash = (txnid: string, amount: number): string => {
    const hashString = `${payuConfig.merchantKey}|${txnid}|${amount}|NGO Donation|||udf1|udf2|udf3|udf4|udf5||${payuConfig.merchantSalt}`;
    
    return crypto
        .createHash('sha512')
        .update(hashString)
        .digest('hex');
};
