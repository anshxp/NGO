import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        fetchBeneficiaries();
    }, []);
    const fetchBeneficiaries = async () => {
        try {
            const response = await fetch('/api/admin/beneficiaries');
            const data = await response.json();
            setBeneficiaries(data);
        }
        catch (error) {
            console.error('Error fetching beneficiaries:', error);
        }
    };
    const onSubmit = async (data) => {
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
        }
        catch (error) {
            toast({
                title: '❌ Error',
                description: 'Failed to add beneficiary',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    const filteredBeneficiaries = beneficiaries.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.beneficiaryId.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsx(AdminLayout, { children: _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold", children: "\u2764\uFE0F Manage Beneficiaries" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Track and manage all beneficiaries in need" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Beneficiaries" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: beneficiaries.length })] }), _jsx(Users, { className: "w-12 h-12 text-blue-300" })] }) }) }), _jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Active" }), _jsx("p", { className: "text-3xl font-bold text-green-600", children: beneficiaries.filter(b => b.status === 'active').length })] }), _jsx(Heart, { className: "w-12 h-12 text-green-300" })] }) }) }), _jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Categories" }), _jsx("p", { className: "text-3xl font-bold text-orange-600", children: new Set(beneficiaries.map(b => b.category)).size })] }), _jsx(MapPin, { className: "w-12 h-12 text-orange-300" })] }) }) }), _jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "This Month" }), _jsx("p", { className: "text-3xl font-bold text-purple-600", children: "0" })] }), _jsx(Plus, { className: "w-12 h-12 text-purple-300" })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-1 border-0 shadow-lg", children: [_jsx(CardHeader, { className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Plus, { className: "w-5 h-5" }), _jsx(CardTitle, { children: "Add Beneficiary" })] }) }), _jsx(CardContent, { className: "pt-6", children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "name", rules: { required: 'Name is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "flex items-center gap-2", children: "\uD83D\uDC64 Name" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Beneficiary name", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "category", rules: { required: 'Category is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "flex items-center gap-2", children: "\uD83C\uDFF7\uFE0F Category" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "e.g., Child, Senior, etc.", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "address", rules: { required: 'Address is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "flex items-center gap-2", children: "\uD83D\uDCCD Address" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Full address", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "phone", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "flex items-center gap-2", children: "\uD83D\uDCDE Phone (Optional)" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Phone number", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs(Button, { type: "submit", disabled: loading, className: "w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), loading ? 'Adding...' : 'Add Beneficiary'] })] }) }) })] }), _jsxs(Card, { className: "lg:col-span-2 border-0 shadow-lg", children: [_jsx(CardHeader, { className: "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg", children: _jsxs("div", { className: "flex items-center gap-3 justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Users, { className: "w-5 h-5" }), _jsx(CardTitle, { children: "Beneficiaries List" })] }), _jsxs(Badge, { className: "bg-white text-green-600", children: [beneficiaries.length, " Total"] })] }) }), _jsxs(CardContent, { className: "pt-6", children: [_jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx(Search, { className: "w-5 h-5 text-gray-400 absolute mt-2.5 ml-3" }), _jsx(Input, { placeholder: "Search by name or ID...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10" })] }), filteredBeneficiaries.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "No beneficiaries found" })] })) : (_jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: filteredBeneficiaries.map((beneficiary) => (_jsxs("div", { className: "p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-lg text-gray-800", children: beneficiary.name }), _jsxs("p", { className: "text-xs text-gray-500", children: ["ID: ", beneficiary.beneficiaryId] })] }), _jsx(Badge, { className: "bg-gradient-to-r from-green-500 to-green-600 text-white", children: beneficiary.category })] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-gray-600", children: beneficiary.address })] }), beneficiary.phone && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Phone, { className: "w-4 h-4 text-gray-400" }), _jsx("p", { className: "text-gray-600", children: beneficiary.phone })] }))] })] }, beneficiary._id))) }))] })] })] })] }) }));
}
