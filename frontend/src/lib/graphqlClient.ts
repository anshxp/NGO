export interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

const baseURL = import.meta.env.VITE_API_URL || '';
const API_URL = `${baseURL.replace(/\/$/, '')}/graphql`;

export async function gql<T>(query: string, variables?: Record<string, any>, _legacyToken?: string): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });

  let json: GraphQLResponse<T>;
  try {
    json = await res.json();
  } catch (_error) {
    throw new Error('Invalid server response');
  }

  if (!res.ok || (json.errors && json.errors.length)) {
    throw new Error(json.errors?.[0]?.message || 'Request failed');
  }

  if (!json.data) throw new Error('No data returned');
  return json.data;
}

export const MUTATIONS = {
  CREATE_DONATION_ORDER: `mutation CreateDonationOrder($input: CreateDonationInput!) { createDonationOrder(input: $input) { _id orderId amount donation_type payment_status payment_method donatorEmail } }`,
  VERIFY_DONATION: `mutation VerifyDonation($orderId: String!, $paymentId: String!, $signature: String!) { verifyDonationPayment(orderId: $orderId, paymentId: $paymentId, signature: $signature) { _id payment_status receiptUrl transactionId amount payment_method } }`,
};

export const QUERIES = {
  DONATION_STATS: `query { getDonationStats { totalDonations totalAmount pendingAmount successfulDonations failedDonations } }`,
};
