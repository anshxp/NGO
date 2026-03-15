import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const baseURL = process.env.REACT_APP_API_URL || '/api';

const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    register: (data: any) =>
        api.post('/auth/register', data),
    logout: () =>
        api.post('/auth/logout'),
    getCurrentUser: () =>
        api.get('/auth/me')
};

// Membership API
export const membershipAPI = {
    register: (data: any) =>
        api.post('/membership/register', data),
    getMemberships: () =>
        api.get('/membership'),
    getMembershipById: (id: string) =>
        api.get(`/membership/${id}`),
    renewMembership: (id: string) =>
        api.post(`/membership/${id}/renew`)
};

// Donation API
export const donationAPI = {
    getDonations: () =>
        api.get('/donations'),
    createDonation: (data: any) =>
        api.post('/donations', data),
    verifyPayment: (data: any) =>
        api.post('/donations/verify', data),
    getUserDonations: () =>
        api.get('/donations/user/history')
};

// Certificate API
export const certificateAPI = {
    getCertificates: () =>
        api.get('/certificates'),
    getVisitorCertificates: () =>
        api.get('/certificates/visitor'),
    verifyCertificate: (code: string) =>
        api.get(`/certificates/verify/${code}`),
    issueCertificate: (data: any) =>
        api.post('/certificates/issue', data)
};

// News API
export const newsAPI = {
    getAllNews: () =>
        api.get('/news'),
    getNewsBySlug: (slug: string) =>
        api.get(`/news/${slug}`),
    createNews: (data: any) =>
        api.post('/news', data),
    updateNews: (id: string, data: any) =>
        api.put(`/news/${id}`, data),
    publishNews: (id: string) =>
        api.post(`/news/${id}/publish`),
    deleteNews: (id: string) =>
        api.delete(`/news/${id}`)
};

// Activity API
export const activityAPI = {
    getActivities: () =>
        api.get('/activities'),
    getActivityById: (id: string) =>
        api.get(`/activities/${id}`),
    createActivity: (data: any) =>
        api.post('/activities', data),
    likeActivity: (id: string) =>
        api.post(`/activities/${id}/like`),
    commentOnActivity: (id: string, comment: string) =>
        api.post(`/activities/${id}/comment`, { comment }),
    deleteActivity: (id: string) =>
        api.delete(`/activities/${id}`)
};

// Campaign API
export const campaignAPI = {
    getCampaigns: () =>
        api.get('/campaigns'),
    getCampaignById: (id: string) =>
        api.get(`/campaigns/${id}`),
    getActiveCampaigns: () =>
        api.get('/campaigns/active'),
    createCampaign: (data: any) =>
        api.post('/campaigns', data),
    donateToCampaign: (id: string, amount: number) =>
        api.post(`/campaigns/${id}/donate`, { amount })
};

// Project API
export const projectAPI = {
    getProjects: () =>
        api.get('/projects'),
    getProjectById: (id: string) =>
        api.get(`/projects/${id}`),
    createProject: (data: any) =>
        api.post('/projects', data),
    recordExpense: (projectId: string, data: any) =>
        api.post(`/projects/${projectId}/expense`, data),
    getProjectReports: (id: string) =>
        api.get(`/projects/${id}/reports`)
};

// Beneficiary API
export const beneficiaryAPI = {
    getBeneficiaries: () =>
        api.get('/beneficiaries'),
    getBeneficiaryById: (id: string) =>
        api.get(`/beneficiaries/${id}`),
    addBeneficiary: (data: any) =>
        api.post('/beneficiaries', data),
    updateBeneficiary: (id: string, data: any) =>
        api.put(`/beneficiaries/${id}`, data),
    searchBeneficiaries: (query: string) =>
        api.get(`/beneficiaries/search?q=${query}`)
};

// Event API
export const eventAPI = {
    getEvents: () =>
        api.get('/events'),
    getEventById: (id: string) =>
        api.get(`/events/${id}`),
    getUpcomingEvents: () =>
        api.get('/events/upcoming'),
    createEvent: (data: any) =>
        api.post('/events', data),
    registerForEvent: (id: string) =>
        api.post(`/events/${id}/register`)
};

// Internship API
export const internshipAPI = {
    getInternships: () =>
        api.get('/internships'),
    getInternshipById: (id: string) =>
        api.get(`/internships/${id}`),
    createInternship: (data: any) =>
        api.post('/internships', data),
    applyForInternship: (id: string) =>
        api.post(`/internships/${id}/apply`)
};

// Enquiry API
export const enquiryAPI = {
    submitEnquiry: (data: any) =>
        api.post('/enquiries', data),
    getEnquiries: () =>
        api.get('/enquiries'),
    getEnquiryById: (id: string) =>
        api.get(`/enquiries/${id}`),
    replyToEnquiry: (id: string, reply: string) =>
        api.post(`/enquiries/${id}/reply`, { reply })
};

// Message API
export const messageAPI = {
    getMessages: () =>
        api.get('/messages'),
    getMessageById: (id: string) =>
        api.get(`/messages/${id}`),
    sendMessage: (data: any) =>
        api.post('/messages', data),
    scheduleMessage: (data: any) =>
        api.post('/messages/schedule', data)
};

// Receipt API
export const receiptAPI = {
    getReceipts: () =>
        api.get('/receipts'),
    getUserReceipts: () =>
        api.get('/receipts/user'),
    getReceiptsByType: (type: string) =>
        api.get(`/receipts?type=${type}`)
};

// Report API
export const reportAPI = {
    generateMembershipReport: () =>
        api.get('/reports/membership', { responseType: 'blob' }),
    generateDonationReport: () =>
        api.get('/reports/donations', { responseType: 'blob' }),
    generateProjectReport: () =>
        api.get('/reports/projects', { responseType: 'blob' }),
    generateExpenseReport: () =>
        api.get('/reports/expenses', { responseType: 'blob' }),
    generateIncomeVsExpenseReport: () =>
        api.get('/reports/income-expense', { responseType: 'blob' })
};

export default api;
