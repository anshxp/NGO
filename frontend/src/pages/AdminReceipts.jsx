import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/AdminLayout';
import { FileText, Download, Search, DollarSign, TrendingUp } from 'lucide-react';
export default function AdminReceipts() {
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
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
            const response = await fetch(`http://localhost:7856/graphql`, {
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
            });
            const result = await response.json();
            if (result.errors) {
                console.error('GraphQL errors:', result.errors);
                setReceipts([]);
                toast({
                    title: '⚠️ Info',
                    description: 'No receipts found',
                    variant: 'destructive'
                });
            }
            else if (result.data?.getReceipts) {
                setReceipts(result.data.getReceipts);
            }
            else {
                setReceipts([]);
            }
        }
        catch (error) {
            console.error('Error fetching receipts:', error);
            setReceipts([]);
            toast({
                title: '❌ Error',
                description: 'Failed to fetch receipts. Please try again.',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    const filterReceipts = () => {
        let filtered = receipts;
        if (filterType !== 'all') {
            filtered = filtered.filter(r => r.receiptType === filterType);
        }
        if (searchTerm) {
            filtered = filtered.filter(r => r.receiptId.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFilteredReceipts(filtered);
    };
    const typeColors = {
        membership: 'bg-blue-100 text-blue-800',
        donation: 'bg-green-100 text-green-800',
        event: 'bg-purple-100 text-purple-800',
        cash_donation: 'bg-orange-100 text-orange-800'
    };
    const totalAmount = filteredReceipts.reduce((sum, r) => sum + r.amount, 0);
    const donationCount = filteredReceipts.filter(r => r.receiptType === 'donation').length;
    const membershipCount = filteredReceipts.filter(r => r.receiptType === 'membership').length;
    return (_jsx(AdminLayout, { children: _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold", children: "\uD83E\uDDFE Receipt Management" }), _jsx("p", { className: "text-gray-600 mt-2", children: "View and manage all receipts in one place" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Receipts" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: filteredReceipts.length })] }), _jsx(FileText, { className: "w-12 h-12 text-blue-300" })] }) }) }), _jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Amount" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: ["\u20B9", totalAmount.toLocaleString()] })] }), _jsx(DollarSign, { className: "w-12 h-12 text-green-300" })] }) }) }), _jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Donations" }), _jsx("p", { className: "text-3xl font-bold text-orange-600", children: donationCount })] }), _jsx(TrendingUp, { className: "w-12 h-12 text-orange-300" })] }) }) })] }), _jsxs(Card, { className: "border-0 shadow-lg", children: [_jsx(CardHeader, { className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Search, { className: "w-5 h-5" }), _jsx(CardTitle, { children: "Search & Filter" })] }) }), _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium flex items-center gap-2", children: "\uD83D\uDD0D Search Receipt ID" }), _jsx(Input, { placeholder: "Search...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "mt-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium flex items-center gap-2", children: "\uD83C\uDFF7\uFE0F Receipt Type" }), _jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-white", children: [_jsx("option", { value: "all", children: "All Types" }), _jsx("option", { value: "membership", children: "Membership" }), _jsx("option", { value: "donation", children: "Donation" }), _jsx("option", { value: "event", children: "Event" }), _jsx("option", { value: "cash_donation", children: "Cash Donation" })] })] })] }) })] }), _jsxs(Card, { className: "border-0 shadow-lg", children: [_jsx(CardHeader, { className: "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg", children: _jsxs("div", { className: "flex items-center gap-3 justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(FileText, { className: "w-5 h-5" }), _jsx(CardTitle, { children: "Receipts List" })] }), _jsxs(Badge, { className: "bg-white text-green-600", children: [filteredReceipts.length, " Total"] })] }) }), _jsx(CardContent, { className: "pt-6", children: loading ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Loading receipts..." })] })) : filteredReceipts.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(FileText, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "No receipts found" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-gray-50", children: [_jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Receipt ID" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Type" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Amount" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Date" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Status" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Action" })] }) }), _jsx("tbody", { children: filteredReceipts.map((receipt) => (_jsxs("tr", { className: "border-b hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "py-3 px-4 font-medium text-gray-800", children: receipt.receiptId }), _jsx("td", { className: "py-3 px-4", children: _jsx(Badge, { className: typeColors[receipt.receiptType], children: receipt.receiptType.replace('_', ' ') }) }), _jsxs("td", { className: "py-3 px-4 font-semibold text-green-600", children: ["\u20B9", receipt.amount.toLocaleString()] }), _jsx("td", { className: "py-3 px-4 text-gray-600", children: new Date(receipt.date).toLocaleDateString() }), _jsx("td", { className: "py-3 px-4", children: _jsx(Badge, { className: receipt.status === 'issued' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white', children: receipt.status }) }), _jsx("td", { className: "py-3 px-4", children: receipt.pdfUrl && (_jsxs("a", { href: receipt.pdfUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded text-sm transition-all", children: [_jsx(Download, { className: "w-4 h-4" }), "View PDF"] })) })] }, receipt._id))) })] }) })) })] })] }) }));
}
