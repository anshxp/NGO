import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/AdminLayout';
import { Users, Plus, Search, Heart, MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminBeneficiaries() {
    const form = useForm();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const fetchBeneficiaries = async () => {
        try {
            const response = await fetch('/api/admin/beneficiaries');
            const data = await response.json();
            setBeneficiaries(data);
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
        }
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/beneficiaries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                toast({ title: '✅ Success', description: 'Beneficiary added successfully' });
                form.reset();
                fetchBeneficiaries();
            }
        } catch (error) {
            toast({
                title: '❌ Error',
                description: 'Failed to add beneficiary',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredBeneficiaries = beneficiaries.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.beneficiaryId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">❤️ Manage Beneficiaries</h1>
                    <p className="text-gray-600 mt-2">Track and manage all beneficiaries in need</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Beneficiaries</p>
                                    <p className="text-3xl font-bold text-blue-600">{beneficiaries.length}</p>
                                </div>
                                <Users className="w-12 h-12 text-blue-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active</p>
                                    <p className="text-3xl font-bold text-green-600">{beneficiaries.filter(b => b.status === 'active').length}</p>
                                </div>
                                <Heart className="w-12 h-12 text-green-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Categories</p>
                                    <p className="text-3xl font-bold text-orange-600">{new Set(beneficiaries.map(b => b.category)).size}</p>
                                </div>
                                <MapPin className="w-12 h-12 text-orange-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">This Month</p>
                                    <p className="text-3xl font-bold text-purple-600">0</p>
                                </div>
                                <Plus className="w-12 h-12 text-purple-300" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Form */}
                    <Card className="lg:col-span-1 border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <Plus className="w-5 h-5" />
                                <CardTitle>Add Beneficiary</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        rules={{ required: 'Name is required' }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">👤 Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Beneficiary name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category"
                                        rules={{ required: 'Category is required' }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">🏷️ Category</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Child, Senior, etc." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        rules={{ required: 'Address is required' }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">📍 Address</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Full address" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">📞 Phone (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Phone number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        {loading ? 'Adding...' : 'Add Beneficiary'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* List */}
                    <Card className="lg:col-span-2 border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                            <div className="flex items-center gap-3 justify-between">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5" />
                                    <CardTitle>Beneficiaries List</CardTitle>
                                </div>
                                <Badge className="bg-white text-green-600">{beneficiaries.length} Total</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex gap-2 mb-4">
                                <Search className="w-5 h-5 text-gray-400 absolute mt-2.5 ml-3" />
                                <Input
                                    placeholder="Search by name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {filteredBeneficiaries.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No beneficiaries found</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {filteredBeneficiaries.map((beneficiary) => (
                                        <div key={beneficiary._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-gray-800">{beneficiary.name}</h3>
                                                    <p className="text-xs text-gray-500">ID: {beneficiary.beneficiaryId}</p>
                                                </div>
                                                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                                    {beneficiary.category}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <p className="text-gray-600">{beneficiary.address}</p>
                                                </div>
                                                {beneficiary.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        <p className="text-gray-600">{beneficiary.phone}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
