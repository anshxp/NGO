import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { volunteerAPI } from '@/lib/apiClient';
const initialForm = {
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
    dateOfBirth: '', gender: 'male', education: '', skills: '', experience: '',
    areaOfInterest: '', availability: 'flexible', emergencyContactName: '',
    emergencyContactPhone: '', emergencyContactRelationship: ''
};
export default function AdminVolunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(initialForm);
    const fetchVolunteers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await volunteerAPI.getVolunteers();
            const volunteersData = response.data?.volunteers ?? response.data?.data ?? response.data ?? [];
            setVolunteers(Array.isArray(volunteersData) ? volunteersData : []);
        }
        catch (error) {
            console.error('Error fetching volunteers:', error);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        void fetchVolunteers();
    }, [fetchVolunteers]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
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
        }
        catch (error) {
            console.error('Error registering volunteer:', error);
        }
    };
    const handleStatusChange = async (volunteerId, newStatus) => {
        try {
            await volunteerAPI.updateStatus(volunteerId, newStatus);
            await fetchVolunteers();
        }
        catch (error) {
            console.error('Error updating volunteer status:', error);
        }
    };
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading volunteers..." });
    return (_jsx(AdminLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Volunteer Management" }), _jsx("p", { className: "text-gray-600", children: "Register and manage volunteers" })] }), _jsx(Button, { onClick: () => setShowForm(!showForm), className: "bg-blue-600 hover:bg-blue-700", children: showForm ? 'Cancel' : 'Register Volunteer' })] }), showForm && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Register New Volunteer" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("input", { name: "name", placeholder: "Full Name", value: formData.name, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { type: "email", name: "email", placeholder: "Email", value: formData.email, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { name: "phone", placeholder: "Phone", value: formData.phone, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { name: "address", placeholder: "Address", value: formData.address, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { name: "city", placeholder: "City", value: formData.city, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { name: "state", placeholder: "State", value: formData.state, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { name: "pincode", placeholder: "Pincode", value: formData.pincode, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { type: "date", name: "dateOfBirth", value: formData.dateOfBirth, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" }), _jsxs("select", { name: "gender", value: formData.gender, onChange: handleInputChange, className: "px-3 py-2 border rounded-lg", children: [_jsx("option", { value: "male", children: "Male" }), _jsx("option", { value: "female", children: "Female" }), _jsx("option", { value: "other", children: "Other" })] }), _jsx("input", { name: "education", placeholder: "Education", value: formData.education, onChange: handleInputChange, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { name: "skills", placeholder: "Skills (comma-separated)", value: formData.skills, onChange: handleInputChange, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { name: "experience", placeholder: "Experience", value: formData.experience, onChange: handleInputChange, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { name: "areaOfInterest", placeholder: "Areas of Interest (comma-separated)", value: formData.areaOfInterest, onChange: handleInputChange, className: "px-3 py-2 border rounded-lg" }), _jsxs("select", { name: "availability", value: formData.availability, onChange: handleInputChange, className: "px-3 py-2 border rounded-lg", children: [_jsx("option", { value: "fulltime", children: "Full Time" }), _jsx("option", { value: "parttime", children: "Part Time" }), _jsx("option", { value: "weekends", children: "Weekends" }), _jsx("option", { value: "flexible", children: "Flexible" })] }), _jsx("input", { name: "emergencyContactName", placeholder: "Emergency Contact Name", value: formData.emergencyContactName, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { name: "emergencyContactPhone", placeholder: "Emergency Contact Phone", value: formData.emergencyContactPhone, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" }), _jsx("input", { name: "emergencyContactRelationship", placeholder: "Emergency Contact Relationship", value: formData.emergencyContactRelationship, onChange: handleInputChange, required: true, className: "px-3 py-2 border rounded-lg" })] }), _jsx(Button, { type: "submit", children: "Register Volunteer" })] }) })] })), _jsx("div", { className: "grid grid-cols-1 gap-4", children: volunteers.map(volunteer => (_jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold", children: volunteer.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [volunteer.volunteerId, " \u00B7 ", volunteer.email, " \u00B7 ", volunteer.phone] }), _jsxs("p", { className: "text-sm mt-2", children: ["Skills: ", volunteer.skills?.join(', ') || '—'] }), _jsxs("p", { className: "text-sm", children: ["Availability: ", volunteer.availability, " \u00B7 Hours: ", volunteer.totalHours ?? 0] }), _jsxs("p", { className: "text-sm", children: ["Background verified: ", volunteer.backgroundVerified ? 'Yes' : 'No'] })] }), _jsxs("select", { value: volunteer.volunteerStatus, onChange: e => void handleStatusChange(volunteer.volunteerId, e.target.value), className: "px-3 py-2 border rounded-lg", children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" }), _jsx("option", { value: "suspended", children: "Suspended" }), _jsx("option", { value: "completed", children: "Completed" })] })] }) }) }, volunteer._id || volunteer.volunteerId))) })] }) }));
}
