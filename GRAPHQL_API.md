# GraphQL API Reference

Complete GraphQL API documentation for the NGO Management System.

## Base URL

```
POST /graphql
```

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer your-jwt-token
```

## Types

### User
```graphql
type User {
  id: ID!
  email: String!
  name: String!
  phone: String
  address: String
  role: String! # admin, member, volunteer
  membershipId: String
  membershipStatus: String
  createdAt: String!
}

input CreateUserInput {
  email: String!
  password: String!
  name: String!
  phone: String
  address: String
}
```

### Membership
```graphql
type Membership {
  id: ID!
  memberId: String!
  userId: ID!
  designationId: ID!
  membershipStatus: String! # active, suspended, expired
  membershipFee: Float!
  joiningDate: String!
  expiryDate: String
  qrCode: String
  idCardUrl: String
  createdAt: String!
}

type MembershipResponse {
  id: ID!
  memberId: String!
  success: Boolean!
  message: String!
}
```

### Certificate
```graphql
type Certificate {
  id: ID!
  certificateId: String!
  recipientId: ID!
  recipientType: String! # member, visitor
  title: String!
  verificationCode: String!
  qrCode: String
  pdfUrl: String
  isVerified: Boolean!
  createdAt: String!
}

type VisitorCertificate {
  id: ID!
  certificateId: String!
  visitorName: String!
  visitorEmail: String!
  visitorPhone: String!
  certificateTemplate: Int! # 1-6
  verificationCode: String!
  qrCode: String
  pdfUrl: String
  createdAt: String!
}
```

### News
```graphql
type News {
  id: ID!
  title: String!
  slug: String!
  content: String!
  excerpt: String!
  imageUrl: String
  status: String! # draft, published, archived
  views: Int!
  publishedDate: String
  createdAt: String!
  updatedAt: String!
}

type Activity {
  id: ID!
  title: String!
  description: String!
  imageUrls: [String!]
  authorId: ID!
  likes: [ID!]
  comments: [Comment!]
  status: String!
  createdAt: String!
  updatedAt: String!
}

type Comment {
  userId: ID!
  comment: String!
  createdAt: String!
}
```

### Campaign
```graphql
type Campaign {
  id: ID!
  title: String!
  description: String!
  goal: Float!
  raised: Float!
  startDate: String!
  endDate: String!
  status: String! # active, completed, cancelled
  organizerId: ID!
  donors: [Donor!]
  donationCount: Int!
}

type Donor {
  userId: ID!
  amount: Float!
  donatedAt: String!
}
```

### Project
```graphql
type Project {
  id: ID!
  projectId: String!
  title: String!
  description: String!
  objective: String!
  totalBudget: Float!
  fundsReceived: Float!
  expenses: [Expense!]
  status: String! # active, completed, on-hold
  startDate: String!
  endDate: String
  organizerId: ID!
  donors: [String!]
  beneficiaries: [ID!]
  reports: [Report!]
}

type Expense {
  expenseId: String!
  amount: Float!
  category: String!
  description: String!
  projectId: ID!
  approvedBy: ID
  status: String! # pending, approved, rejected
  receiptUrl: String
}

type Report {
  title: String!
  content: String!
  createdAt: String!
}
```

### Event
```graphql
type Event {
  id: ID!
  eventId: String!
  title: String!
  eventDate: String!
  location: String!
  eventType: String! # free, paid
  entryFee: Float
  organizerId: ID!
  registrations: [EventRegistration!]
  registrationCount: Int!
  status: String! # upcoming, ongoing, completed, cancelled
}

type EventRegistration {
  registrationId: String!
  userId: ID!
  registrationDate: String!
  amountPaid: Float
  paymentStatus: String! # pending, completed, cancelled
  receiptUrl: String
}
```

### Internship
```graphql
type Internship {
  id: ID!
  internshipId: String!
  title: String!
  startDate: String!
  endDate: String!
  location: String!
  stipend: Float
  positions: Int!
  postedBy: ID!
  applicants: [ID!]
  selectedInterns: [ID!]
  status: String! # open, applications-closed, completed
}

type InternshipApplication {
  studentId: ID!
  appliedAt: String!
  status: String! # pending, selected, rejected
}
```

### Enquiry
```graphql
type Enquiry {
  id: ID!
  name: String!
  email: String!
  phone: String!
  subject: String!
  message: String!
  status: String! # new, read, replied, closed
  reply: String
  repliedBy: ID
  repliedAt: String
  createdAt: String!
}
```

### Message
```graphql
type Message {
  id: ID!
  messageId: String!
  senderId: ID!
  recipientId: ID
  sendToAll: Boolean!
  title: String!
  content: String!
  imageUrl: String
  status: String! # sent, scheduled, draft
  scheduledFor: String
  readBy: [ID!]
  createdAt: String!
}
```

### Beneficiary
```graphql
type Beneficiary {
  id: ID!
  beneficiaryId: String!
  name: String!
  email: String!
  phone: String!
  address: String!
  age: Int!
  gender: String!
  category: String!
  status: String!
  projects: [ID!]
  helpHistory: [HelpRecord!]
  notes: String
  createdAt: String!
}

type HelpRecord {
  projectId: ID!
  helpType: String!
  description: String!
  date: String!
}
```

### Receipt
```graphql
type Receipt {
  id: ID!
  receiptId: String!
  receiptType: String! # membership, donation, event, cash_donation
  userId: ID!
  referenceId: String!
  amount: Float!
  paymentMethod: String!
  transactionId: String
  date: String!
  pdfUrl: String
  qrCode: String
  status: String!
  createdAt: String!
}
```

## Queries

### Membership

```graphql
query GetMemberships {
  getMemberships {
    id
    memberId
    membershipStatus
    membershipFee
    joiningDate
  }
}

query GetMembershipById($id: ID!) {
  getMembershipById(id: $id) {
    id
    memberId
    membershipStatus
    userId
    designationId
  }
}

query GetMembershipsByStatus($status: String!) {
  getMembershipsByStatus(status: $status) {
    id
    memberId
    membershipStatus
  }
}
```

### Certificates

```graphql
query GetCertificates {
  getCertificates {
    id
    certificateId
    title
    verificationCode
    isVerified
  }
}

query GetVisitorCertificates {
  getVisitorCertificates {
    id
    certificateId
    visitorName
    certificateTemplate
  }
}

query VerifyCertificate($code: String!) {
  verifyCertificate(code: $code) {
    id
    title
    recipientId
    isVerified
  }
}
```

### News

```graphql
query GetAllNews($status: String) {
  getAllNews(status: $status) {
    id
    title
    slug
    excerpt
    imageUrl
    status
    views
    publishedDate
  }
}

query GetNewsBySlug($slug: String!) {
  getNewsBySlug(slug: $slug) {
    id
    title
    content
    imageUrl
    views
  }
}

query GetAdminNews {
  getAdminNews {
    id
    title
    status
    publishedDate
    views
  }
}
```

### Activities

```graphql
query GetActivities {
  getActivities {
    id
    title
    description
    imageUrls
    likes
    comments {
      userId
      comment
      createdAt
    }
    createdAt
  }
}

query GetActivityById($id: ID!) {
  getActivityById(id: $id) {
    id
    title
    description
    authorId
    likes
  }
}
```

### Campaigns

```graphql
query GetCampaigns {
  getCampaigns {
    id
    title
    goal
    raised
    startDate
    endDate
    status
    donationCount
  }
}

query GetCampaignById($id: ID!) {
  getCampaignById(id: $id) {
    id
    title
    description
    goal
    raised
    donors {
      userId
      amount
      donatedAt
    }
  }
}

query GetActiveCampaigns {
  getActiveCampaigns {
    id
    title
    goal
    raised
    endDate
  }
}
```

### Projects

```graphql
query GetProjects {
  getProjects {
    id
    projectId
    title
    totalBudget
    fundsReceived
    status
  }
}

query GetProjectById($id: ID!) {
  getProjectById(id: $id) {
    id
    projectId
    title
    description
    totalBudget
    fundsReceived
    expenses {
      expenseId
      amount
      category
      status
    }
  }
}

query GetProjectReports($projectId: ID!) {
  getProjectReports(projectId: $projectId) {
    title
    content
    createdAt
  }
}
```

### Beneficiaries

```graphql
query GetBeneficiaries {
  getBeneficiaries {
    id
    beneficiaryId
    name
    category
    status
  }
}

query GetBeneficiaryById($id: ID!) {
  getBeneficiaryById(id: $id) {
    id
    name
    email
    phone
    category
    helpHistory {
      projectId
      helpType
      description
      date
    }
  }
}

query SearchBeneficiaries($keyword: String!) {
  searchBeneficiaries(keyword: $keyword) {
    id
    name
    category
  }
}
```

### Events

```graphql
query GetEvents {
  getEvents {
    id
    title
    eventDate
    location
    eventType
    entryFee
    registrationCount
    status
  }
}

query GetEventById($id: ID!) {
  getEventById(id: $id) {
    id
    title
    description
    eventDate
    location
    registrations {
      registrationId
      userId
      registrationDate
    }
  }
}

query GetUpcomingEvents {
  getUpcomingEvents {
    id
    title
    eventDate
    location
  }
}
```

### Internships

```graphql
query GetInternships {
  getInternships {
    id
    internshipId
    title
    startDate
    endDate
    positions
    status
  }
}

query GetInternshipById($id: ID!) {
  getInternshipById(id: $id) {
    id
    title
    location
    stipend
    applicants
    selectedInterns
  }
}
```

### Enquiries

```graphql
query GetEnquiries {
  getEnquiries {
    id
    name
    email
    subject
    status
    createdAt
  }
}

query GetEnquiryById($id: ID!) {
  getEnquiryById(id: $id) {
    id
    name
    email
    phone
    message
    status
    reply
  }
}

query GetNewEnquiries {
  getNewEnquiries {
    id
    name
    subject
    createdAt
  }
}
```

### Messages

```graphql
query GetMessages {
  getMessages {
    id
    messageId
    title
    status
    createdAt
  }
}

query GetMessageById($id: ID!) {
  getMessageById(id: $id) {
    id
    title
    content
    imageUrl
    readBy
  }
}
```

### Receipts

```graphql
query GetReceipts {
  getReceipts {
    id
    receiptId
    receiptType
    amount
    date
  }
}

query GetUserReceipts($userId: ID!) {
  getUserReceipts(userId: $userId) {
    id
    receiptType
    amount
    date
  }
}

query GetReceiptsByType($type: String!) {
  getReceiptsByType(type: $type) {
    id
    receiptId
    amount
    status
  }
}
```

## Mutations

### Membership

```graphql
mutation RegisterMembership(
  $userId: ID!
  $designationId: ID!
  $membershipFee: Float!
) {
  registerMembership(
    userId: $userId
    designationId: $designationId
    membershipFee: $membershipFee
  ) {
    id
    memberId
    success
    message
  }
}

mutation RenewMembership($membershipId: ID!) {
  renewMembership(membershipId: $membershipId) {
    id
    expiryDate
    success
  }
}

mutation SuspendMembership($membershipId: ID!) {
  suspendMembership(membershipId: $membershipId) {
    id
    membershipStatus
    success
  }
}
```

### Certificates

```graphql
mutation IssueCertificate(
  $recipientId: ID!
  $title: String!
) {
  issueCertificate(
    recipientId: $recipientId
    title: $title
  ) {
    id
    certificateId
    success
  }
}

mutation IssueVisitorCertificate(
  $visitorName: String!
  $visitorEmail: String!
  $visitorPhone: String!
  $template: Int!
) {
  issueVisitorCertificate(
    visitorName: $visitorName
    visitorEmail: $visitorEmail
    visitorPhone: $visitorPhone
    certificateTemplate: $template
  ) {
    id
    certificateId
    success
  }
}
```

### News

```graphql
mutation CreateNews(
  $title: String!
  $content: String!
  $excerpt: String!
) {
  createNews(
    title: $title
    content: $content
    excerpt: $excerpt
  ) {
    id
    slug
    success
  }
}

mutation PublishNews($newsId: ID!) {
  publishNews(newsId: $newsId) {
    id
    status
    publishedDate
  }
}

mutation DeleteNews($newsId: ID!) {
  deleteNews(newsId: $newsId) {
    success
    message
  }
}
```

### Activities

```graphql
mutation CreateActivity(
  $title: String!
  $description: String!
) {
  createActivity(
    title: $title
    description: $description
  ) {
    id
    success
  }
}

mutation LikeActivity($activityId: ID!) {
  likeActivity(activityId: $activityId) {
    id
    likes
  }
}

mutation CommentOnActivity(
  $activityId: ID!
  $comment: String!
) {
  commentOnActivity(
    activityId: $activityId
    comment: $comment
  ) {
    id
    comments {
      userId
      comment
    }
  }
}
```

### Campaigns

```graphql
mutation CreateCampaign(
  $title: String!
  $goal: Float!
  $endDate: String!
) {
  createCampaign(
    title: $title
    goal: $goal
    endDate: $endDate
  ) {
    id
    success
  }
}

mutation DonateToCampaign(
  $campaignId: ID!
  $amount: Float!
) {
  donateToCampaign(
    campaignId: $campaignId
    amount: $amount
  ) {
    id
    raised
    success
  }
}

mutation CloseCampaign($campaignId: ID!) {
  closeCampaign(campaignId: $campaignId) {
    id
    status
  }
}
```

### Projects

```graphql
mutation CreateProject(
  $title: String!
  $description: String!
  $totalBudget: Float!
) {
  createProject(
    title: $title
    description: $description
    totalBudget: $totalBudget
  ) {
    id
    projectId
    success
  }
}

mutation RecordExpense(
  $projectId: ID!
  $amount: Float!
  $category: String!
) {
  recordExpense(
    projectId: $projectId
    amount: $amount
    category: $category
  ) {
    id
    success
  }
}

mutation ApproveExpense($expenseId: String!) {
  approveExpense(expenseId: $expenseId) {
    expenseId
    status
  }
}
```

### Beneficiaries

```graphql
mutation AddBeneficiary(
  $name: String!
  $email: String!
  $phone: String!
) {
  addBeneficiary(
    name: $name
    email: $email
    phone: $phone
  ) {
    id
    beneficiaryId
    success
  }
}

mutation AddHelpHistory(
  $beneficiaryId: ID!
  $helpType: String!
  $description: String!
) {
  addHelpHistory(
    beneficiaryId: $beneficiaryId
    helpType: $helpType
    description: $description
  ) {
    id
    success
  }
}
```

### Events

```graphql
mutation CreateEvent(
  $title: String!
  $eventDate: String!
  $location: String!
) {
  createEvent(
    title: $title
    eventDate: $eventDate
    location: $location
  ) {
    id
    eventId
    success
  }
}

mutation RegisterForEvent($eventId: ID!) {
  registerForEvent(eventId: $eventId) {
    id
    success
  }
}
```

### Internships

```graphql
mutation CreateInternship(
  $title: String!
  $startDate: String!
  $positions: Int!
) {
  createInternship(
    title: $title
    startDate: $startDate
    positions: $positions
  ) {
    id
    internshipId
    success
  }
}

mutation ApplyForInternship($internshipId: ID!) {
  applyForInternship(internshipId: $internshipId) {
    id
    success
  }
}

mutation SelectIntern(
  $internshipId: ID!
  $studentId: ID!
) {
  selectIntern(
    internshipId: $internshipId
    studentId: $studentId
  ) {
    id
    success
  }
}
```

### Enquiries

```graphql
mutation SubmitEnquiry(
  $name: String!
  $email: String!
  $phone: String!
  $subject: String!
  $message: String!
) {
  submitEnquiry(
    name: $name
    email: $email
    phone: $phone
    subject: $subject
    message: $message
  ) {
    id
    success
  }
}

mutation ReplyToEnquiry(
  $enquiryId: ID!
  $reply: String!
) {
  replyToEnquiry(
    enquiryId: $enquiryId
    reply: $reply
  ) {
    id
    status
    success
  }
}
```

### Messages

```graphql
mutation SendMessage(
  $title: String!
  $content: String!
  $recipientId: ID
  $sendToAll: Boolean
) {
  sendMessage(
    title: $title
    content: $content
    recipientId: $recipientId
    sendToAll: $sendToAll
  ) {
    id
    messageId
    success
  }
}

mutation ScheduleMessage(
  $title: String!
  $content: String!
  $scheduledFor: String!
) {
  scheduleMessage(
    title: $title
    content: $content
    scheduledFor: $scheduledFor
  ) {
    id
    success
  }
}
```

### Receipts

```graphql
mutation CreateReceipt(
  $receiptType: String!
  $userId: ID!
  $amount: Float!
) {
  createReceipt(
    receiptType: $receiptType
    userId: $userId
    amount: $amount
  ) {
    id
    receiptId
    success
  }
}

mutation VoidReceipt($receiptId: String!) {
  voidReceipt(receiptId: $receiptId) {
    id
    status
  }
}
```

## Error Handling

Standard error response:
```graphql
{
  "errors": [
    {
      "message": "User not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

Common error codes:
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid input
- `INTERNAL_ERROR`: Server error

## Rate Limiting

Recommended rate limits:
- 100 requests/minute for authenticated users
- 10 requests/minute for unauthenticated users

## Pagination

Add pagination to queries:
```graphql
query GetCampaigns($limit: Int, $offset: Int) {
  getCampaigns(limit: $limit, offset: $offset) {
    id
    title
  }
}
```

---

For more information, see README.md and IMPLEMENTATION_GUIDE.md
