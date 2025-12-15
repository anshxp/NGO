import { donateTypeDefs } from './donateTypeDefs';
import { userTypeDefs } from './userTypeDefs';
import { designationTypeDefs } from './designationTypeDefs';
import { volunteerTypeDefs } from './volunteerTypeDefs';
import {
    membershipTypeDefs,
    certificateTypeDefs,
    newsActivityTypeDefs,
    campaignTypeDefs,
    projectTypeDefs,
    eventInternshipTypeDefs,
    enquiryMessageReceiptTypeDefs
} from './allTypeDefs';

export const typeDefs = `
    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }

    ${designationTypeDefs}
    ${userTypeDefs}
    ${donateTypeDefs}
    ${membershipTypeDefs}
    ${certificateTypeDefs}
    ${newsActivityTypeDefs}
    ${campaignTypeDefs}
    ${projectTypeDefs}
    ${eventInternshipTypeDefs}
    ${enquiryMessageReceiptTypeDefs}
    ${volunteerTypeDefs}
`;
