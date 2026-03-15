"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
var donateTypeDefs_1 = require("./donateTypeDefs");
var userTypeDefs_1 = require("./userTypeDefs");
var designationTypeDefs_1 = require("./designationTypeDefs");
var volunteerTypeDefs_1 = require("./volunteerTypeDefs");
var allTypeDefs_1 = require("./allTypeDefs");
exports.typeDefs = "\n    type Query {\n        _empty: String\n    }\n\n    type Mutation {\n        _empty: String\n    }\n\n    " + designationTypeDefs_1.designationTypeDefs + "\n    " + userTypeDefs_1.userTypeDefs + "\n    " + donateTypeDefs_1.donateTypeDefs + "\n    " + allTypeDefs_1.membershipTypeDefs + "\n    " + allTypeDefs_1.certificateTypeDefs + "\n    " + allTypeDefs_1.newsActivityTypeDefs + "\n    " + allTypeDefs_1.campaignTypeDefs + "\n    " + allTypeDefs_1.projectTypeDefs + "\n    " + allTypeDefs_1.eventInternshipTypeDefs + "\n    " + allTypeDefs_1.enquiryMessageReceiptTypeDefs + "\n    " + volunteerTypeDefs_1.volunteerTypeDefs + "\n";
