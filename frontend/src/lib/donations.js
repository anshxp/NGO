import { donationAPI } from './apiClient';

export async function createDonationOrder(input) {
  const response = await donationAPI.createOrder(input);
  return response.data;
}

export async function verifyDonationPayment(orderId, paymentId, signature) {
  const response = await donationAPI.verifyPayment({ orderId, paymentId, signature });
  return response.data;
}

export async function getDonations() {
  const response = await donationAPI.getDonations();
  return response.data;
}

export async function getDonationStats() {
  const response = await donationAPI.getStats();
  return response.data;
}

export async function getUserDonations() {
  const response = await donationAPI.getUserDonations();
  return response.data;
}
