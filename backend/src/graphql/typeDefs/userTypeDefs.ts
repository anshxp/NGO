export const userTypeDefs = `
    type User {
        _id: ID!
        name: String!
        email: String!
        phone: String!
        role: String!
        designation: Designation
        dateOfBirth: String
        address: String
        membershipId: String
        membershipStatus: String!
        membershipFee: Float
        membershipPaidDate: String
        referralCode: String!
        referredBy: User
        totalReferrals: Int!
        totalDonationsReferred: Float!
        idCardUrl: String
        certificateUrl: String
        appointmentLetterUrl: String
        isEmailVerified: Boolean!
        lastLogin: String
        created_at: String!
        updated_at: String!
    }

    type MembershipPaymentOrder {
        orderId: String!
        amount: Float!
        currency: String!
        membershipFee: Float!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    input RegisterInput {
        name: String!
        email: String!
        password: String!
        phone: String!
        designation: ID
        dateOfBirth: String
        address: String
        referralCode: String
    }

    input LoginInput {
        email: String!
        password: String!
    }

    type Query {
        getUsers(limit: Int, offset: Int): [User!]!
        getUser(id: ID!): User
        getUserByReferralCode(referralCode: String!): User
        me: User
    }

    type Mutation {
        register(input: RegisterInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!
        updateMembershipStatus(userId: ID!, status: String!): User!
        generateMembershipId(userId: ID!): User!
        payMembershipFee(designationId: ID): MembershipPaymentOrder!
        verifyMembershipPayment(orderId: String!, paymentId: String!, signature: String!): User!
    }
`;
