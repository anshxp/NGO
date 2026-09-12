import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
export default function MembershipRegistration() {
    const form = useForm();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch('/api/membership/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Membership registration successful!',
                });
                form.reset();
            }
            else {
                toast({
                    title: 'Error',
                    description: 'Failed to register membership',
                    variant: 'destructive'
                });
            }
        }
        catch (error) {
            toast({
                title: 'Error',
                description: 'An error occurred',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4", children: _jsx("div", { className: "max-w-2xl mx-auto", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Membership Registration" }), _jsx(CardDescription, { children: "Join our organization and become a valued member" })] }), _jsx(CardContent, { children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [_jsx(FormField, { control: form.control, name: "name", rules: { required: 'Name is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Full Name" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Enter your full name", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "email", rules: { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+$/, message: 'Invalid email' } }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Email" }), _jsx(FormControl, { children: _jsx(Input, { type: "email", placeholder: "your@email.com", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "phone", rules: { required: 'Phone is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Phone Number" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "+91 XXXXX XXXXX", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "dateOfBirth", rules: { required: 'Date of birth is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Date of Birth" }), _jsx(FormControl, { children: _jsx(Input, { type: "date", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "address", rules: { required: 'Address is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Address" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Enter your address", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "designation", rules: { required: 'Please select a designation' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Designation" }), _jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [_jsx(FormControl, { children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select a designation" }) }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "member", children: "Member" }), _jsx(SelectItem, { value: "volunteer", children: "Volunteer" }), _jsx(SelectItem, { value: "coordinator", children: "Coordinator" })] })] }), _jsx(FormMessage, {})] })) }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full", children: loading ? 'Registering...' : 'Register Now' })] }) }) })] }) }) }));
}
