import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { volunteerAPI } from '@/lib/apiClient';

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

const initialForm = {
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
    dateOfBirth: '', gender: 'male', education: '', skills: '', experience: '',
    areaOfInterest: '', availability: 'flexible', emergencyContactName: '',
    emergencyContactPhone: '', emergencyContactRelationship: ''
};

export default function AdminVolunteers() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(initialForm);

    const fetchVolunteers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await volunteerAPI.getVolunteers();
            const volunteersData = response.data?.volunteers ?? response.data?.data ?? response.data ?? [];
            setVolunteers(Array.isArray(volunteersData) ? volunteersData : []);
        } catch (error) {
            console.error('Error fetching volunteers:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchVolunteers();
    }, [fetchVolunteers]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await volunteerAPI.register({
                ...formData,
                skills: formData.skills.split(',').map(value => value.trim()).filter(Boolean),
                areaOfInterest: formData.areaOfInterest.split(',').map(value => value.trim()).filter(Boolean)
            });
            setFormData(initialForm);
            setShowForm(false);
            await fetchVolunteers();
        } catch (error) {
            console.error('Error registering volunteer:', error);
        }
    };

    const handleStatusChange = async (volunteerId: string, newStatus: string) => {
        try {
            await volunteerAPI.updateStatus(volunteerId, newStatus);
            await fetchVolunteers();
        } catch (error) {
            console.error('Error updating volunteer status:', error);
        }
    };

    if (loading) return <div className="p-6">Loading volunteers...</div>;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Volunteer Management</h1>
                        <p className="text-gray-600">Register and manage volunteers</p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
                        {showForm ? 'Cancel' : 'Register Volunteer'}
                    </Button>
                </div>

                {showForm && (
                    <Card>
                        <CardHeader><CardTitle>Register New Volunteer</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                    <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                    <input name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                    <input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                    <input name="state" placeholder="State" value={formData.state} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                    <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="px-3 py-2 border rounded-lg">
                                        <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                                    </select>
                                    <input name="education" placeholder="Education" value={formData.education} onChange={handleInputChange} className="px-3 py-2 border rounded-lg" />
                                    <input name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleInputChange} className="px-3 py-2 border rounded-lg" />
                                    <input name="experience" placeholder="Experience" value={formData.experience} onChange={handleInputChange} className="px-3 py-2 border rounded-lg" />
                                    <input name="areaOfInterest" placeholder="Areas of Interest (comma-separated)" value={formData.areaOfInterest} onChange={handleInputChange} className="px-3 py-2 border rounded-lg" />
                                    <select name="availability" value={formData.availability} onChange={handleInputChange} className="px-3 py-2 border rounded-lg">
                                        <option value="fulltime">Full Time</option><option value="parttime">Part Time</option><option value="weekends">Weekends</option><option value="flexible">Flexible</option>
                                    </select>
                                    <input name="emergencyContactName" placeholder="Emergency Contact Name" value={formData.emergencyContactName} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                    <input name="emergencyContactPhone" placeholder="Emergency Contact Phone" value={formData.emergencyContactPhone} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                    <input name="emergencyContactRelationship" placeholder="Emergency Contact Relationship" value={formData.emergencyContactRelationship} onChange={handleInputChange} required className="px-3 py-2 border rounded-lg" />
                                </div>
                                <Button type="submit">Register Volunteer</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {volunteers.map(volunteer => (
                        <Card key={volunteer._id || volunteer.volunteerId}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">{volunteer.name}</h2>
                                        <p className="text-sm text-gray-600">{volunteer.volunteerId} · {volunteer.email} · {volunteer.phone}</p>
                                        <p className="text-sm mt-2">Skills: {volunteer.skills?.join(', ') || '—'}</p>
                                        <p className="text-sm">Availability: {volunteer.availability} · Hours: {volunteer.totalHours ?? 0}</p>
                                        <p className="text-sm">Background verified: {volunteer.backgroundVerified ? 'Yes' : 'No'}</p>
                                    </div>
                                    <select value={volunteer.volunteerStatus} onChange={e => void handleStatusChange(volunteer.volunteerId, e.target.value)} className="px-3 py-2 border rounded-lg">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
