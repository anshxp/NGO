import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { enquiryAPI } from '@/lib/apiClient';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';

interface Enquiry { _id: string; id: string; name: string; email: string; phone: string; subject: string; message: string; status: string; reply?: string; created_at?: string; }

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [replyLoading, setReplyLoading] = useState(false);
    const { toast } = useToast();

    const fetchEnquiries = useCallback(async () => {
        try {
            const response = await enquiryAPI.getEnquiries();
            const list = response.data?.enquiries || response.data || [];
            setEnquiries(list.map((e: any) => ({ ...e, id: e.id || e._id, _id: e._id || e.id })));
        } catch (error) {
            console.error('Error fetching enquiries', error);
            toast({ title: 'Error', description: 'Failed to fetch enquiries', variant: 'destructive' });
        } finally { setLoading(false); }
    }, [toast]);

    useEffect(() => { void fetchEnquiries(); }, [fetchEnquiries]);

    const handleReply = async () => {
        if (!selectedEnquiry || !reply.trim()) return;
        setReplyLoading(true);
        try {
            await enquiryAPI.replyToEnquiry(selectedEnquiry.id, reply.trim());
            toast({ title: 'Success', description: 'Reply sent successfully' });
            setReply('');
            setSelectedEnquiry(null);
            await fetchEnquiries();
        } catch (error: any) {
            console.error('Reply error', error);
            toast({ title: 'Error', description: error.response?.data?.error || 'Failed to send reply', variant: 'destructive' });
        } finally { setReplyLoading(false); }
    };

    const statusConfig: { [key: string]: { color: string; icon: React.ReactNode; label: string } } = {
        new: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" />, label: 'New' },
        read: { color: 'bg-blue-100 text-blue-800', icon: <Mail className="w-4 h-4" />, label: 'Read' },
        replied: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Replied' },
        closed: { color: 'bg-gray-100 text-gray-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Closed' }
    };

    return <AdminLayout><div className="space-y-8">
        <div className="mb-8"><h1 className="text-4xl font-bold text-gray-900 mb-2">Enquiries Management</h1><p className="text-gray-600">Handle and respond to visitor enquiries</p></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[['Total Enquiries', enquiries.length, 'text-blue-600'], ['New', enquiries.filter(e => e.status === 'new').length, 'text-yellow-600'], ['Replied', enquiries.filter(e => e.status === 'replied').length, 'text-green-600'], ['Closed', enquiries.filter(e => e.status === 'closed').length, 'text-gray-600']].map(([label, value, color]) => <Card key={String(label)} className="border-0 shadow-lg"><CardContent className="pt-6"><div className="text-center"><p className={`text-3xl font-bold ${color}`}>{value}</p><p className="text-sm text-gray-600 mt-1">{label}</p></div></CardContent></Card>)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg lg:col-span-1"><CardHeader className="border-b border-gray-200 pb-4"><CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" />Enquiries List</CardTitle><CardDescription>{enquiries.length} total</CardDescription></CardHeader><CardContent className="pt-4"><div className="space-y-2 max-h-[600px] overflow-y-auto">{loading ? <p className="text-gray-500 text-center py-8">Loading...</p> : enquiries.length === 0 ? <p className="text-gray-500 text-center py-8">No enquiries yet</p> : enquiries.map((enquiry) => <button key={enquiry.id} onClick={() => setSelectedEnquiry(enquiry)} className={`w-full text-left p-4 rounded-lg border-2 transition duration-200 ${selectedEnquiry?.id === enquiry.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}><div className="flex justify-between items-start mb-2"><span className="font-semibold text-gray-900 truncate">{enquiry.name}</span><Badge className={statusConfig[enquiry.status]?.color || 'bg-gray-100'}>{statusConfig[enquiry.status]?.label || enquiry.status}</Badge></div><p className="text-sm text-gray-600 truncate">{enquiry.subject}</p><p className="text-xs text-gray-500 mt-1">{enquiry.email}</p></button>)}</div></CardContent></Card>
            <Card className="border-0 shadow-lg lg:col-span-2"><CardHeader className="border-b border-gray-200 pb-4"><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Enquiry Details</CardTitle></CardHeader><CardContent className="pt-6">{selectedEnquiry ? <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><p className="text-xs font-semibold text-gray-600 uppercase">Name</p><p className="font-semibold text-gray-900">{selectedEnquiry.name}</p></div><div><p className="text-xs font-semibold text-gray-600 uppercase">Email</p><p className="font-semibold text-gray-900 break-all">{selectedEnquiry.email}</p></div><div><p className="text-xs font-semibold text-gray-600 uppercase">Phone</p><p className="font-semibold text-gray-900">{selectedEnquiry.phone || '—'}</p></div><div><p className="text-xs font-semibold text-gray-600 uppercase">Status</p><Badge className={`${statusConfig[selectedEnquiry.status]?.color || 'bg-gray-100'} mt-1`}>{statusConfig[selectedEnquiry.status]?.label || selectedEnquiry.status}</Badge></div></div><div className="border-t pt-4"><p className="text-xs font-semibold text-gray-600 uppercase mb-2">Subject</p><p className="font-semibold text-gray-900">{selectedEnquiry.subject}</p></div><div className="bg-gray-50 p-4 rounded-lg border border-gray-200"><p className="text-xs font-semibold text-gray-600 uppercase mb-2">Message</p><p className="text-gray-700 whitespace-pre-wrap">{selectedEnquiry.message}</p></div>{selectedEnquiry.reply ? <div className="bg-green-50 p-4 rounded-lg border border-green-200"><p className="text-xs font-semibold text-green-700 uppercase mb-2">Reply</p><p className="text-gray-700 whitespace-pre-wrap">{selectedEnquiry.reply}</p></div> : <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-3"><p className="text-xs font-semibold text-yellow-700 uppercase">Send a Reply</p><Textarea placeholder="Type your reply here..." value={reply} onChange={(e) => setReply(e.target.value)} className="min-h-28 resize-none" /><Button onClick={handleReply} disabled={!reply.trim() || replyLoading} className="w-full bg-gradient-primary hover:opacity-90 text-white flex items-center justify-center gap-2"><Send className="w-4 h-4" />{replyLoading ? 'Sending...' : 'Send Reply'}</Button></div>}</div> : <div className="flex flex-col items-center justify-center py-16 text-gray-500"><MessageSquare className="w-12 h-12 mb-4 opacity-50" /><p className="text-lg font-medium">No enquiry selected</p><p className="text-sm">Select an enquiry from the list to view details</p></div>}</CardContent></Card>
        </div>
    </div></AdminLayout>;
}
