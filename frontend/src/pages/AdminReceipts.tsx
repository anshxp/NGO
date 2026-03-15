import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/AdminLayout';
import { FileText, Download, Search, DollarSign, TrendingUp } from 'lucide-react';

interface Receipt {
    _id: string;
    receiptId: string;
    receiptType: string;
    amount: number;
    date: string;
    status: string;
    pdfUrl?: string;
}

export default function AdminReceipts() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchReceipts();
    }, []);

    useEffect(() => {
        filterReceipts();
    }, [searchTerm, filterType, receipts]);

    const fetchReceipts = async () => {
        try {
            setLoading(true);
            const authToken = localStorage.getItem('authToken');
            
            const response = await fetch(
                `http://localhost:7856/graphql`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
                    },
                    body: JSON.stringify({
                        query: `query GetReceipts {
                            getReceipts {
                                id
                                receiptId
                                receiptType
                                amount
                                date
                                status
                                pdfUrl
                            }
                        }`
                    })
                }
            );

            const result = await response.json();
            
            if (result.errors) {
                console.error('GraphQL errors:', result.errors);
                setReceipts([]);
                toast({
                    title: '⚠️ Info',
                    description: 'No receipts found',
                    variant: 'destructive'
                });
            } else if (result.data?.getReceipts) {
                setReceipts(result.data.getReceipts);
            } else {
                setReceipts([]);
            }
        } catch (error) {
            console.error('Error fetching receipts:', error);
            setReceipts([]);
            toast({
                title: '❌ Error',
                description: 'Failed to fetch receipts. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const filterReceipts = () => {
        let filtered = receipts;

        if (filterType !== 'all') {
            filtered = filtered.filter(r => r.receiptType === filterType);
        }

        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.receiptId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredReceipts(filtered);
    };

    const typeColors: { [key: string]: string } = {
        membership: 'bg-blue-100 text-blue-800',
        donation: 'bg-green-100 text-green-800',
        event: 'bg-purple-100 text-purple-800',
        cash_donation: 'bg-orange-100 text-orange-800'
    };

    const totalAmount = filteredReceipts.reduce((sum, r) => sum + r.amount, 0);
    const donationCount = filteredReceipts.filter(r => r.receiptType === 'donation').length;
    const membershipCount = filteredReceipts.filter(r => r.receiptType === 'membership').length;

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">🧾 Receipt Management</h1>
                    <p className="text-gray-600 mt-2">View and manage all receipts in one place</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Receipts</p>
                                    <p className="text-3xl font-bold text-blue-600">{filteredReceipts.length}</p>
                                </div>
                                <FileText className="w-12 h-12 text-blue-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="text-3xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
                                </div>
                                <DollarSign className="w-12 h-12 text-green-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Donations</p>
                                    <p className="text-3xl font-bold text-orange-600">{donationCount}</p>
                                </div>
                                <TrendingUp className="w-12 h-12 text-orange-300" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters Card */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <Search className="w-5 h-5" />
                            <CardTitle>Search & Filter</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium flex items-center gap-2">🔍 Search Receipt ID</label>
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium flex items-center gap-2">🏷️ Receipt Type</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                >
                                    <option value="all">All Types</option>
                                    <option value="membership">Membership</option>
                                    <option value="donation">Donation</option>
                                    <option value="event">Event</option>
                                    <option value="cash_donation">Cash Donation</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Receipts Card */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                        <div className="flex items-center gap-3 justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5" />
                                <CardTitle>Receipts List</CardTitle>
                            </div>
                            <Badge className="bg-white text-green-600">{filteredReceipts.length} Total</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading receipts...</p>
                            </div>
                        ) : filteredReceipts.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No receipts found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4 font-semibold">Receipt ID</th>
                                            <th className="text-left py-3 px-4 font-semibold">Type</th>
                                            <th className="text-left py-3 px-4 font-semibold">Amount</th>
                                            <th className="text-left py-3 px-4 font-semibold">Date</th>
                                            <th className="text-left py-3 px-4 font-semibold">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReceipts.map((receipt) => (
                                            <tr key={receipt._id} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-gray-800">{receipt.receiptId}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={typeColors[receipt.receiptType]}>
                                                        {receipt.receiptType.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-green-600">₹{receipt.amount.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-gray-600">
                                                    {new Date(receipt.date).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge className={receipt.status === 'issued' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'}>
                                                        {receipt.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {receipt.pdfUrl && (
                                                        <a
                                                            href={receipt.pdfUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded text-sm transition-all"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            View PDF
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
