/**
 * Temporary compatibility adapter for legacy page calls.
 *
 * The application no longer sends GraphQL requests. This function translates
 * legacy operation names into normal REST requests so the existing UI can be
 * migrated incrementally without a second API stack.
 */
const baseURL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const endpoint = (path: string) => `${baseURL}/api${path}`;

const operationName = (input: string) => {
  const match = input.match(/(?:query|mutation)\s+([A-Za-z0-9_]+)/);
  if (match) return match[1];
  const compact = input.match(/(?:query|mutation)\s*\{\s*([A-Za-z0-9_]+)/);
  return compact?.[1] || input.trim();
};

const request = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(endpoint(path), {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const text = await response.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { throw new Error('Invalid server response'); }
  if (!response.ok) throw new Error(data?.error || 'Request failed');
  return data;
};

const mapOperation = (name: string, variables: Record<string, any>) => {
  switch (name) {
    case 'me': return { method: 'GET', path: '/auth/me' };
    case 'register': return { method: 'POST', path: '/auth/register', body: variables.input || variables };
    case 'login': return { method: 'POST', path: '/auth/login', body: variables.input || variables };
    case 'logout': return { method: 'POST', path: '/auth/logout' };
    case 'getUsers': return { method: 'GET', path: `/admin/users?limit=${variables.limit || 100}&offset=${variables.offset || 0}` };
    case 'getUser': return { method: 'GET', path: `/users/${variables.id}` };
    case 'getAllNews': return { method: 'GET', path: '/news' };
    case 'getNewsBySlug': return { method: 'GET', path: `/news/${encodeURIComponent(variables.slug)}` };
    case 'getAdminNews': return { method: 'GET', path: '/admin/news' };
    case 'getActivities': return { method: 'GET', path: '/activities' };
    case 'getActivityById': return { method: 'GET', path: `/activities/${variables.id}` };
    case 'getCampaigns': return { method: 'GET', path: '/campaigns' };
    case 'getCampaignById': return { method: 'GET', path: `/campaigns/${variables.id}` };
    case 'getActiveCampaigns': return { method: 'GET', path: '/campaigns/active' };
    case 'getProjects': return { method: 'GET', path: '/projects' };
    case 'getProjectById': return { method: 'GET', path: `/projects/${variables.id}` };
    case 'getProjectReports': return { method: 'GET', path: `/projects/${variables.projectId}/reports` };
    case 'getBeneficiaries': return { method: 'GET', path: '/admin/beneficiaries' };
    case 'getBeneficiaryById': return { method: 'GET', path: `/admin/beneficiaries/${variables.id}` };
    case 'searchBeneficiaries': return { method: 'GET', path: `/admin/beneficiaries/search?q=${encodeURIComponent(variables.query || '')}` };
    case 'getEvents': return { method: 'GET', path: '/events' };
    case 'getEventById': return { method: 'GET', path: `/events/${variables.id}` };
    case 'getUpcomingEvents': return { method: 'GET', path: '/events/upcoming' };
    case 'getInternships': return { method: 'GET', path: '/internships' };
    case 'getInternshipById': return { method: 'GET', path: `/internships/${variables.id}` };
    case 'getCertificates': return { method: 'GET', path: '/admin/certificates' };
    case 'getVisitorCertificates': return { method: 'GET', path: '/certificates' };
    case 'verifyCertificate': return { method: 'GET', path: `/certificates/verify/${encodeURIComponent(variables.verificationCode)}` };
    case 'verifyVisitorCertificate': return { method: 'GET', path: `/certificates/verify/${encodeURIComponent(variables.verificationCode)}` };
    case 'getMemberships': return { method: 'GET', path: '/admin/memberships' };
    case 'getMembershipById': return { method: 'GET', path: `/memberships/${variables.id}` };
    case 'getMembershipsByStatus': return { method: 'GET', path: `/admin/memberships?status=${encodeURIComponent(variables.status)}` };
    case 'getDonations': return { method: 'GET', path: `/admin/donations?limit=${variables.limit || 100}&offset=${variables.offset || 0}` };
    case 'getDonation': return { method: 'GET', path: `/admin/donations/${variables.id}` };
    case 'getDonationStats': return { method: 'GET', path: '/admin/donations/stats' };
    case 'getUserDonations': return { method: 'GET', path: '/donations/user/history' };
    case 'getEnquiries': return { method: 'GET', path: '/admin/enquiries' };
    case 'getEnquiryById': return { method: 'GET', path: `/admin/enquiries/${variables.id}` };
    case 'getNewEnquiries': return { method: 'GET', path: '/admin/enquiries?status=new' };
    case 'getMessages': return { method: 'GET', path: '/admin/messages' };
    case 'getMessageById': return { method: 'GET', path: `/admin/messages/${variables.id}` };
    case 'getReceipts': return { method: 'GET', path: '/admin/receipts' };
    case 'getUserReceipts': return { method: 'GET', path: '/receipts/user' };
    case 'getReceiptsByType': return { method: 'GET', path: `/admin/receipts?type=${encodeURIComponent(variables.type)}` };
    case 'getAllVolunteers': return { method: 'GET', path: '/admin/volunteers' };
    case 'getActiveVolunteers': return { method: 'GET', path: '/admin/volunteers?status=active' };
    case 'getVolunteersBySkill': return { method: 'GET', path: `/admin/volunteers?skill=${encodeURIComponent(variables.skill)}` };
    case 'getVolunteersByAvailability': return { method: 'GET', path: `/admin/volunteers?availability=${encodeURIComponent(variables.availability)}` };
    case 'submitEnquiry': return { method: 'POST', path: '/enquiries', body: variables };
    case 'createDonation': return { method: 'POST', path: '/donations', body: variables.input || variables };
    case 'createDonationOrder': return { method: 'POST', path: '/donations/order', body: variables.input || variables };
    case 'verifyDonationPayment': return { method: 'POST', path: '/donations/verify', body: variables };
    case 'createCashDonation': return { method: 'POST', path: '/admin/donations/cash', body: variables.input || variables };
    case 'updateDonationStatus': return { method: 'PATCH', path: `/admin/donations/${variables.id}/status`, body: { status: variables.status } };
    case 'registerMembership': return { method: 'POST', path: '/admin/memberships', body: variables };
    case 'renewMembership': return { method: 'POST', path: `/memberships/${variables.membershipId}/renew` };
    case 'suspendMembership': return { method: 'POST', path: `/admin/memberships/${variables.membershipId}/suspend` };
    case 'createNews': return { method: 'POST', path: '/admin/news', body: variables };
    case 'updateNews': return { method: 'PUT', path: `/admin/news/${variables.id}`, body: variables };
    case 'publishNews': return { method: 'POST', path: `/admin/news/${variables.id}/publish` };
    case 'deleteNews': return { method: 'DELETE', path: `/admin/news/${variables.id}` };
    case 'createProject': return { method: 'POST', path: '/admin/projects', body: variables };
    case 'addBeneficiary': return { method: 'POST', path: '/admin/beneficiaries', body: variables };
    case 'updateBeneficiary': return { method: 'PUT', path: `/admin/beneficiaries/${variables.id}`, body: variables };
    case 'recordExpense': return { method: 'POST', path: `/admin/projects/${variables.projectId}/expenses`, body: variables };
    case 'approveExpense': return { method: 'POST', path: `/admin/expenses/${variables.expenseId}/approve` };
    case 'addBeneficiaryToProject': return { method: 'POST', path: `/admin/projects/${variables.projectId}/beneficiaries`, body: { beneficiaryId: variables.beneficiaryId } };
    case 'addHelpHistory': return { method: 'POST', path: `/admin/beneficiaries/${variables.beneficiaryId}/help-history`, body: variables };
    case 'createActivity': return { method: 'POST', path: '/admin/activities', body: variables };
    case 'likeActivity': return { method: 'POST', path: `/activities/${variables.activityId}/like` };
    case 'commentOnActivity': return { method: 'POST', path: `/activities/${variables.activityId}/comment`, body: { comment: variables.comment } };
    case 'deleteActivity': return { method: 'DELETE', path: `/admin/activities/${variables.id}` };
    case 'createCampaign': return { method: 'POST', path: '/admin/campaigns', body: variables };
    case 'updateCampaign': return { method: 'PUT', path: `/admin/campaigns/${variables.id}`, body: variables };
    case 'closeCampaign': return { method: 'POST', path: `/admin/campaigns/${variables.id}/close` };
    case 'donateToCampaign': return { method: 'POST', path: `/campaigns/${variables.campaignId}/donate`, body: { amount: variables.amount } };
    case 'createEvent': return { method: 'POST', path: '/admin/events', body: variables };
    case 'registerForEvent': return { method: 'POST', path: `/events/${variables.eventId}/register` };
    case 'createInternship': return { method: 'POST', path: '/admin/internships', body: variables };
    case 'applyForInternship': return { method: 'POST', path: `/internships/${variables.internshipId}/apply` };
    case 'sendMessage': return { method: 'POST', path: '/admin/messages', body: variables };
    case 'scheduleMessage': return { method: 'POST', path: '/admin/messages/schedule', body: variables };
    case 'deleteMessage': return { method: 'DELETE', path: `/admin/messages/${variables.id}` };
    case 'replyToEnquiry': return { method: 'POST', path: `/admin/enquiries/${variables.id}/reply`, body: { reply: variables.reply } };
    case 'markEnquiryAsRead': return { method: 'PATCH', path: `/admin/enquiries/${variables.id}`, body: { status: 'read' } };
    case 'deleteEnquiry': return { method: 'DELETE', path: `/admin/enquiries/${variables.id}` };
    case 'createReceipt': return { method: 'POST', path: '/admin/receipts', body: variables };
    case 'voidReceipt': return { method: 'POST', path: `/admin/receipts/${variables.id}/void` };
    case 'issueCertificate': return { method: 'POST', path: '/admin/certificates', body: variables };
    case 'issueVisitorCertificate': return { method: 'POST', path: '/admin/certificates/visitor', body: variables };
    case 'registerVolunteer': return { method: 'POST', path: '/admin/volunteers', body: variables };
    case 'updateVolunteerStatus': return { method: 'PATCH', path: `/admin/volunteers/${variables.volunteerId}/status`, body: { status: variables.status } };
    case 'updateVolunteerHours': return { method: 'PATCH', path: `/admin/volunteers/${variables.volunteerId}/hours`, body: { hours: variables.hours } };
    case 'assignTaskToVolunteer': return { method: 'POST', path: `/admin/volunteers/${variables.volunteerId}/tasks`, body: { taskId: variables.taskId } };
    case 'verifyVolunteerBackground': return { method: 'PATCH', path: `/admin/volunteers/${variables.volunteerId}/background`, body: { verified: variables.verified } };
    case 'deleteVolunteer': return { method: 'DELETE', path: `/admin/volunteers/${variables.volunteerId}` };
    default: throw new Error(`Unsupported REST operation: ${name}`);
  }
};

export async function gql<T>(query: string, variables: Record<string, any> = {}, _legacyToken?: string): Promise<T> {
  const name = operationName(query);
  const mapped = mapOperation(name, variables);
  const data = await request(mapped.path, { method: mapped.method, body: mapped.body === undefined ? undefined : JSON.stringify(mapped.body) });

  const resultMap: Record<string, string> = {
    me: 'user', getUsers: 'users', getUser: 'user', getAllNews: 'getAllNews', getNewsBySlug: 'getNewsBySlug',
    getActivities: 'getActivities', getActivityById: 'getActivityById', getCampaigns: 'getCampaigns', getCampaignById: 'getCampaignById', getActiveCampaigns: 'getActiveCampaigns',
    getProjects: 'getProjects', getProjectById: 'getProjectById', getBeneficiaries: 'getBeneficiaries', getBeneficiaryById: 'getBeneficiaryById', searchBeneficiaries: 'searchBeneficiaries',
    getEvents: 'getEvents', getEventById: 'getEventById', getUpcomingEvents: 'getUpcomingEvents', getInternships: 'getInternships', getInternshipById: 'getInternshipById',
    getCertificates: 'getCertificates', getVisitorCertificates: 'getVisitorCertificates', verifyCertificate: 'verifyCertificate', verifyVisitorCertificate: 'verifyVisitorCertificate',
    getMemberships: 'getMemberships', getMembershipById: 'getMembershipById', getMembershipsByStatus: 'getMembershipsByStatus',
    getDonations: 'getDonations', getDonation: 'getDonation', getDonationStats: 'getDonationStats', getUserDonations: 'getUserDonations',
    getEnquiries: 'getEnquiries', getEnquiryById: 'getEnquiryById', getNewEnquiries: 'getNewEnquiries', getMessages: 'getMessages', getMessageById: 'getMessageById',
    getReceipts: 'getReceipts', getUserReceipts: 'getUserReceipts', getReceiptsByType: 'getReceiptsByType', getAllVolunteers: 'getAllVolunteers', getActiveVolunteers: 'getActiveVolunteers',
    login: 'login', register: 'register', createDonationOrder: 'createDonationOrder', verifyDonationPayment: 'verifyDonationPayment'
  };
  const key = resultMap[name];
  if (key && data && Object.prototype.hasOwnProperty.call(data, key)) return { [key]: data[key] } as T;
  if (name === 'login' || name === 'register') return data as T;
  if (name === 'getDonationStats') return { getDonationStats: data } as T;
  if (Array.isArray(data)) return { [key || name]: data } as T;
  if (data?.success !== undefined) return { [name]: data } as T;
  return { [name]: data } as T;
}

export const MUTATIONS = {
  CREATE_DONATION_ORDER: 'createDonationOrder',
  VERIFY_DONATION: 'verifyDonationPayment'
};

export const QUERIES = { DONATION_STATS: 'getDonationStats' };
