import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { donationAPI } from '@/lib/apiClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, Gift, Award, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function UserDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchUserData = useCallback(async () => {
        if (!user)
            return;
        try {
            setLoading(true);
            const response = await donationAPI.getUserDonations();
            const data = response.data;
            const donationItems = data?.donations ?? data?.data ?? data ?? [];
            setDonations(Array.isArray(donationItems) ? donationItems : []);
        }
        catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
        finally {
            setLoading(false);
        }
    }, [user]);
    useEffect(() => {
        void fetchUserData();
    }, [fetchUserData]);
    if (!user)
        return _jsx("div", { children: "Please log in" });
    if (loading)
        return _jsx("div", { className: "min-h-screen bg-gray-50 p-8", children: "Loading dashboard..." });
    const hasMembership = Boolean(user.membershipStatus && user.membershipStatus !== 'pending');
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-12", children: [_jsx("div", { className: "bg-blue-600 text-white py-8", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "h-16 w-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold", children: user.name.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold", children: ["Welcome, ", user.name] }), _jsx("p", { className: "text-blue-100", children: user.email })] })] }), _jsx(Button, { variant: "secondary", onClick: logout, children: "Logout" })] }) }) }), _jsx("div", { className: "container mx-auto px-4 mt-8", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsxs("div", { className: "md:col-span-1 space-y-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4 space-y-2", children: [_jsxs(Button, { variant: "ghost", className: "w-full justify-start gap-2", children: [_jsx(User, { size: 18 }), " Profile"] }), _jsxs(Button, { variant: "ghost", className: "w-full justify-start gap-2", onClick: () => navigate('/donate'), children: [_jsx(Gift, { size: 18 }), " Donate Now"] }), _jsxs(Button, { variant: "ghost", className: "w-full justify-start gap-2", children: [_jsx(CreditCard, { size: 18 }), " ID Card"] }), _jsxs(Button, { variant: "ghost", className: "w-full justify-start gap-2", children: [_jsx(Award, { size: 18 }), " Certificates"] }), _jsxs(Button, { variant: "ghost", className: "w-full justify-start gap-2", children: [_jsx(Settings, { size: 18 }), " Settings"] })] }) }), hasMembership && (_jsxs(Card, { className: "bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Membership Card" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-blue-100", children: "Name" }), _jsx("p", { className: "font-semibold", children: user.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-blue-100", children: "Membership status" }), _jsx("p", { className: "text-sm", children: user.membershipStatus })] }), _jsx("div", { className: "pt-4 border-t border-blue-400", children: _jsx(Badge, { variant: "secondary", className: "bg-green-400 text-green-900 border-none", children: user.membershipStatus }) })] }) })] }))] }), _jsx("div", { className: "md:col-span-3", children: _jsxs(Tabs, { defaultValue: "donations", className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "donations", children: "My Donations" }), _jsx(TabsTrigger, { value: "certificates", children: "Certificates" }), _jsx(TabsTrigger, { value: "activities", children: "Activities" })] }), _jsx(TabsContent, { value: "donations", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Donation History" }), _jsx(CardDescription, { children: "Thank you for your support" })] }), _jsx(CardContent, { children: donations.length > 0 ? (_jsx("div", { className: "space-y-4", children: donations.map(donation => {
                                                            const createdAt = donation.createdAt || donation.created_at;
                                                            return (_jsxs("div", { className: "flex justify-between items-center p-4 border rounded-lg", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: ["\u20B9", donation.amount] }), _jsx("p", { className: "text-sm text-gray-500", children: createdAt ? new Date(createdAt).toLocaleDateString() : '—' })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: String(donation.payment_status).toUpperCase() === 'SUCCESS' ? 'default' : 'destructive', children: donation.payment_status }), donation.receiptUrl && _jsx(Button, { variant: "outline", size: "sm", asChild: true, children: _jsx("a", { href: donation.receiptUrl, target: "_blank", rel: "noopener noreferrer", children: "Receipt" }) })] })] }, donation._id));
                                                        }) })) : (_jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx("p", { children: "No donations found." }), _jsx(Button, { className: "mt-4", onClick: () => navigate('/donate'), children: "Make your first donation" })] })) })] }) }), _jsx(TabsContent, { value: "certificates", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "My Certificates" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-500 text-center py-8", children: "No certificates issued yet." }) })] }) }), _jsx(TabsContent, { value: "activities", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Activities" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-500 text-center py-8", children: "No activities to display." }) })] }) })] }) })] }) })] }));
}
