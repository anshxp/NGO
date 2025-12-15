import { userResolvers } from './userResolvers';
import { donateResolvers } from './donateResolvers';
import { designationResolvers } from './designationResolvers';
import { membershipResolvers } from './membershipResolvers';
import { certificateResolvers } from './certificateResolvers';
import { newsResolvers, activityResolvers } from './newsResolvers';
import { enquiryResolvers } from './enquiryResolvers';
import { campaignResolvers } from './campaignResolvers';
import { projectResolvers, beneficiaryResolvers } from './projectResolvers';
import { eventResolvers, internshipResolvers } from './eventResolvers';
import { messageResolvers } from './messageResolvers';
import { receiptResolvers } from './receiptResolvers';
import { volunteerResolvers } from './volunteerResolvers';

// For Apollo/GraphQL-tools compatible schema execution
export const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...donateResolvers.Query,
        ...designationResolvers.Query,
        ...membershipResolvers.Query,
        ...certificateResolvers.Query,
        ...newsResolvers.Query,
        ...activityResolvers.Query,
        ...enquiryResolvers.Query,
        ...campaignResolvers.Query,
        ...projectResolvers.Query,
        ...beneficiaryResolvers.Query,
        ...eventResolvers.Query,
        ...internshipResolvers.Query,
        ...messageResolvers.Query,
        ...receiptResolvers.Query,
        ...volunteerResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...donateResolvers.Mutation,
        ...designationResolvers.Mutation,
        ...membershipResolvers.Mutation,
        ...certificateResolvers.Mutation,
        ...newsResolvers.Mutation,
        ...activityResolvers.Mutation,
        ...enquiryResolvers.Mutation,
        ...campaignResolvers.Mutation,
        ...projectResolvers.Mutation,
        ...beneficiaryResolvers.Mutation,
        ...eventResolvers.Mutation,
        ...internshipResolvers.Mutation,
        ...messageResolvers.Mutation,
        ...receiptResolvers.Mutation,
        ...volunteerResolvers.Mutation
    }
};

// For buildSchema + express-graphql compatibility, flatten all resolvers to top-level
export const flattenedResolvers = {
    // Queries
    ...userResolvers.Query,
    ...donateResolvers.Query,
    ...designationResolvers.Query,
    ...membershipResolvers.Query,
    ...certificateResolvers.Query,
    ...newsResolvers.Query,
    ...activityResolvers.Query,
    ...enquiryResolvers.Query,
    ...campaignResolvers.Query,
    ...projectResolvers.Query,
    ...beneficiaryResolvers.Query,
    ...eventResolvers.Query,
    ...internshipResolvers.Query,
    ...messageResolvers.Query,
    ...receiptResolvers.Query,
    ...volunteerResolvers.Query,
    // Mutations
    ...userResolvers.Mutation,
    ...donateResolvers.Mutation,
    ...designationResolvers.Mutation,
    ...membershipResolvers.Mutation,
    ...certificateResolvers.Mutation,
    ...newsResolvers.Mutation,
    ...activityResolvers.Mutation,
    ...enquiryResolvers.Mutation,
    ...campaignResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...beneficiaryResolvers.Mutation,
    ...eventResolvers.Mutation,
    ...internshipResolvers.Mutation,
    ...messageResolvers.Mutation,
    ...receiptResolvers.Mutation,
    ...volunteerResolvers.Mutation
};
