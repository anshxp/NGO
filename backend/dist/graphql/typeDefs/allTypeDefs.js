"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryMessageReceiptTypeDefs = exports.eventInternshipTypeDefs = exports.projectTypeDefs = exports.campaignTypeDefs = exports.newsActivityTypeDefs = exports.certificateTypeDefs = exports.membershipTypeDefs = void 0;
exports.membershipTypeDefs = `
    type Membership {
        id: String!
        memberId: String!
        userId: String!
        designationId: String!
        membershipStatus: String!
        joiningDate: String!
        expiryDate: String
        membershipFee: Float!
        receiptUrl: String
        idCardUrl: String
        appointmentLetterUrl: String
        qrCode: String
        renewalDate: String
        created_at: String!
        updated_at: String!
    }

    type MembershipResponse {
        id: String
        memberId: String
        success: Boolean!
        message: String
    }

    extend type Query {
        getMemberships: [Membership!]!
        getMembershipById(id: String!): Membership
        getMembershipsByStatus(status: String!): [Membership!]!
    }

    extend type Mutation {
        registerMembership(
            userId: String!
            designationId: String!
            membershipFee: Float!
            designationName: String
        ): MembershipResponse!
        
        renewMembership(membershipId: String!): MembershipResponse!
        suspendMembership(membershipId: String!): MembershipResponse!
    }
`;
exports.certificateTypeDefs = `
    type Certificate {
        id: String!
        certificateId: String!
        recipientId: String!
        recipientType: String!
        recipientName: String!
        recipientEmail: String!
        title: String!
        description: String
        issueDate: String!
        certificateUrl: String
        pdfUrl: String
        qrCode: String
        verificationCode: String!
        isVerified: Boolean!
    }

    type VisitorCertificate {
        id: String!
        certificateId: String!
        visitorName: String!
        visitorEmail: String!
        visitorPhone: String!
        certificateTemplate: Int!
        title: String!
        description: String
        issueDate: String!
        pdfUrl: String
        qrCode: String
        verificationCode: String!
        isVerified: Boolean!
    }

    type CertificateResponse {
        id: String
        success: Boolean!
        message: String
    }

    extend type Query {
        getCertificates: [Certificate!]!
        getVisitorCertificates: [VisitorCertificate!]!
        verifyCertificate(verificationCode: String!): Certificate
        verifyVisitorCertificate(verificationCode: String!): VisitorCertificate
    }

    extend type Mutation {
        issueCertificate(
            recipientId: String!
            title: String!
            description: String
            recipientEmail: String!
            recipientName: String!
        ): CertificateResponse!
        
        issueVisitorCertificate(
            visitorName: String!
            visitorEmail: String!
            visitorPhone: String!
            title: String!
            description: String
            template: Int!
        ): CertificateResponse!
    }
`;
exports.newsActivityTypeDefs = `
    type News {
        id: String!
        title: String!
        slug: String!
        content: String!
        excerpt: String
        imageUrl: String
        authorId: String!
        status: String!
        views: Int!
        publishedDate: String
        created_at: String!
        updated_at: String!
    }

    type Activity {
        id: String!
        title: String!
        description: String!
        imageUrls: [String!]!
        authorId: String!
        likes: [String!]!
        comments: [Comment!]!
        status: String!
        created_at: String!
        updated_at: String!
    }

    type Comment {
        userId: String!
        comment: String!
        createdAt: String!
    }

    type NewsActivityResponse {
        id: String
        success: Boolean!
        message: String
    }

    extend type Query {
        getAllNews: [News!]!
        getNewsBySlug(slug: String!): News
        getAdminNews: [News!]!
        getActivities: [Activity!]!
        getActivityById(id: String!): Activity
    }

    extend type Mutation {
        createNews(
            title: String!
            content: String!
            excerpt: String
            imageUrl: String
        ): NewsActivityResponse!
        
        updateNews(
            id: String!
            title: String!
            content: String!
            excerpt: String
            imageUrl: String
            status: String
        ): NewsActivityResponse!
        
        publishNews(id: String!): NewsActivityResponse!
        deleteNews(id: String!): NewsActivityResponse!
        
        createActivity(
            title: String!
            description: String!
            imageUrls: [String!]
        ): NewsActivityResponse!
        
        likeActivity(activityId: String!): NewsActivityResponse!
        commentOnActivity(activityId: String!, comment: String!): NewsActivityResponse!
        deleteActivity(id: String!): NewsActivityResponse!
    }
`;
exports.campaignTypeDefs = `
    type Campaign {
        id: String!
        title: String!
        description: String!
        goal: Float!
        raised: Float!
        startDate: String!
        endDate: String!
        imageUrl: String
        status: String!
        organizer: String!
        donors: [String!]!
        donationCount: Int!
    }

    type CampaignResponse {
        id: String
        success: Boolean!
        message: String
    }

    extend type Query {
        getCampaigns: [Campaign!]!
        getCampaignById(id: String!): Campaign
        getActiveCampaigns: [Campaign!]!
    }

    extend type Mutation {
        createCampaign(
            title: String!
            description: String!
            goal: Float!
            endDate: String!
            imageUrl: String
        ): CampaignResponse!
        
        donateToCampaign(campaignId: String!, amount: Float!): CampaignResponse!
        updateCampaign(id: String!, title: String, description: String, status: String): CampaignResponse!
        closeCampaign(id: String!): CampaignResponse!
    }
`;
exports.projectTypeDefs = `
    type Project {
        id: String!
        projectId: String!
        title: String!
        description: String!
        objective: String
        totalBudget: Float!
        fundsReceived: Float!
        expenses: Float!
        status: String!
        startDate: String!
        endDate: String
        imageUrl: String
        organizer: String!
        donors: [String!]!
        beneficiaries: [String!]!
    }

    type Expense {
        id: String!
        expenseId: String!
        amount: Float!
        category: String!
        description: String!
        date: String!
        status: String!
        receiptUrl: String
    }

    type Beneficiary {
        id: String!
        beneficiaryId: String!
        name: String!
        email: String
        phone: String
        address: String!
        age: Int
        gender: String
        category: String!
        status: String!
        projects: [String!]!
    }

    type ProjectResponse {
        id: String
        success: Boolean!
        message: String
    }

    extend type Query {
        getProjects: [Project!]!
        getProjectById(id: String!): Project
        getProjectReports(projectId: String!): [String!]!
        getBeneficiaries: [Beneficiary!]!
        getBeneficiaryById(id: String!): Beneficiary
        searchBeneficiaries(query: String!): [Beneficiary!]!
    }

    extend type Mutation {
        createProject(
            title: String!
            description: String!
            objective: String
            totalBudget: Float!
            endDate: String
            imageUrl: String
        ): ProjectResponse!
        
        addBeneficiaryToProject(projectId: String!, beneficiaryId: String!): ProjectResponse!
        recordExpense(projectId: String!, amount: Float!, category: String!, description: String!): ProjectResponse!
        approveExpense(expenseId: String!): ProjectResponse!
        
        addBeneficiary(
            name: String!
            email: String
            phone: String
            address: String!
            age: Int
            gender: String
            category: String!
        ): ProjectResponse!
        
        updateBeneficiary(
            id: String!
            name: String
            email: String
            phone: String
            address: String
            status: String
        ): ProjectResponse!
        
        addHelpHistory(
            beneficiaryId: String!
            projectId: String!
            helpType: String!
            description: String!
        ): ProjectResponse!
    }
`;
exports.eventInternshipTypeDefs = `
    type Event {
        id: String!
        eventId: String!
        title: String!
        description: String!
        eventDate: String!
        eventEndDate: String
        location: String!
        eventType: String!
        entryFee: Float
        imageUrl: String
        organizer: String!
        registrations: [String!]!
        registrationCount: Int!
        status: String!
    }

    type Internship {
        id: String!
        internshipId: String!
        title: String!
        description: String!
        startDate: String!
        endDate: String!
        location: String!
        stipend: Float
        positions: Int!
        postedBy: String!
        applicants: [String!]!
        selectedInterns: [String!]!
        status: String!
    }

    type EventInternshipResponse {
        id: String
        success: Boolean!
        message: String
    }

    extend type Query {
        getEvents: [Event!]!
        getEventById(id: String!): Event
        getUpcomingEvents: [Event!]!
        getInternships: [Internship!]!
        getInternshipById(id: String!): Internship
    }

    extend type Mutation {
        createEvent(
            title: String!
            description: String!
            eventDate: String!
            eventEndDate: String
            location: String!
            eventType: String!
            entryFee: Float
            imageUrl: String
        ): EventInternshipResponse!
        
        registerForEvent(eventId: String!): EventInternshipResponse!
        
        createInternship(
            title: String!
            description: String!
            startDate: String!
            endDate: String!
            location: String!
            stipend: Float
            positions: Int!
        ): EventInternshipResponse!
        
        applyForInternship(internshipId: String!): EventInternshipResponse!
        selectIntern(internshipId: String!, userId: String!): EventInternshipResponse!
    }
`;
exports.enquiryMessageReceiptTypeDefs = `
    type Enquiry {
        id: String!
        name: String!
        email: String!
        phone: String!
        subject: String!
        message: String!
        status: String!
        reply: String
        repliedBy: String
        repliedAt: String
        created_at: String!
        updated_at: String!
    }

    type Message {
        id: String!
        messageId: String!
        senderId: String!
        recipientId: String
        sendToAll: Boolean!
        title: String!
        content: String!
        imageUrl: String
        sentDate: String!
        readBy: [String!]!
        status: String!
        scheduledFor: String
    }

    type Receipt {
        id: String!
        receiptId: String!
        receiptType: String!
        userId: String!
        referenceId: String!
        amount: Float!
        paymentMethod: String!
        transactionId: String
        date: String!
        pdfUrl: String
        qrCode: String
        status: String!
    }

    type Response {
        success: Boolean!
        message: String
    }

    extend type Query {
        getEnquiries: [Enquiry!]!
        getEnquiryById(id: String!): Enquiry
        getNewEnquiries: [Enquiry!]!
        getMessages: [Message!]!
        getMessageById(id: String!): Message
        getReceipts: [Receipt!]!
        getUserReceipts: [Receipt!]!
        getReceiptsByType(type: String!): [Receipt!]!
    }

    extend type Mutation {
        submitEnquiry(
            name: String!
            email: String!
            phone: String!
            subject: String!
            message: String!
        ): Response!
        
        markEnquiryAsRead(id: String!): Response!
        replyToEnquiry(id: String!, reply: String!): Response!
        deleteEnquiry(id: String!): Response!
        
        sendMessage(
            recipientId: String
            sendToAll: Boolean
            title: String!
            content: String!
            imageUrl: String
        ): Response!
        
        scheduleMessage(
            recipientId: String
            sendToAll: Boolean
            title: String!
            content: String!
            imageUrl: String
            scheduledFor: String!
        ): Response!
        
        deleteMessage(id: String!): Response!
        
        createReceipt(
            receiptType: String!
            referenceId: String!
            amount: Float!
            paymentMethod: String!
            transactionId: String
            pdfUrl: String
            qrCode: String
        ): Response!
        
        voidReceipt(id: String!): Response!
    }
`;
