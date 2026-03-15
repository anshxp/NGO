import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { gql } from '@/lib/graphqlClient';

interface Volunteer {
    _id: string;
    volunteerId: string;
    name: string;
    email: string;
    phone: string;
    skills: string[];
    availability: string;
    volunteerStatus: string;
    totalHours: number;
    backgroundVerified: boolean;
    joiningDate: string;
}

export default function AdminVolunteers() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        dateOfBirth: '',
        gender: 'male',
        education: '',
        skills: '',
        experience: '',
        areaOfInterest: '',
        availability: 'flexible',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: ''
    });

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            setLoading(true);
            const query = `
                query {
                    getAllVolunteers {
                        _id
                        volunteerId
                        name
                        email
                        phone
                        skills
                        availability
                        volunteerStatus
                        totalHours
                        backgroundVerified
                        joiningDate
                    }
                }
            `;
            const result: any = await gql(query);
            console.log('📝 Volunteers fetched:', result.data.getAllVolunteers);
            setVolunteers(result.data.getAllVolunteers);
        } catch (error) {
            console.error('❌ Error fetching volunteers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('📝 Submitting volunteer registration:', formData);
            
            const mutation = `
                mutation RegisterVolunteer(
                    $name: String!
                    $email: String!
                    $phone: String!
                    $address: String!
                    $city: String!
                    $state: String!
                    $pincode: String!
                    $dateOfBirth: String!
                    $gender: String!
                    $education: String
                    $skills: [String!]!
                    $experience: String
                    $areaOfInterest: [String!]!
                    $availability: String!
                    $emergencyContactName: String!
                    $emergencyContactPhone: String!
                    $emergencyContactRelationship: String!
                ) {
                    registerVolunteer(
                        name: $name
                        email: $email
                        phone: $phone
                        address: $address
                        city: $city
                        state: $state
                        pincode: $pincode
                        dateOfBirth: $dateOfBirth
                        gender: $gender
                        education: $education
                        skills: $skills
                        experience: $experience
                        areaOfInterest: $areaOfInterest
                        availability: $availability
                        emergencyContactName: $emergencyContactName
                        emergencyContactPhone: $emergencyContactPhone
                        emergencyContactRelationship: $emergencyContactRelationship
                    ) {
                        _id
                        volunteerId
                        name
                        email
                        volunteerStatus
                    }
                }
            `;

            const variables = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                education: formData.education,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                experience: formData.experience,
                areaOfInterest: formData.areaOfInterest.split(',').map(s => s.trim()).filter(s => s),
                availability: formData.availability,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone,
                emergencyContactRelationship: formData.emergencyContactRelationship
            };

            const result: any = await gql(mutation, variables);
            console.log('✅ Volunteer registered successfully:', result.data.registerVolunteer);
            
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                dateOfBirth: '',
                gender: 'male',
                education: '',
                skills: '',
                experience: '',
                areaOfInterest: '',
                availability: 'flexible',
                emergencyContactName: '',
                emergencyContactPhone: '',
                emergencyContactRelationship: ''
            });
            setShowForm(false);
            fetchVolunteers();
        } catch (error) {
            console.error('❌ Error registering volunteer:', error);
        }
    };

    const handleStatusChange = async (volunteerId: string, newStatus: string) => {
        try {
            const mutation = `
                mutation UpdateVolunteerStatus($volunteerId: String!, $status: String!) {
                    updateVolunteerStatus(volunteerId: $volunteerId, status: $status) {
                        _id
                        volunteerStatus
                    }
                }
            `;
            
            await gql(mutation, { volunteerId, status: newStatus });
            console.log('✅ Volunteer status updated');
            fetchVolunteers();
        } catch (error) {
            console.error('❌ Error updating status:', error);
        }
    };

    if (loading) {
        return <div className="p-6">Loading volunteers...</div>;
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Volunteer Management</h1>
                    <p className="text-gray-600">Register and manage volunteers</p>
                </div>
                <Button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : 'Register Volunteer'}
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Register New Volunteer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    required
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    className="px-3 py-2 border rounded-lg col-span-2"
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="Pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    required
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="px-3 py-2 border rounded-lg"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                <input
                                    type="text"
                                    name="education"
                                    placeholder="Education"
                                    value={formData.education}
                                    onChange={handleInputChange}
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    name="skills"
                                    placeholder="Skills (comma-separated)"
                                    value={formData.skills}
                                    onChange={handleInputChange}
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    name="areaOfInterest"
                                    placeholder="Areas of Interest (comma-separated)"
                                    value={formData.areaOfInterest}
                                    onChange={handleInputChange}
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleInputChange}
                                    className="px-3 py-2 border rounded-lg"
                                >
                                    <option value="fulltime">Full-time</option>
                                    <option value="parttime">Part-time</option>
                                    <option value="weekends">Weekends Only</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>
                            
                            <textarea
                                name="experience"
                                placeholder="Work Experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={3}
                            />

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Emergency Contact</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        name="emergencyContactName"
                                        placeholder="Contact Name"
                                        value={formData.emergencyContactName}
                                        onChange={handleInputChange}
                                        required
                                        className="px-3 py-2 border rounded-lg"
                                    />
                                    <input
                                        type="tel"
                                        name="emergencyContactPhone"
                                        placeholder="Contact Phone"
                                        value={formData.emergencyContactPhone}
                                        onChange={handleInputChange}
                                        required
                                        className="px-3 py-2 border rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        name="emergencyContactRelationship"
                                        placeholder="Relationship"
                                        value={formData.emergencyContactRelationship}
                                        onChange={handleInputChange}
                                        required
                                        className="px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                Register Volunteer
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {volunteers.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-gray-600">No volunteers registered yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    volunteers.map(volunteer => (
                        <Card key={volunteer._id}>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-4 gap-4 items-center">
                                    <div>
                                        <p className="font-semibold">{volunteer.name}</p>
                                        <p className="text-sm text-gray-600">{volunteer.volunteerId}</p>
                                        <p className="text-sm text-gray-600">{volunteer.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm"><strong>Phone:</strong> {volunteer.phone}</p>
                                        <p className="text-sm"><strong>Hours:</strong> {volunteer.totalHours}</p>
                                        <p className="text-sm"><strong>Since:</strong> {new Date(volunteer.joiningDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm"><strong>Skills:</strong> {volunteer.skills.join(', ') || 'N/A'}</p>
                                        <p className="text-sm"><strong>Availability:</strong> {volunteer.availability}</p>
                                        <p className="text-sm"><strong>Verified:</strong> {volunteer.backgroundVerified ? '✅ Yes' : '❌ No'}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <select
                                            value={volunteer.volunteerStatus}
                                            onChange={(e) => handleStatusChange(volunteer._id, e.target.value)}
                                            className="px-2 py-1 border rounded text-sm"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="suspended">Suspended</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <span className={`text-xs px-2 py-1 rounded text-center ${
                                            volunteer.volunteerStatus === 'active' ? 'bg-green-100 text-green-700' :
                                            volunteer.volunteerStatus === 'inactive' ? 'bg-gray-100 text-gray-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {volunteer.volunteerStatus.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
            </div>
        </AdminLayout>
    );
}
