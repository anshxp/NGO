import { graphqlRequest, getAuthToken } from './api';

export interface Donation {
    _id: string;
    donator: string;
    donatorEmail: string;
    contact: number;
    address?: string;
    transactionId: string;
    timestamp: string;
    amount: number;
    payment_method: string;
    payment_status: string;
    donation_type: string;
    isAnonymous: boolean;
    receiptUrl?: string;
    orderId?: string;
    paymentId?: string;
    created_at: string;
    updated_at: string;
}

export interface DonationStats {
    totalDonations: number;
    totalAmount: number;
    pendingAmount: number;
    successfulDonations: number;
    failedDonations: number;
}

export interface CreateDonationInput {
    donator: string;
    donatorEmail: string;
    contact: number;
    address?: string;
    amount: number;
    payment_method: string;
    donation_type: string;
    isAnonymous?: boolean;
    referralCode?: string;
}

export async function createDonationOrder(input: CreateDonationInput): Promise<Donation> {
    const query = `
        mutation CreateDonationOrder($input: CreateDonationInput!) {
            createDonationOrder(input: $input) {
                _id
                donator
                donatorEmail
                transactionId
                amount
                payment_method
                donation_type
                orderId
                payment_status
            }
        }
    `;

    const data = await graphqlRequest<{ createDonationOrder: Donation }>(query, { input });
    return data.createDonationOrder;
}

export async function verifyDonationPayment(
    orderId: string,
    paymentId: string,
    signature: string
): Promise<Donation> {
    const query = `
        mutation VerifyDonationPayment($orderId: String!, $paymentId: String!, $signature: String!) {
            verifyDonationPayment(orderId: $orderId, paymentId: $paymentId, signature: $signature) {
                _id
                donator
                donatorEmail
                amount
                payment_status
                receiptUrl
                transactionId
            }
        }
    `;

    const data = await graphqlRequest<{ verifyDonationPayment: Donation }>(query, {
        orderId,
        paymentId,
        signature,
    });
    return data.verifyDonationPayment;
}

export async function getDonations(limit = 10, offset = 0): Promise<Donation[]> {
    const query = `
        query GetDonations($limit: Int, $offset: Int) {
            getDonations(limit: $limit, offset: $offset) {
                _id
                donator
                donatorEmail
                amount
                donation_type
                payment_status
                timestamp
                transactionId
                receiptUrl
            }
        }
    `;

    const token = getAuthToken();
    const data = await graphqlRequest<{ getDonations: Donation[] }>(query, { limit, offset }, token || undefined);
    return data.getDonations;
}

export async function getDonationStats(): Promise<DonationStats> {
    const query = `
        query GetDonationStats {
            getDonationStats {
                totalDonations
                totalAmount
                pendingAmount
                successfulDonations
                failedDonations
            }
        }
    `;

    const token = getAuthToken();
    const data = await graphqlRequest<{ getDonationStats: DonationStats }>(query, {}, token || undefined);
    return data.getDonationStats;
}

export async function getUserDonations(userId: string): Promise<Donation[]> {
    const query = `
        query GetUserDonations($userId: ID!) {
            getUserDonations(userId: $userId) {
                _id
                donator
                amount
                donation_type
                payment_status
                timestamp
                receiptUrl
            }
        }
    `;

    const token = getAuthToken();
    const data = await graphqlRequest<{ getUserDonations: Donation[] }>(query, { userId }, token || undefined);
    return data.getUserDonations;
}
