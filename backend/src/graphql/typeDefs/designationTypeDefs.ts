export const designationTypeDefs = `
    type Designation {
        _id: ID!
        name: String!
        code: String!
        fee: Float!
        description: String
        created_at: String!
        updated_at: String!
    }

    input CreateDesignationInput {
        name: String!
        code: String!
        fee: Float!
        description: String
    }

    input UpdateDesignationInput {
        name: String
        code: String
        fee: Float
        description: String
    }

    extend type Query {
        getDesignations(limit: Int, offset: Int): [Designation!]!
        getDesignation(id: ID!): Designation
    }

    extend type Mutation {
        createDesignation(input: CreateDesignationInput!): Designation!
        updateDesignation(id: ID!, input: UpdateDesignationInput!): Designation!
        deleteDesignation(id: ID!): Boolean!
    }
`;
