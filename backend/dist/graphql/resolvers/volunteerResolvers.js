"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.volunteerResolvers = void 0;
const volunteer_1 = require("../../schema/volunteer");
const generateVolunteerId = () => {
    return `VOL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
exports.volunteerResolvers = {
    Query: {
        getAllVolunteers: async (args, context) => {
            console.log('\n🔵 ===== getAllVolunteers CALLED =====');
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized: Only admins can view volunteers');
            }
            try {
                const volunteers = await volunteer_1.VolunteerModel.find().sort({ created_at: -1 });
                console.log('✅ Retrieved', volunteers.length, 'volunteers');
                return volunteers;
            }
            catch (error) {
                console.error('❌ Error fetching volunteers:', error);
                throw error;
            }
        },
        getVolunteerById: async (args, context) => {
            console.log('\n🔵 ===== getVolunteerById CALLED =====');
            console.log('📦 Volunteer ID:', args.id);
            try {
                const volunteer = await volunteer_1.VolunteerModel.findById(args.id);
                if (!volunteer) {
                    throw new Error('Volunteer not found');
                }
                console.log('✅ Retrieved volunteer:', volunteer.name);
                return volunteer;
            }
            catch (error) {
                console.error('❌ Error fetching volunteer:', error);
                throw error;
            }
        },
        getActiveVolunteers: async (args, context) => {
            console.log('\n🔵 ===== getActiveVolunteers CALLED =====');
            try {
                const volunteers = await volunteer_1.VolunteerModel.find({
                    volunteerStatus: 'active'
                }).sort({ created_at: -1 });
                console.log('✅ Retrieved', volunteers.length, 'active volunteers');
                return volunteers;
            }
            catch (error) {
                console.error('❌ Error fetching active volunteers:', error);
                throw error;
            }
        },
        getVolunteersBySkill: async (args, context) => {
            console.log('\n🔵 ===== getVolunteersBySkill CALLED =====');
            console.log('📦 Skill:', args.skill);
            try {
                const volunteers = await volunteer_1.VolunteerModel.find({
                    skills: args.skill,
                    volunteerStatus: 'active'
                });
                console.log('✅ Retrieved', volunteers.length, 'volunteers with skill:', args.skill);
                return volunteers;
            }
            catch (error) {
                console.error('❌ Error fetching volunteers by skill:', error);
                throw error;
            }
        },
        getVolunteersByAvailability: async (args, context) => {
            console.log('\n🔵 ===== getVolunteersByAvailability CALLED =====');
            console.log('📦 Availability:', args.availability);
            try {
                const volunteers = await volunteer_1.VolunteerModel.find({
                    availability: args.availability,
                    volunteerStatus: 'active'
                });
                console.log('✅ Retrieved', volunteers.length, 'volunteers with availability:', args.availability);
                return volunteers;
            }
            catch (error) {
                console.error('❌ Error fetching volunteers by availability:', error);
                throw error;
            }
        }
    },
    Mutation: {
        registerVolunteer: async (args, context) => {
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
            try {
                const volunteerId = generateVolunteerId();
                const volunteer = new volunteer_1.VolunteerModel({
                    volunteerId,
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
                const savedVolunteer = await volunteer.save();
                console.log('✅ Volunteer registered successfully:', savedVolunteer._id);
                return savedVolunteer;
            }
            catch (error) {
                console.error('❌ Error registering volunteer:', error);
                throw error;
            }
        },
        updateVolunteerStatus: async (args, context) => {
            console.log('\n🔵 ===== updateVolunteerStatus CALLED =====');
            console.log('📦 Volunteer ID:', args.volunteerId);
            console.log('📦 New Status:', args.status);
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized: Only admins can update volunteer status');
            }
            try {
                const volunteer = await volunteer_1.VolunteerModel.findByIdAndUpdate(args.volunteerId, { volunteerStatus: args.status }, { new: true });
                if (!volunteer) {
                    throw new Error('Volunteer not found');
                }
                console.log('✅ Volunteer status updated:', volunteer.name);
                return volunteer;
            }
            catch (error) {
                console.error('❌ Error updating volunteer status:', error);
                throw error;
            }
        },
        updateVolunteerHours: async (args, context) => {
            console.log('\n🔵 ===== updateVolunteerHours CALLED =====');
            console.log('📦 Volunteer ID:', args.volunteerId);
            console.log('📦 Hours:', args.hours);
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized: Only admins can update volunteer hours');
            }
            try {
                const volunteer = await volunteer_1.VolunteerModel.findById(args.volunteerId);
                if (!volunteer) {
                    throw new Error('Volunteer not found');
                }
                volunteer.totalHours += args.hours;
                const updatedVolunteer = await volunteer.save();
                console.log('✅ Volunteer hours updated. Total hours:', updatedVolunteer.totalHours);
                return updatedVolunteer;
            }
            catch (error) {
                console.error('❌ Error updating volunteer hours:', error);
                throw error;
            }
        },
        assignTaskToVolunteer: async (args, context) => {
            console.log('\n🔵 ===== assignTaskToVolunteer CALLED =====');
            console.log('📦 Volunteer ID:', args.volunteerId);
            console.log('📦 Task ID:', args.taskId);
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized: Only admins can assign tasks');
            }
            try {
                const volunteer = await volunteer_1.VolunteerModel.findById(args.volunteerId);
                if (!volunteer) {
                    throw new Error('Volunteer not found');
                }
                if (!volunteer.assignedTasks.includes(args.taskId)) {
                    volunteer.assignedTasks.push(args.taskId);
                }
                const updatedVolunteer = await volunteer.save();
                console.log('✅ Task assigned to volunteer');
                return updatedVolunteer;
            }
            catch (error) {
                console.error('❌ Error assigning task:', error);
                throw error;
            }
        },
        verifyVolunteerBackground: async (args, context) => {
            console.log('\n🔵 ===== verifyVolunteerBackground CALLED =====');
            console.log('📦 Volunteer ID:', args.volunteerId);
            console.log('📦 Verified:', args.verified);
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized: Only admins can verify backgrounds');
            }
            try {
                const volunteer = await volunteer_1.VolunteerModel.findByIdAndUpdate(args.volunteerId, { backgroundVerified: args.verified }, { new: true });
                if (!volunteer) {
                    throw new Error('Volunteer not found');
                }
                console.log('✅ Background verification updated for:', volunteer.name);
                return volunteer;
            }
            catch (error) {
                console.error('❌ Error verifying background:', error);
                throw error;
            }
        },
        deleteVolunteer: async (args, context) => {
            console.log('\n🔵 ===== deleteVolunteer CALLED =====');
            console.log('📦 Volunteer ID:', args.volunteerId);
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized: Only admins can delete volunteers');
            }
            try {
                const volunteer = await volunteer_1.VolunteerModel.findByIdAndDelete(args.volunteerId);
                if (!volunteer) {
                    throw new Error('Volunteer not found');
                }
                console.log('✅ Volunteer deleted:', volunteer.name);
                return `Volunteer ${volunteer.name} has been deleted successfully`;
            }
            catch (error) {
                console.error('❌ Error deleting volunteer:', error);
                throw error;
            }
        }
    }
};
