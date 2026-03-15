import { EventModel } from '../../schema/event';
import { EventRegistrationModel } from '../../schema/eventRegistration';
import { InternshipModel } from '../../schema/internship';
import { sendEventRegistrationEmail } from '../../utils/email';

export const eventResolvers = {
    Query: {
        getEvents: async (args: any, context: any) => {
            return await EventModel.find({ status: { $ne: 'cancelled' } })
                .populate('organizer')
                .sort({ eventDate: -1 });
        },
        getEventById: async (args: any, context: any) => {
            return await EventModel.findById(args.id)
                .populate('organizer')
                .populate('registrations');
        },
        getUpcomingEvents: async (args: any, context: any) => {
            return await EventModel.find({ status: 'upcoming' })
                .populate('organizer')
                .sort({ eventDate: 1 });
        }
    },
    Mutation: {
        createEvent: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            try {
                const eventId = `EVT-${Date.now()}`;
                const event = new EventModel({
                    eventId,
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

                const savedEvent = await event.save();
                return { ...savedEvent.toObject(), success: true };
            } catch (error) {
                throw new Error(`Event creation failed: ${error.message}`);
            }
        },

        registerForEvent: async (args: any, context: any) => {
            if (!context.user) throw new Error('Authentication required');

            try {
                const event = await EventModel.findById(args.eventId);
                if (!event) throw new Error('Event not found');

                if (event.registrations.includes(context.userId)) {
                    throw new Error('Already registered for this event');
                }

                const registrationId = `REG-${Date.now()}`;
                const registration = new EventRegistrationModel({
                    registrationId,
                    eventId: args.eventId,
                    userId: context.userId,
                    amountPaid: event.eventType === 'paid' ? event.entryFee : 0,
                    paymentStatus: event.eventType === 'paid' ? 'pending' : 'completed'
                });

                await registration.save();

                event.registrations.push(context.userId);
                event.registrationCount = (event.registrationCount || 0) + 1;
                await event.save();

                // Send registration email
                const user = await require('../../schema/user').UserModel.findById(context.userId);
                if (user) {
                    await sendEventRegistrationEmail({
                        email: user.email,
                        name: user.name,
                        eventTitle: event.title,
                        eventDate: event.eventDate.toLocaleString(),
                        eventLocation: event.location
                    });
                }

                return { ...registration.toObject(), success: true };
            } catch (error) {
                throw new Error(`Registration failed: ${error.message}`);
            }
        }
    }
};

export const internshipResolvers = {
    Query: {
        getInternships: async (args: any, context: any) => {
            return await InternshipModel.find({ status: { $ne: 'completed' } })
                .populate('postedBy')
                .sort({ startDate: -1 });
        },
        getInternshipById: async (args: any, context: any) => {
            return await InternshipModel.findById(args.id)
                .populate('postedBy')
                .populate('applicants')
                .populate('selectedInterns');
        }
    },
    Mutation: {
        createInternship: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            try {
                const internshipId = `INT-${Date.now()}`;
                const internship = new InternshipModel({
                    internshipId,
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

                const savedInternship = await internship.save();
                return { ...savedInternship.toObject(), success: true };
            } catch (error) {
                throw new Error(`Internship creation failed: ${error.message}`);
            }
        },

        applyForInternship: async (args: any, context: any) => {
            if (!context.user) throw new Error('Authentication required');

            try {
                const internship = await InternshipModel.findById(args.internshipId);
                if (!internship) throw new Error('Internship not found');

                if (internship.applicants.includes(context.userId)) {
                    throw new Error('Already applied for this internship');
                }

                internship.applicants.push(context.userId);
                await internship.save();

                return { ...internship.toObject(), success: true };
            } catch (error) {
                throw new Error(`Application failed: ${error.message}`);
            }
        },

        selectIntern: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            try {
                const internship = await InternshipModel.findById(args.internshipId);
                if (!internship) throw new Error('Internship not found');

                if (!internship.selectedInterns.includes(args.userId)) {
                    internship.selectedInterns.push(args.userId);
                }

                await internship.save();
                return { ...internship.toObject(), success: true };
            } catch (error) {
                throw new Error(`Selection failed: ${error.message}`);
            }
        }
    }
};
