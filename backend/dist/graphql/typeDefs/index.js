"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const donateTypeDefs_1 = require("./donateTypeDefs");
const userTypeDefs_1 = require("./userTypeDefs");
const designationTypeDefs_1 = require("./designationTypeDefs");
const volunteerTypeDefs_1 = require("./volunteerTypeDefs");
const allTypeDefs_1 = require("./allTypeDefs");
exports.typeDefs = `
    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }

    ${designationTypeDefs_1.designationTypeDefs}
    ${userTypeDefs_1.userTypeDefs}
    ${donateTypeDefs_1.donateTypeDefs}
    ${allTypeDefs_1.membershipTypeDefs}
    ${allTypeDefs_1.certificateTypeDefs}
    ${allTypeDefs_1.newsActivityTypeDefs}
    ${allTypeDefs_1.campaignTypeDefs}
    ${allTypeDefs_1.projectTypeDefs}
    ${allTypeDefs_1.eventInternshipTypeDefs}
    ${allTypeDefs_1.enquiryMessageReceiptTypeDefs}
    ${volunteerTypeDefs_1.volunteerTypeDefs}
`;
