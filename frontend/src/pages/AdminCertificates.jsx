import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { certificateAPI } from '@/lib/apiClient';
export default function AdminCertificates() {
    const form = useForm();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const fetchCertificates = useCallback(async () => {
        try {
            const response = await certificateAPI.getCertificates();
            const list = response.data?.certificates || response.data || [];
            setCertificates(list.map((c) => ({ ...c, id: c.id || c._id })));
        }
        catch (error) {
            console.error('Error fetching certificates:', error);
            toast({ title: 'Error', description: 'Failed to fetch certificates', variant: 'destructive' });
        }
    }, [toast]);
    useEffect(() => { void fetchCertificates(); }, [fetchCertificates]);
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await certificateAPI.issueCertificate({ ...data, recipientName: data.recipientName.trim(), recipientEmail: data.recipientEmail.trim().toLowerCase(), title: data.title.trim(), description: data.description?.trim() });
            toast({ title: 'Success', description: 'Certificate issued successfully' });
            form.reset();
            await fetchCertificates();
        }
        catch (error) {
            console.error('Issue certificate error', error);
            toast({ title: 'Error', description: error.response?.data?.error || 'Failed to issue certificate', variant: 'destructive' });
        }
        finally {
            setLoading(false);
        }
    };
    return _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Manage Certificates" }), _jsx("p", { className: "text-gray-600", children: "Issue and track certificates" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-1", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Issue Certificate" }) }), _jsx(CardContent, { children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "recipientName", rules: { required: 'Recipient Name is required' }, render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Recipient Name" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Recipient Name", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "recipientEmail", rules: { required: 'Recipient Email is required' }, render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Recipient Email" }), _jsx(FormControl, { children: _jsx(Input, { type: "email", placeholder: "email@example.com", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "title", rules: { required: 'Title is required' }, render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Certificate Title" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "e.g. Volunteer of the Year", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "description", render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Description (Optional)" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Certificate details", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full", children: loading ? 'Issuing...' : 'Issue Certificate' })] }) }) })] }), _jsxs(Card, { className: "lg:col-span-2", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Certificates List" }), _jsxs(CardDescription, { children: ["Total: ", certificates.length] })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: certificates.map((cert) => _jsxs("div", { className: "p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium", children: cert.title }), _jsxs("p", { className: "text-sm text-gray-600", children: ["To: ", cert.recipientName, " (", cert.recipientEmail, ")"] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["ID: ", cert.certificateId] })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: `text-xs px-2 py-1 rounded ${cert.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`, children: cert.isVerified ? 'Verified' : 'Unverified' }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : '' })] })] }, cert.id)) }) })] })] })] });
}
