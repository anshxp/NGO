import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

interface PhonePeConfig {
    merchantId: string;
    saltKey: string;
    saltIndex: string;
    baseUrl: string;
}

const phonepeConfig: PhonePeConfig = {
    merchantId: process.env.PHONEPE_MERCHANT_ID || '',
    saltKey: process.env.PHONEPE_SALT_KEY || '',
    saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
    baseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://api.phonepe.com/apis/hermes'
        : 'https://api-preprod.phonepe.com/apis/hermes'
};

export const createPhonePeOrder = async (amount: number, orderId: string, redirectUrl: string) => {
    try {
        const payload = {
            merchantId: phonepeConfig.merchantId,
            transactionId: orderId,
            amount: amount * 100,
            mobileNumber: '',
            redirectUrl: redirectUrl,
            successUrl: `${redirectUrl}?status=success`,
            failureUrl: `${redirectUrl}?status=failed`
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const signature = generatePhonePeSignature(base64Payload);

        const response = await axios.post(
            `${phonepeConfig.baseUrl}/pg/v1/pay`,
            {
                request: base64Payload
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': signature
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('PhonePe order creation failed:', error);
        throw new Error('Failed to create PhonePe payment order');
    }
};

export const verifyPhonePePayment = async (transactionId: string) => {
    try {
        const path = `/pg/v1/status/${phonepeConfig.merchantId}/${transactionId}`;
        const signature = generatePhonePeSignature(path);

        const response = await axios.get(
            `${phonepeConfig.baseUrl}${path}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': signature,
                    'X-MERCHANT-ID': phonepeConfig.merchantId
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('PhonePe verification failed:', error);
        throw new Error('Failed to verify PhonePe payment');
    }
};

const generatePhonePeSignature = (payload: string): string => {
    const base64Hash = crypto
        .createHash('sha256')
        .update(payload + phonepeConfig.saltKey)
        .digest('base64');
    
    return `${base64Hash}###${phonepeConfig.saltIndex}`;
};
