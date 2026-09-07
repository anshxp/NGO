/**
 * REST API client for the NGO application.
 * Authentication is cookie-based; credentials are never persisted in browser storage.
 */
const baseURL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const endpoint = (path: string) => `${baseURL}/api${path}`;

export async function apiRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(endpoint(path), { ...options, credentials: 'include', headers });
  const text = await response.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { throw new Error('Invalid server response'); }
  if (!response.ok) throw new Error(data?.error || data?.message || 'Request failed');
  return data as T;
}

export const get = <T = any>(path: string) => apiRequest<T>(path);
export const post = <T = any>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });
export const put = <T = any>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) });
export const patch = <T = any>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'PATCH', body: body === undefined ? undefined : JSON.stringify(body) });
export const del = <T = any>(path: string) => apiRequest<T>(path, { method: 'DELETE' });

export const authApi = {
  me: () => get('/auth/me'),
  login: (body: unknown) => post('/auth/login', body),
  register: (body: unknown) => post('/auth/register', body),
  logout: () => post('/auth/logout'),
};

export const publicApi = {
  news: () => get('/news'),
  newsBySlug: (slug: string) => get(`/news/${encodeURIComponent(slug)}`),
  activities: () => get('/activities'),
  activity: (id: string) => get(`/activities/${id}`),
  campaigns: () => get('/campaigns'),
  campaign: (id: string) => get(`/campaigns/${id}`),
  activeCampaigns: () => get('/campaigns/active'),
  projects: () => get('/projects'),
  project: (id: string) => get(`/projects/${id}`),
  events: () => get('/events'),
  event: (id: string) => get(`/events/${id}`),
  upcomingEvents: () => get('/events/upcoming'),
  internships: () => get('/internships'),
  internship: (id: string) => get(`/internships/${id}`),
  certificates: () => get('/certificates'),
  verifyCertificate: (code: string) => get(`/certificates/verify/${encodeURIComponent(code)}`),
  submitEnquiry: (body: unknown) => post('/enquiries', body),
};

export const userApi = {
  donations: () => get('/donations/user/history'),
  receipts: () => get('/receipts/user'),
  membership: (id: string) => get(`/memberships/${id}`),
  renewMembership: (id: string) => post(`/memberships/${id}/renew`),
  eventRegistration: (id: string) => post(`/events/${id}/register`),
  internshipApplication: (id: string, body?: unknown) => post(`/internships/${id}/apply`, body),
  likeActivity: (id: string) => post(`/activities/${id}/like`),
  commentActivity: (id: string, comment: string) => post(`/activities/${id}/comment`, { comment }),
};

export const donationApi = {
  create: (body: unknown) => post('/donations', body),
  createOrder: (body: unknown) => post('/donations/order', body),
  verifyPayment: (body: unknown) => post('/donations/verify', body),
};

export const adminApi = {
  users: (limit = 100, offset = 0) => get(`/admin/users?limit=${limit}&offset=${offset}`),
  user: (id: string) => get(`/users/${id}`),
  news: () => get('/admin/news'),
  campaigns: () => get('/admin/campaigns'),
  projects: () => get('/admin/projects'),
  beneficiaries: () => get('/admin/beneficiaries'),
  beneficiary: (id: string) => get(`/admin/beneficiaries/${id}`),
  searchBeneficiaries: (q: string) => get(`/admin/beneficiaries/search?q=${encodeURIComponent(q)}`),
  events: () => get('/admin/events'),
  internships: () => get('/admin/internships'),
  certificates: () => get('/admin/certificates'),
  memberships: (query = '') => get(`/admin/memberships${query ? `?${query}` : ''}`),
  donations: (limit = 100, offset = 0) => get(`/admin/donations?limit=${limit}&offset=${offset}`),
  donation: (id: string) => get(`/admin/donations/${id}`),
  donationStats: () => get('/admin/donations/stats'),
  enquiries: (query = '') => get(`/admin/enquiries${query ? `?${query}` : ''}`),
  enquiry: (id: string) => get(`/admin/enquiries/${id}`),
  messages: () => get('/admin/messages'),
  message: (id: string) => get(`/admin/messages/${id}`),
  receipts: (query = '') => get(`/admin/receipts${query ? `?${query}` : ''}`),
  volunteers: (query = '') => get(`/admin/volunteers${query ? `?${query}` : ''}`),
  reports: (type: string) => get(`/admin/reports/${encodeURIComponent(type)}`),
};
