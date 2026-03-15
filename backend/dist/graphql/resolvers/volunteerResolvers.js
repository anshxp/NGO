"use strict";
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
exports.volunteerResolvers = void 0;
var volunteer_1 = require("../../schema/volunteer");
var generateVolunteerId = function () {
    return "VOL-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};
exports.volunteerResolvers = {
    Query: {
        getAllVolunteers: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteers, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== getAllVolunteers CALLED =====');
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized: Only admins can view volunteers');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, volunteer_1.VolunteerModel.find().sort({ created_at: -1 })];
                    case 2:
                        volunteers = _a.sent();
                        console.log('✅ Retrieved', volunteers.length, 'volunteers');
                        return [2 /*return*/, volunteers];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ Error fetching volunteers:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        getVolunteerById: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteer, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== getVolunteerById CALLED =====');
                        console.log('📦 Volunteer ID:', args.id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, volunteer_1.VolunteerModel.findById(args.id)];
                    case 2:
                        volunteer = _a.sent();
                        if (!volunteer) {
                            throw new Error('Volunteer not found');
                        }
                        console.log('✅ Retrieved volunteer:', volunteer.name);
                        return [2 /*return*/, volunteer];
                    case 3:
                        error_2 = _a.sent();
                        console.error('❌ Error fetching volunteer:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        getActiveVolunteers: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteers, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== getActiveVolunteers CALLED =====');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, volunteer_1.VolunteerModel.find({
                                volunteerStatus: 'active'
                            }).sort({ created_at: -1 })];
                    case 2:
                        volunteers = _a.sent();
                        console.log('✅ Retrieved', volunteers.length, 'active volunteers');
                        return [2 /*return*/, volunteers];
                    case 3:
                        error_3 = _a.sent();
                        console.error('❌ Error fetching active volunteers:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        getVolunteersBySkill: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteers, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== getVolunteersBySkill CALLED =====');
                        console.log('📦 Skill:', args.skill);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, volunteer_1.VolunteerModel.find({
                                skills: args.skill,
                                volunteerStatus: 'active'
                            })];
                    case 2:
                        volunteers = _a.sent();
                        console.log('✅ Retrieved', volunteers.length, 'volunteers with skill:', args.skill);
                        return [2 /*return*/, volunteers];
                    case 3:
                        error_4 = _a.sent();
                        console.error('❌ Error fetching volunteers by skill:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        getVolunteersByAvailability: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteers, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== getVolunteersByAvailability CALLED =====');
                        console.log('📦 Availability:', args.availability);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, volunteer_1.VolunteerModel.find({
                                availability: args.availability,
                                volunteerStatus: 'active'
                            })];
                    case 2:
                        volunteers = _a.sent();
                        console.log('✅ Retrieved', volunteers.length, 'volunteers with availability:', args.availability);
                        return [2 /*return*/, volunteers];
                    case 3:
                        error_5 = _a.sent();
                        console.error('❌ Error fetching volunteers by availability:', error_5);
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        }); }
    },
    Mutation: {
        registerVolunteer: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteerId, volunteer, savedVolunteer, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== registerVolunteer CALLED =====');
                        console.log('📝 Volunteer data:', {
                            name: args.name,
                            email: args.email,
                            phone: args.phone,
                            skills: args.skills,
                            areaOfInterest: args.areaOfInterest
                        });
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized: Only admins can register volunteers');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        volunteerId = generateVolunteerId();
                        volunteer = new volunteer_1.VolunteerModel({
                            volunteerId: volunteerId,
                            name: args.name,
                            email: args.email,
                            phone: args.phone,
                            address: args.address,
                            city: args.city,
                            state: args.state,
                            pincode: args.pincode,
                            dateOfBirth: new Date(args.dateOfBirth),
                            gender: args.gender,
                            education: args.education,
                            skills: args.skills || [],
                            experience: args.experience,
                            areaOfInterest: args.areaOfInterest || [],
                            availability: args.availability,
                            emergencyContact: {
                                name: args.emergencyContactName,
                                phone: args.emergencyContactPhone,
                                relationship: args.emergencyContactRelationship
                            },
                            volunteerStatus: 'active',
                            joiningDate: new Date(),
                            totalHours: 0,
                            backgroundVerified: false
                        });
                        console.log('💾 Saving volunteer to database...');
                        return [4 /*yield*/, volunteer.save()];
                    case 2:
                        savedVolunteer = _a.sent();
                        console.log('✅ Volunteer registered successfully:', savedVolunteer._id);
                        return [2 /*return*/, savedVolunteer];
                    case 3:
                        error_6 = _a.sent();
                        console.error('❌ Error registering volunteer:', error_6);
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        updateVolunteerStatus: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteer, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== updateVolunteerStatus CALLED =====');
                        console.log('📦 Volunteer ID:', args.volunteerId);
                        console.log('📦 New Status:', args.status);
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized: Only admins can update volunteer status');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, volunteer_1.VolunteerModel.findByIdAndUpdate(args.volunteerId, { volunteerStatus: args.status }, { new: true })];
                    case 2:
                        volunteer = _a.sent();
                        if (!volunteer) {
                            throw new Error('Volunteer not found');
                        }
                        console.log('✅ Volunteer status updated:', volunteer.name);
                        return [2 /*return*/, volunteer];
                    case 3:
                        error_7 = _a.sent();
                        console.error('❌ Error updating volunteer status:', error_7);
                        throw error_7;
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        updateVolunteerHours: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteer, updatedVolunteer, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== updateVolunteerHours CALLED =====');
                        console.log('📦 Volunteer ID:', args.volunteerId);
                        console.log('📦 Hours:', args.hours);
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized: Only admins can update volunteer hours');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, volunteer_1.VolunteerModel.findById(args.volunteerId)];
                    case 2:
                        volunteer = _a.sent();
                        if (!volunteer) {
                            throw new Error('Volunteer not found');
                        }
                        volunteer.totalHours += args.hours;
                        return [4 /*yield*/, volunteer.save()];
                    case 3:
                        updatedVolunteer = _a.sent();
                        console.log('✅ Volunteer hours updated. Total hours:', updatedVolunteer.totalHours);
                        return [2 /*return*/, updatedVolunteer];
                    case 4:
                        error_8 = _a.sent();
                        console.error('❌ Error updating volunteer hours:', error_8);
                        throw error_8;
                    case 5: return [2 /*return*/];
                }
            });
        }); },
        assignTaskToVolunteer: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteer, updatedVolunteer, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== assignTaskToVolunteer CALLED =====');
                        console.log('📦 Volunteer ID:', args.volunteerId);
                        console.log('📦 Task ID:', args.taskId);
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized: Only admins can assign tasks');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, volunteer_1.VolunteerModel.findById(args.volunteerId)];
                    case 2:
                        volunteer = _a.sent();
                        if (!volunteer) {
                            throw new Error('Volunteer not found');
                        }
                        if (!volunteer.assignedTasks.includes(args.taskId)) {
                            volunteer.assignedTasks.push(args.taskId);
                        }
                        return [4 /*yield*/, volunteer.save()];
                    case 3:
                        updatedVolunteer = _a.sent();
                        console.log('✅ Task assigned to volunteer');
                        return [2 /*return*/, updatedVolunteer];
                    case 4:
                        error_9 = _a.sent();
                        console.error('❌ Error assigning task:', error_9);
                        throw error_9;
                    case 5: return [2 /*return*/];
                }
            });
        }); },
        verifyVolunteerBackground: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteer, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== verifyVolunteerBackground CALLED =====');
                        console.log('📦 Volunteer ID:', args.volunteerId);
                        console.log('📦 Verified:', args.verified);
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized: Only admins can verify backgrounds');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, volunteer_1.VolunteerModel.findByIdAndUpdate(args.volunteerId, { backgroundVerified: args.verified }, { new: true })];
                    case 2:
                        volunteer = _a.sent();
                        if (!volunteer) {
                            throw new Error('Volunteer not found');
                        }
                        console.log('✅ Background verification updated for:', volunteer.name);
                        return [2 /*return*/, volunteer];
                    case 3:
                        error_10 = _a.sent();
                        console.error('❌ Error verifying background:', error_10);
                        throw error_10;
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        deleteVolunteer: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var volunteer, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== deleteVolunteer CALLED =====');
                        console.log('📦 Volunteer ID:', args.volunteerId);
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized: Only admins can delete volunteers');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, volunteer_1.VolunteerModel.findByIdAndDelete(args.volunteerId)];
                    case 2:
                        volunteer = _a.sent();
                        if (!volunteer) {
                            throw new Error('Volunteer not found');
                        }
                        console.log('✅ Volunteer deleted:', volunteer.name);
                        return [2 /*return*/, "Volunteer " + volunteer.name + " has been deleted successfully"];
                    case 3:
                        error_11 = _a.sent();
                        console.error('❌ Error deleting volunteer:', error_11);
                        throw error_11;
                    case 4: return [2 /*return*/];
                }
            });
        }); }
    }
};
