import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { enquiryAPI } from '@/lib/apiClient';
export default function Enquiry() {
    const form = useForm({ defaultValues: { name: '', email: '', phone: '', subject: '', message: '' } });
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await enquiryAPI.submitEnquiry({ ...data, name: data.name.trim(), email: data.email.trim().toLowerCase(), phone: data.phone.trim(), subject: data.subject.trim(), message: data.message.trim() });
            if (response.data?.success !== false) {
                toast({ title: 'Success', description: 'Your enquiry has been submitted successfully!' });
                form.reset();
            }
        }
        catch (error) {
            toast({ title: 'Error', description: error.response?.data?.error || error.message || 'Failed to submit enquiry', variant: 'destructive' });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4", children: _jsx("div", { className: "max-w-2xl mx-auto", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Quick Enquiry" }), _jsx(CardDescription, { children: "Have a question? Get in touch with us" })] }), _jsx(CardContent, { children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [_jsx(FormField, { control: form.control, name: "name", rules: { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } }, render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Full Name" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Your name", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "email", rules: { required: 'Email is required' }, render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Email" }), _jsx(FormControl, { children: _jsx(Input, { type: "email", placeholder: "you@example.com", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "phone", render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Phone" }), _jsx(FormControl, { children: _jsx(Input, { type: "tel", placeholder: "+91 XXXXX XXXXX", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "subject", rules: { required: 'Subject is required' }, render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Subject" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Subject", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "message", rules: { required: 'Message is required', minLength: { value: 10, message: 'Message is too short' } }, render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Message" }), _jsx(FormControl, { children: _jsx(Textarea, { rows: 6, placeholder: "Your message", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full", children: loading ? 'Sending...' : 'Send Enquiry' })] }) }) })] }) }) }));
}
