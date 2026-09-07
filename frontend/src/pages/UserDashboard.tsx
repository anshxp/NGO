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
    const [donations, setDonations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await donationAPI.getUserDonations();
            const data = response.data;
            const donationItems = data?.donations ?? data?.data ?? data ?? [];
            setDonations(Array.isArray(donationItems) ? donationItems : []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        void fetchUserData();
    }, [fetchUserData]);

    if (!user) return <div>Please log in</div>;
    if (loading) return <div className="min-h-screen bg-gray-50 p-8">Loading dashboard...</div>;

    const hasMembership = Boolean(user.membershipStatus && user.membershipStatus !== 'pending');

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="bg-blue-600 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
                                <p className="text-blue-100">{user.email}</p>
                            </div>
                        </div>
                        <Button variant="secondary" onClick={logout}>Logout</Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-4">
                        <Card>
                            <CardContent className="p-4 space-y-2">
                                <Button variant="ghost" className="w-full justify-start gap-2"><User size={18} /> Profile</Button>
                                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate('/donate')}><Gift size={18} /> Donate Now</Button>
                                <Button variant="ghost" className="w-full justify-start gap-2"><CreditCard size={18} /> ID Card</Button>
                                <Button variant="ghost" className="w-full justify-start gap-2"><Award size={18} /> Certificates</Button>
                                <Button variant="ghost" className="w-full justify-start gap-2"><Settings size={18} /> Settings</Button>
                            </CardContent>
                        </Card>

                        {hasMembership && (
                            <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none">
                                <CardHeader><CardTitle className="text-lg">Membership Card</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div><p className="text-xs text-blue-100">Name</p><p className="font-semibold">{user.name}</p></div>
                                        <div><p className="text-xs text-blue-100">Membership status</p><p className="text-sm">{user.membershipStatus}</p></div>
                                        <div className="pt-4 border-t border-blue-400">
                                            <Badge variant="secondary" className="bg-green-400 text-green-900 border-none">{user.membershipStatus}</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="md:col-span-3">
                        <Tabs defaultValue="donations" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="donations">My Donations</TabsTrigger>
                                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                                <TabsTrigger value="activities">Activities</TabsTrigger>
                            </TabsList>

                            <TabsContent value="donations">
                                <Card>
                                    <CardHeader><CardTitle>Donation History</CardTitle><CardDescription>Thank you for your support</CardDescription></CardHeader>
                                    <CardContent>
                                        {donations.length > 0 ? (
                                            <div className="space-y-4">
                                                {donations.map(donation => {
                                                    const createdAt = donation.createdAt || donation.created_at;
                                                    return (
                                                        <div key={donation._id} className="flex justify-between items-center p-4 border rounded-lg">
                                                            <div>
                                                                <p className="font-medium">₹{donation.amount}</p>
                                                                <p className="text-sm text-gray-500">{createdAt ? new Date(createdAt).toLocaleDateString() : '—'}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <Badge variant={String(donation.payment_status).toUpperCase() === 'SUCCESS' ? 'default' : 'destructive'}>{donation.payment_status}</Badge>
                                                                {donation.receiptUrl && <Button variant="outline" size="sm" asChild><a href={donation.receiptUrl} target="_blank" rel="noopener noreferrer">Receipt</a></Button>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-gray-500"><p>No donations found.</p><Button className="mt-4" onClick={() => navigate('/donate')}>Make your first donation</Button></div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="certificates"><Card><CardHeader><CardTitle>My Certificates</CardTitle></CardHeader><CardContent><p className="text-gray-500 text-center py-8">No certificates issued yet.</p></CardContent></Card></TabsContent>
                            <TabsContent value="activities"><Card><CardHeader><CardTitle>Activities</CardTitle></CardHeader><CardContent><p className="text-gray-500 text-center py-8">No activities to display.</p></CardContent></Card></TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
