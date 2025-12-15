export const volunteerTypeDefs = `
    type Volunteer {
        _id: String!
        volunteerId: String!
        userId: String
        name: String!
        email: String!
        phone: String!
        address: String!
        city: String!
        state: String!
        pincode: String!
        dateOfBirth: String!
        gender: String!
        education: String
        skills: [String!]!
        experience: String
        areaOfInterest: [String!]!
        availability: String!
        volunteerStatus: String!
        joiningDate: String!
        totalHours: Int!
        assignedTasks: [String!]!
        certifications: [String!]!
        backgroundVerified: Boolean!
        emergencyContact: EmergencyContact
        created_at: String!
        updated_at: String!
    }

    type EmergencyContact {
        name: String!
        phone: String!
        relationship: String!
    }

    extend type Query {
        getAllVolunteers: [Volunteer!]!
        getVolunteerById(id: String!): Volunteer
        getActiveVolunteers: [Volunteer!]!
        getVolunteersBySkill(skill: String!): [Volunteer!]!
        getVolunteersByAvailability(availability: String!): [Volunteer!]!
    }

    extend type Mutation {
        registerVolunteer(
            name: String!
            email: String!
            phone: String!
            address: String!
            city: String!
            state: String!
            pincode: String!
            dateOfBirth: String!
            gender: String!
            education: String
            skills: [String!]!
            experience: String
            areaOfInterest: [String!]!
            availability: String!
            emergencyContactName: String!
            emergencyContactPhone: String!
            emergencyContactRelationship: String!
        ): Volunteer!

        updateVolunteerStatus(
            volunteerId: String!
            status: String!
        ): Volunteer!

        updateVolunteerHours(
            volunteerId: String!
            hours: Int!
        ): Volunteer!

        assignTaskToVolunteer(
            volunteerId: String!
            taskId: String!
        ): Volunteer!

        verifyVolunteerBackground(
            volunteerId: String!
            verified: Boolean!
        ): Volunteer!

        deleteVolunteer(
            volunteerId: String!
        ): String!
    }
`;
