export interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

// const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:7856';
const baseURL = 'http://127.0.0.1:7856';
const API_URL = `${baseURL}/graphql`;

export async function gql<T>(query: string, variables?: Record<string, any>, token?: string): Promise<T> {
  try {
    console.log('🔵 GraphQL Request:', { query: query.substring(0, 100) + '...', variables });

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ query, variables })
    });

    const json: GraphQLResponse<T> = await res.json();

    if (json.errors && json.errors.length) {
      console.error('🔴 GraphQL Error:', json.errors);
      throw new Error(json.errors[0].message);
    }

    if (!json.data) {
      console.error('🔴 No data returned from GraphQL');
      throw new Error('No data returned');
    }

    console.log('✅ GraphQL Response Success:', json.data);
    return json.data;
  } catch (error: any) {
    console.error('❌ GraphQL Request Failed:', error.message);
    throw error;
  }
}

export const MUTATIONS = {
  CREATE_DONATION_ORDER: `mutation CreateDonationOrder($input: CreateDonationInput!) { createDonationOrder(input: $input) { _id orderId amount donation_type payment_status payment_method donatorEmail } }`,
  VERIFY_DONATION: `mutation VerifyDonation($orderId: String!, $paymentId: String!, $signature: String!) { verifyDonationPayment(orderId: $orderId, paymentId: $paymentId, signature: $signature) { _id payment_status receiptUrl transactionId amount payment_method } }`,
};

export const QUERIES = {
  DONATION_STATS: `query { getDonationStats { totalDonations totalAmount pendingAmount successfulDonations failedDonations } }`,
};
