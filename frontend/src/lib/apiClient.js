import axios from 'axios';

const normalizeBaseURL = (value) => {
  const configured = String(value || '').trim().replace(/\/+$/, '');
  if (!configured) return '/api';
  return /\/api$/i.test(configured) ? configured : `${configured}/api`;
};

const baseURL = normalizeBaseURL(import.meta.env.VITE_API_URL);
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use((response) => response, (error) => Promise.reject(error));

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const membershipAPI = {
  register: (data) => api.post('/admin/memberships', data),
  getMemberships: () => api.get('/admin/memberships'),
  getMembershipById: (id) => api.get(`/memberships/${id}`),
  renewMembership: (id) => api.post(`/memberships/${id}/renew`),
  suspendMembership: (id) => api.post(`/admin/memberships/${id}/suspend`),
};

export const donationAPI = {
  getDonations: () => api.get('/admin/donations'),
  createDonation: (data) => api.post('/donations', data),
  createOrder: (data) => api.post('/donations/order', data),
  verifyPayment: (data) => api.post('/donations/verify', data),
  getUserDonations: () => api.get('/donations/user/history'),
  getStats: () => api.get('/admin/donations/stats'),
  updateStatus: (id, status) => api.patch(`/admin/donations/${id}/status`, { status }),
};

export const certificateAPI = {
  getCertificates: () => api.get('/admin/certificates'),
  getVisitorCertificates: () => api.get('/admin/certificates?type=visitor'),
  verifyCertificate: (code) => api.get(`/certificates/verify/${encodeURIComponent(code)}`),
  issueCertificate: (data) => api.post('/admin/certificates', data),
  issueVisitorCertificate: (data) => api.post('/admin/certificates/visitor', data),
};

export const newsAPI = {
  getAllNews: () => api.get('/news'),
  getNewsBySlug: (slug) => api.get(`/news/${encodeURIComponent(slug)}`),
  getAdminNews: () => api.get('/admin/news'),
  createNews: (data) => api.post('/admin/news', data),
  updateNews: (id, data) => api.put(`/admin/news/${id}`, data),
  publishNews: (id) => api.post(`/admin/news/${id}/publish`),
  deleteNews: (id) => api.delete(`/admin/news/${id}`),
};

export const activityAPI = {
  getActivities: () => api.get('/activities'),
  getActivityById: (id) => api.get(`/activities/${id}`),
  createActivity: (data) => api.post('/admin/activities', data),
  likeActivity: (id) => api.post(`/activities/${id}/like`),
  commentOnActivity: (id, comment) => api.post(`/activities/${id}/comment`, { comment }),
  deleteActivity: (id) => api.delete(`/admin/activities/${id}`),
};

export const campaignAPI = {
  getCampaigns: () => api.get('/campaigns'),
  getCampaignById: (id) => api.get(`/campaigns/${id}`),
  getActiveCampaigns: () => api.get('/campaigns/active'),
  createCampaign: (data) => api.post('/admin/campaigns', data),
  updateCampaign: (id, data) => api.put(`/admin/campaigns/${id}`, data),
  closeCampaign: (id) => api.post(`/admin/campaigns/${id}/close`),
  donateToCampaign: (id, amount) => api.post(`/campaigns/${id}/donate`, { amount }),
};

export const projectAPI = {
  getProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/admin/projects', data),
  recordExpense: (projectId, data) => api.post(`/admin/projects/${projectId}/expenses`, data),
  getProjectReports: (id) => api.get(`/projects/${id}/reports`),
};

export const beneficiaryAPI = {
  getBeneficiaries: () => api.get('/admin/beneficiaries'),
  getBeneficiaryById: (id) => api.get(`/admin/beneficiaries/${id}`),
  addBeneficiary: (data) => api.post('/admin/beneficiaries', data),
  updateBeneficiary: (id, data) => api.put(`/admin/beneficiaries/${id}`, data),
  searchBeneficiaries: (query) => api.get(`/admin/beneficiaries/search?q=${encodeURIComponent(query)}`),
  addHelpHistory: (id, data) => api.post(`/admin/beneficiaries/${id}/help-history`, data),
};

export const eventAPI = {
  getEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  getUpcomingEvents: () => api.get('/events/upcoming'),
  createEvent: (data) => api.post('/admin/events', data),
  registerForEvent: (id) => api.post(`/events/${id}/register`),
};

export const internshipAPI = {
  getInternships: () => api.get('/internships'),
  getInternshipById: (id) => api.get(`/internships/${id}`),
  createInternship: (data) => api.post('/admin/internships', data),
  applyForInternship: (id) => api.post(`/internships/${id}/apply`),
};

export const enquiryAPI = {
  submitEnquiry: (data) => api.post('/enquiries', data),
  getEnquiries: () => api.get('/admin/enquiries'),
  getEnquiryById: (id) => api.get(`/admin/enquiries/${id}`),
  replyToEnquiry: (id, reply) => api.post(`/admin/enquiries/${id}/reply`, { reply }),
  markAsRead: (id) => api.patch(`/admin/enquiries/${id}`, { status: 'read' }),
  deleteEnquiry: (id) => api.delete(`/admin/enquiries/${id}`),
};

export const messageAPI = {
  getMessages: () => api.get('/admin/messages'),
  getMessageById: (id) => api.get(`/admin/messages/${id}`),
  sendMessage: (data) => api.post('/admin/messages', data),
  scheduleMessage: (data) => api.post('/admin/messages/schedule', data),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),
};

export const receiptAPI = {
  getReceipts: () => api.get('/admin/receipts'),
  getUserReceipts: () => api.get('/receipts/user'),
  getReceiptsByType: (type) => api.get(`/admin/receipts?type=${encodeURIComponent(type)}`),
  createReceipt: (data) => api.post('/admin/receipts', data),
  voidReceipt: (id) => api.post(`/admin/receipts/${id}/void`),
};

export const volunteerAPI = {
  getVolunteers: () => api.get('/admin/volunteers'),
  register: (data) => api.post('/admin/volunteers', data),
  updateStatus: (id, status) => api.patch(`/admin/volunteers/${id}/status`, { status }),
  updateHours: (id, hours) => api.patch(`/admin/volunteers/${id}/hours`, { hours }),
  verifyBackground: (id, verified) => api.patch(`/admin/volunteers/${id}/background`, { verified }),
  assignTask: (id, taskId) => api.post(`/admin/volunteers/${id}/tasks`, { taskId }),
  delete: (id) => api.delete(`/admin/volunteers/${id}`),
};

export const reportAPI = {
  generateMembershipReport: () => api.get('/admin/reports/membership', { responseType: 'blob' }),
  generateDonationReport: () => api.get('/admin/reports/donations', { responseType: 'blob' }),
  generateProjectReport: () => api.get('/admin/reports/projects', { responseType: 'blob' }),
  generateBeneficiaryReport: () => api.get('/admin/reports/beneficiaries', { responseType: 'blob' }),
  generateExpenseReport: () => api.get('/admin/reports/expenses', { responseType: 'blob' }),
  generateIncomeVsExpenseReport: () => api.get('/admin/reports/income-expense', { responseType: 'blob' }),
};

export default api;
