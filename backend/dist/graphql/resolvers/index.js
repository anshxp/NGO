"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const userResolvers_1 = require("./userResolvers");
const donateResolvers_1 = require("./donateResolvers");
const designationResolvers_1 = require("./designationResolvers");
const membershipResolvers_1 = require("./membershipResolvers");
const certificateResolvers_1 = require("./certificateResolvers");
const newsResolvers_1 = require("./newsResolvers");
const enquiryResolvers_1 = require("./enquiryResolvers");
const campaignResolvers_1 = require("./campaignResolvers");
const projectResolvers_1 = require("./projectResolvers");
const eventResolvers_1 = require("./eventResolvers");
const messageResolvers_1 = require("./messageResolvers");
const receiptResolvers_1 = require("./receiptResolvers");
const volunteerResolvers_1 = require("./volunteerResolvers");
exports.resolvers = {
    Query: {
        ...userResolvers_1.userResolvers.Query,
        ...donateResolvers_1.donateResolvers.Query,
        ...designationResolvers_1.designationResolvers.Query,
        ...membershipResolvers_1.membershipResolvers.Query,
        ...certificateResolvers_1.certificateResolvers.Query,
        ...newsResolvers_1.newsResolvers.Query,
        ...newsResolvers_1.activityResolvers.Query,
        ...enquiryResolvers_1.enquiryResolvers.Query,
        ...campaignResolvers_1.campaignResolvers.Query,
        ...projectResolvers_1.projectResolvers.Query,
        ...projectResolvers_1.beneficiaryResolvers.Query,
        ...eventResolvers_1.eventResolvers.Query,
        ...eventResolvers_1.internshipResolvers.Query,
        ...messageResolvers_1.messageResolvers.Query,
        ...receiptResolvers_1.receiptResolvers.Query,
        ...volunteerResolvers_1.volunteerResolvers.Query
    },
    Mutation: {
        ...userResolvers_1.userResolvers.Mutation,
        ...donateResolvers_1.donateResolvers.Mutation,
        ...designationResolvers_1.designationResolvers.Mutation,
        ...membershipResolvers_1.membershipResolvers.Mutation,
        ...certificateResolvers_1.certificateResolvers.Mutation,
        ...newsResolvers_1.newsResolvers.Mutation,
        ...newsResolvers_1.activityResolvers.Mutation,
        ...enquiryResolvers_1.enquiryResolvers.Mutation,
        ...campaignResolvers_1.campaignResolvers.Mutation,
        ...projectResolvers_1.projectResolvers.Mutation,
        ...projectResolvers_1.beneficiaryResolvers.Mutation,
        ...eventResolvers_1.eventResolvers.Mutation,
        ...eventResolvers_1.internshipResolvers.Mutation,
        ...messageResolvers_1.messageResolvers.Mutation,
        ...receiptResolvers_1.receiptResolvers.Mutation,
        ...volunteerResolvers_1.volunteerResolvers.Mutation
    }
};
