import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { enquiryAPI } from '@/lib/apiClient';
import { Mail, User, MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [replyLoading, setReplyLoading] = useState(false);
    const { toast } = useToast();
    const fetchEnquiries = useCallback(async () => {
        try {
            const response = await enquiryAPI.getEnquiries();
            const list = response.data?.enquiries || response.data || [];
            setEnquiries(list.map((e) => ({ ...e, id: e.id || e._id, _id: e._id || e.id })));
        }
        catch (error) {
            console.error('Error fetching enquiries', error);
            toast({ title: 'Error', description: 'Failed to fetch enquiries', variant: 'destructive' });
        }
        finally {
            setLoading(false);
        }
    }, [toast]);
    useEffect(() => { void fetchEnquiries(); }, [fetchEnquiries]);
    const handleReply = async () => {
        if (!selectedEnquiry || !reply.trim())
            return;
        setReplyLoading(true);
        try {
            await enquiryAPI.replyToEnquiry(selectedEnquiry.id, reply.trim());
            toast({ title: 'Success', description: 'Reply sent successfully' });
            setReply('');
            setSelectedEnquiry(null);
            await fetchEnquiries();
        }
        catch (error) {
            console.error('Reply error', error);
            toast({ title: 'Error', description: error.response?.data?.error || 'Failed to send reply', variant: 'destructive' });
        }
        finally {
            setReplyLoading(false);
        }
    };
    const statusConfig = {
        new: { color: 'bg-yellow-100 text-yellow-800', icon: _jsx(Clock, { className: "w-4 h-4" }), label: 'New' },
        read: { color: 'bg-blue-100 text-blue-800', icon: _jsx(Mail, { className: "w-4 h-4" }), label: 'Read' },
        replied: { color: 'bg-green-100 text-green-800', icon: _jsx(CheckCircle, { className: "w-4 h-4" }), label: 'Replied' },
        closed: { color: 'bg-gray-100 text-gray-800', icon: _jsx(CheckCircle, { className: "w-4 h-4" }), label: 'Closed' }
    };
    return _jsx(AdminLayout, { children: _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Enquiries Management" }), _jsx("p", { className: "text-gray-600", children: "Handle and respond to visitor enquiries" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [['Total Enquiries', enquiries.length, 'text-blue-600'], ['New', enquiries.filter(e => e.status === 'new').length, 'text-yellow-600'], ['Replied', enquiries.filter(e => e.status === 'replied').length, 'text-green-600'], ['Closed', enquiries.filter(e => e.status === 'closed').length, 'text-gray-600']].map(([label, value, color]) => _jsx(Card, { className: "border-0 shadow-lg", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: `text-3xl font-bold ${color}`, children: value }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: label })] }) }) }, String(label))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "border-0 shadow-lg lg:col-span-1", children: [_jsxs(CardHeader, { className: "border-b border-gray-200 pb-4", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(MessageSquare, { className: "w-5 h-5" }), "Enquiries List"] }), _jsxs(CardDescription, { children: [enquiries.length, " total"] })] }), _jsx(CardContent, { className: "pt-4", children: _jsx("div", { className: "space-y-2 max-h-[600px] overflow-y-auto", children: loading ? _jsx("p", { className: "text-gray-500 text-center py-8", children: "Loading..." }) : enquiries.length === 0 ? _jsx("p", { className: "text-gray-500 text-center py-8", children: "No enquiries yet" }) : enquiries.map((enquiry) => _jsxs("button", { onClick: () => setSelectedEnquiry(enquiry), className: `w-full text-left p-4 rounded-lg border-2 transition duration-200 ${selectedEnquiry?.id === enquiry.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("span", { className: "font-semibold text-gray-900 truncate", children: enquiry.name }), _jsx(Badge, { className: statusConfig[enquiry.status]?.color || 'bg-gray-100', children: statusConfig[enquiry.status]?.label || enquiry.status })] }), _jsx("p", { className: "text-sm text-gray-600 truncate", children: enquiry.subject }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: enquiry.email })] }, enquiry.id)) }) })] }), _jsxs(Card, { className: "border-0 shadow-lg lg:col-span-2", children: [_jsx(CardHeader, { className: "border-b border-gray-200 pb-4", children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-5 h-5" }), "Enquiry Details"] }) }), _jsx(CardContent, { className: "pt-6", children: selectedEnquiry ? _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase", children: "Name" }), _jsx("p", { className: "font-semibold text-gray-900", children: selectedEnquiry.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase", children: "Email" }), _jsx("p", { className: "font-semibold text-gray-900 break-all", children: selectedEnquiry.email })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase", children: "Phone" }), _jsx("p", { className: "font-semibold text-gray-900", children: selectedEnquiry.phone || '—' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase", children: "Status" }), _jsx(Badge, { className: `${statusConfig[selectedEnquiry.status]?.color || 'bg-gray-100'} mt-1`, children: statusConfig[selectedEnquiry.status]?.label || selectedEnquiry.status })] })] }), _jsxs("div", { className: "border-t pt-4", children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase mb-2", children: "Subject" }), _jsx("p", { className: "font-semibold text-gray-900", children: selectedEnquiry.subject })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg border border-gray-200", children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase mb-2", children: "Message" }), _jsx("p", { className: "text-gray-700 whitespace-pre-wrap", children: selectedEnquiry.message })] }), selectedEnquiry.reply ? _jsxs("div", { className: "bg-green-50 p-4 rounded-lg border border-green-200", children: [_jsx("p", { className: "text-xs font-semibold text-green-700 uppercase mb-2", children: "Reply" }), _jsx("p", { className: "text-gray-700 whitespace-pre-wrap", children: selectedEnquiry.reply })] }) : _jsxs("div", { className: "bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-3", children: [_jsx("p", { className: "text-xs font-semibold text-yellow-700 uppercase", children: "Send a Reply" }), _jsx(Textarea, { placeholder: "Type your reply here...", value: reply, onChange: (e) => setReply(e.target.value), className: "min-h-28 resize-none" }), _jsxs(Button, { onClick: handleReply, disabled: !reply.trim() || replyLoading, className: "w-full bg-gradient-primary hover:opacity-90 text-white flex items-center justify-center gap-2", children: [_jsx(Send, { className: "w-4 h-4" }), replyLoading ? 'Sending...' : 'Send Reply'] })] })] }) : _jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-gray-500", children: [_jsx(MessageSquare, { className: "w-12 h-12 mb-4 opacity-50" }), _jsx("p", { className: "text-lg font-medium", children: "No enquiry selected" }), _jsx("p", { className: "text-sm", children: "Select an enquiry from the list to view details" })] }) })] })] })] }) });
}
