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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internshipResolvers = exports.eventResolvers = void 0;
var event_1 = require("../../schema/event");
var eventRegistration_1 = require("../../schema/eventRegistration");
var internship_1 = require("../../schema/internship");
var email_1 = require("../../utils/email");
exports.eventResolvers = {
    Query: {
        getEvents: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, event_1.EventModel.find({ status: { $ne: 'cancelled' } })
                            .populate('organizer')
                            .sort({ eventDate: -1 })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        getEventById: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, event_1.EventModel.findById(args.id)
                            .populate('organizer')
                            .populate('registrations')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        getUpcomingEvents: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, event_1.EventModel.find({ status: 'upcoming' })
                            .populate('organizer')
                            .sort({ eventDate: 1 })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }
    },
    Mutation: {
        createEvent: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var eventId, event_2, savedEvent, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        eventId = "EVT-" + Date.now();
                        event_2 = new event_1.EventModel({
                            eventId: eventId,
                            title: args.title,
                            description: args.description,
                            eventDate: args.eventDate,
                            eventEndDate: args.eventEndDate,
                            location: args.location,
                            eventType: args.eventType,
                            entryFee: args.entryFee,
                            imageUrl: args.imageUrl,
                            organizer: context.userId,
                            status: 'upcoming'
                        });
                        return [4 /*yield*/, event_2.save()];
                    case 2:
                        savedEvent = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, savedEvent.toObject()), { success: true })];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error("Event creation failed: " + error_1.message);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        registerForEvent: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var event_3, registrationId, registration, user, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user)
                            throw new Error('Authentication required');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, event_1.EventModel.findById(args.eventId)];
                    case 2:
                        event_3 = _a.sent();
                        if (!event_3)
                            throw new Error('Event not found');
                        if (event_3.registrations.includes(context.userId)) {
                            throw new Error('Already registered for this event');
                        }
                        registrationId = "REG-" + Date.now();
                        registration = new eventRegistration_1.EventRegistrationModel({
                            registrationId: registrationId,
                            eventId: args.eventId,
                            userId: context.userId,
                            amountPaid: event_3.eventType === 'paid' ? event_3.entryFee : 0,
                            paymentStatus: event_3.eventType === 'paid' ? 'pending' : 'completed'
                        });
                        return [4 /*yield*/, registration.save()];
                    case 3:
                        _a.sent();
                        event_3.registrations.push(context.userId);
                        event_3.registrationCount = (event_3.registrationCount || 0) + 1;
                        return [4 /*yield*/, event_3.save()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, require('../../schema/user').UserModel.findById(context.userId)];
                    case 5:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 7];
                        return [4 /*yield*/, email_1.sendEventRegistrationEmail({
                                email: user.email,
                                name: user.name,
                                eventTitle: event_3.title,
                                eventDate: event_3.eventDate.toLocaleString(),
                                eventLocation: event_3.location
                            })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, __assign(__assign({}, registration.toObject()), { success: true })];
                    case 8:
                        error_2 = _a.sent();
                        throw new Error("Registration failed: " + error_2.message);
                    case 9: return [2 /*return*/];
                }
            });
        }); }
    }
};
exports.internshipResolvers = {
    Query: {
        getInternships: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, internship_1.InternshipModel.find({ status: { $ne: 'completed' } })
                            .populate('postedBy')
                            .sort({ startDate: -1 })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        getInternshipById: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, internship_1.InternshipModel.findById(args.id)
                            .populate('postedBy')
                            .populate('applicants')
                            .populate('selectedInterns')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }
    },
    Mutation: {
        createInternship: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var internshipId, internship, savedInternship, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        internshipId = "INT-" + Date.now();
                        internship = new internship_1.InternshipModel({
                            internshipId: internshipId,
                            title: args.title,
                            description: args.description,
                            startDate: args.startDate,
                            endDate: args.endDate,
                            location: args.location,
                            stipend: args.stipend,
                            positions: args.positions,
                            postedBy: context.userId,
                            status: 'open'
                        });
                        return [4 /*yield*/, internship.save()];
                    case 2:
                        savedInternship = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, savedInternship.toObject()), { success: true })];
                    case 3:
                        error_3 = _a.sent();
                        throw new Error("Internship creation failed: " + error_3.message);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        applyForInternship: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var internship, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user)
                            throw new Error('Authentication required');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, internship_1.InternshipModel.findById(args.internshipId)];
                    case 2:
                        internship = _a.sent();
                        if (!internship)
                            throw new Error('Internship not found');
                        if (internship.applicants.includes(context.userId)) {
                            throw new Error('Already applied for this internship');
                        }
                        internship.applicants.push(context.userId);
                        return [4 /*yield*/, internship.save()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, internship.toObject()), { success: true })];
                    case 4:
                        error_4 = _a.sent();
                        throw new Error("Application failed: " + error_4.message);
                    case 5: return [2 /*return*/];
                }
            });
        }); },
        selectIntern: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var internship, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, internship_1.InternshipModel.findById(args.internshipId)];
                    case 2:
                        internship = _a.sent();
                        if (!internship)
                            throw new Error('Internship not found');
                        if (!internship.selectedInterns.includes(args.userId)) {
                            internship.selectedInterns.push(args.userId);
                        }
                        return [4 /*yield*/, internship.save()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, internship.toObject()), { success: true })];
                    case 4:
                        error_5 = _a.sent();
                        throw new Error("Selection failed: " + error_5.message);
                    case 5: return [2 /*return*/];
                }
            });
        }); }
    }
};
