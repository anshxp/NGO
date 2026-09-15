import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Send, Mail, Users } from 'lucide-react';
export default function AdminMessages() {
    const form = useForm();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [sendToAll, setSendToAll] = useState(false);
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    sendToAll
                })
            });
            if (response.ok) {
                toast({
                    title: '✅ Success',
                    description: `Message ${sendToAll ? 'sent to all members' : 'sent to member'}`
                });
                form.reset();
                setSendToAll(false);
            }
        }
        catch (error) {
            toast({
                title: '❌ Error',
                description: 'Failed to send message',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(AdminLayout, { children: _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "\uD83D\uDCAC Send Messages" }), _jsx("p", { className: "text-gray-600", children: "Send notifications and messages to members directly to their dashboard and email" })] }), _jsxs(Card, { className: "border-0 shadow-lg max-w-2xl", children: [_jsx(CardHeader, { className: "border-b border-gray-200 pb-6", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-3 bg-gradient-primary rounded-lg", children: _jsx(Mail, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-2xl", children: "New Message" }), _jsx(CardDescription, { children: "Messages will be emailed and shown in member dashboard" })] })] }) }), _jsx(CardContent, { className: "pt-8", children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [_jsx("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-200", children: _jsx(FormField, { control: form.control, name: "sendToAll", render: () => (_jsxs(FormItem, { className: "flex items-center space-x-3", children: [_jsx(Checkbox, { checked: sendToAll, onCheckedChange: (checked) => setSendToAll(checked), className: "w-5 h-5" }), _jsxs("div", { children: [_jsxs(FormLabel, { className: "cursor-pointer font-semibold text-gray-900 flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4" }), "Send to all members"] }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Check this to send to every member at once" })] })] })) }) }), !sendToAll && (_jsx(FormField, { control: form.control, name: "recipientId", rules: { required: sendToAll ? false : 'Select a member' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-base font-semibold", children: "\uD83D\uDCE7 Select Member" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Search member by name or email...", ...field, className: "h-10" }) })] })) })), _jsx(FormField, { control: form.control, name: "title", rules: { required: 'Title is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-base font-semibold", children: "\uD83D\uDCDD Message Subject" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "e.g., Important Update, New Event, etc.", ...field, className: "h-10" }) })] })) }), _jsx(FormField, { control: form.control, name: "content", rules: { required: 'Message is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-base font-semibold", children: "\uD83D\uDCAD Message Content" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Type your message here... Keep it clear and professional.", className: "min-h-40 resize-none", ...field }) })] })) }), _jsxs(Button, { type: "submit", disabled: loading, className: "w-full h-11 bg-gradient-primary hover:opacity-90 text-white font-semibold flex items-center justify-center gap-2 text-base", children: [_jsx(Send, { className: "w-5 h-5" }), loading ? 'Sending...' : 'Send Message'] })] }) }) })] }), _jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-r from-cyan-50 to-blue-50 max-w-2xl", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "font-semibold text-gray-900", children: "\uD83D\uDCA1 Tips for Effective Messages:" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-sm text-gray-700", children: [_jsx("li", { children: "Keep messages concise and clear" }), _jsx("li", { children: "Use a specific subject line" }), _jsx("li", { children: "Messages will be sent via email and appear in member dashboard" }), _jsx("li", { children: "You can target individual members or broadcast to all" })] })] }) }) })] }) }));
}
