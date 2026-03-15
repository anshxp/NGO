"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenedResolvers = exports.resolvers = void 0;
var userResolvers_1 = require("./userResolvers");
var donateResolvers_1 = require("./donateResolvers");
var designationResolvers_1 = require("./designationResolvers");
var membershipResolvers_1 = require("./membershipResolvers");
var certificateResolvers_1 = require("./certificateResolvers");
var newsResolvers_1 = require("./newsResolvers");
var enquiryResolvers_1 = require("./enquiryResolvers");
var campaignResolvers_1 = require("./campaignResolvers");
var projectResolvers_1 = require("./projectResolvers");
var eventResolvers_1 = require("./eventResolvers");
var messageResolvers_1 = require("./messageResolvers");
var receiptResolvers_1 = require("./receiptResolvers");
var volunteerResolvers_1 = require("./volunteerResolvers");
// For Apollo/GraphQL-tools compatible schema execution
exports.resolvers = {
    Query: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, userResolvers_1.userResolvers.Query), donateResolvers_1.donateResolvers.Query), designationResolvers_1.designationResolvers.Query), membershipResolvers_1.membershipResolvers.Query), certificateResolvers_1.certificateResolvers.Query), newsResolvers_1.newsResolvers.Query), newsResolvers_1.activityResolvers.Query), enquiryResolvers_1.enquiryResolvers.Query), campaignResolvers_1.campaignResolvers.Query), projectResolvers_1.projectResolvers.Query), projectResolvers_1.beneficiaryResolvers.Query), eventResolvers_1.eventResolvers.Query), eventResolvers_1.internshipResolvers.Query), messageResolvers_1.messageResolvers.Query), receiptResolvers_1.receiptResolvers.Query), volunteerResolvers_1.volunteerResolvers.Query),
    Mutation: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, userResolvers_1.userResolvers.Mutation), donateResolvers_1.donateResolvers.Mutation), designationResolvers_1.designationResolvers.Mutation), membershipResolvers_1.membershipResolvers.Mutation), certificateResolvers_1.certificateResolvers.Mutation), newsResolvers_1.newsResolvers.Mutation), newsResolvers_1.activityResolvers.Mutation), enquiryResolvers_1.enquiryResolvers.Mutation), campaignResolvers_1.campaignResolvers.Mutation), projectResolvers_1.projectResolvers.Mutation), projectResolvers_1.beneficiaryResolvers.Mutation), eventResolvers_1.eventResolvers.Mutation), eventResolvers_1.internshipResolvers.Mutation), messageResolvers_1.messageResolvers.Mutation), receiptResolvers_1.receiptResolvers.Mutation), volunteerResolvers_1.volunteerResolvers.Mutation)
};
// For buildSchema + express-graphql compatibility, flatten all resolvers to top-level
exports.flattenedResolvers = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, userResolvers_1.userResolvers.Query), donateResolvers_1.donateResolvers.Query), designationResolvers_1.designationResolvers.Query), membershipResolvers_1.membershipResolvers.Query), certificateResolvers_1.certificateResolvers.Query), newsResolvers_1.newsResolvers.Query), newsResolvers_1.activityResolvers.Query), enquiryResolvers_1.enquiryResolvers.Query), campaignResolvers_1.campaignResolvers.Query), projectResolvers_1.projectResolvers.Query), projectResolvers_1.beneficiaryResolvers.Query), eventResolvers_1.eventResolvers.Query), eventResolvers_1.internshipResolvers.Query), messageResolvers_1.messageResolvers.Query), receiptResolvers_1.receiptResolvers.Query), volunteerResolvers_1.volunteerResolvers.Query), userResolvers_1.userResolvers.Mutation), donateResolvers_1.donateResolvers.Mutation), designationResolvers_1.designationResolvers.Mutation), membershipResolvers_1.membershipResolvers.Mutation), certificateResolvers_1.certificateResolvers.Mutation), newsResolvers_1.newsResolvers.Mutation), newsResolvers_1.activityResolvers.Mutation), enquiryResolvers_1.enquiryResolvers.Mutation), campaignResolvers_1.campaignResolvers.Mutation), projectResolvers_1.projectResolvers.Mutation), projectResolvers_1.beneficiaryResolvers.Mutation), eventResolvers_1.eventResolvers.Mutation), eventResolvers_1.internshipResolvers.Mutation), messageResolvers_1.messageResolvers.Mutation), receiptResolvers_1.receiptResolvers.Mutation), volunteerResolvers_1.volunteerResolvers.Mutation);
