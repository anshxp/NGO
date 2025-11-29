export const donateTypeDefs = `
    type Donate {
        _id: ID!
        donator: String!
        donatorEmail: String!
        contact: Float!
        address: String
        transactionId: String!
        timestamp: String!
        amount: Float!
        payment_method: String!
        payment_status: String!
        donation_type: String!
        isAnonymous: Boolean!
        referredBy: User
        receiptUrl: String
        orderId: String
        paymentId: String
        signature: String
        created_at: String!
        updated_at: String!
    }

    input CreateDonationInput {
        donator: String!
        donatorEmail: String!
        contact: Float!
        address: String
        amount: Float!
        payment_method: String!
        donation_type: String!
        isAnonymous: Boolean
        referralCode: String
    }

    type DonationStats {
        totalDonations: Float!
        totalAmount: Float!
        pendingAmount: Float!
        successfulDonations: Int!
        failedDonations: Int!
    }

    extend type Query {
        getDonations(limit: Int, offset: Int): [Donate!]!
        getDonation(id: ID!): Donate
        getDonationsByStatus(status: String!): [Donate!]!
        getDonationStats: DonationStats!
        getUserDonations(userId: ID!): [Donate!]!
    }

    extend type Mutation {
        createDonation(input: CreateDonationInput!): Donate!
        createDonationOrder(input: CreateDonationInput!): Donate!
        verifyDonationPayment(orderId: String!, paymentId: String!, signature: String!): Donate!
        updateDonationStatus(id: ID!, status: String!): Donate!
        createCashDonation(input: CreateDonationInput!): Donate!
    }
`;
