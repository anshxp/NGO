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
import { Newspaper, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export default function AdminNews() {
    const form = useForm();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState([]);
    useEffect(() => {
        fetchNews();
    }, []);
    const fetchNews = async () => {
        try {
            const response = await fetch('/api/admin/news');
            const data = await response.json();
            setNews(data);
        }
        catch (error) {
            console.error('Error fetching news:', error);
        }
    };
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                toast({ title: '✅ Success', description: 'News created successfully' });
                form.reset();
                fetchNews();
            }
        }
        catch (error) {
            toast({
                title: '❌ Error',
                description: 'Failed to create news',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handlePublish = async (newsId) => {
        try {
            const response = await fetch(`/api/admin/news/${newsId}/publish`, {
                method: 'POST'
            });
            if (response.ok) {
                toast({ title: '✅ Success', description: 'News published' });
                fetchNews();
            }
        }
        catch (error) {
            toast({
                title: '❌ Error',
                description: 'Failed to publish',
                variant: 'destructive'
            });
        }
    };
    const handleDelete = async (newsId) => {
        if (!confirm('Delete this news?'))
            return;
        try {
            const response = await fetch(`/api/admin/news/${newsId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                toast({ title: '✅ Success', description: 'News deleted' });
                fetchNews();
            }
        }
        catch (error) {
            toast({
                title: '❌ Error',
                description: 'Failed to delete',
                variant: 'destructive'
            });
        }
    };
    const publishedCount = news.filter(n => n.status === 'published').length;
    const draftCount = news.filter(n => n.status === 'draft').length;
    return (_jsx(AdminLayout, { children: _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold", children: "\uD83D\uDCF0 Manage News" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Create and publish news for your website" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total News" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: news.length })] }), _jsx(Newspaper, { className: "w-12 h-12 text-blue-300" })] }) }) }), _jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Published" }), _jsx("p", { className: "text-3xl font-bold text-green-600", children: publishedCount })] }), _jsx(CheckCircle, { className: "w-12 h-12 text-green-300" })] }) }) }), _jsx(Card, { className: "border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Drafts" }), _jsx("p", { className: "text-3xl font-bold text-orange-600", children: draftCount })] }), _jsx(Clock, { className: "w-12 h-12 text-orange-300" })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-1 border-0 shadow-lg", children: [_jsx(CardHeader, { className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Plus, { className: "w-5 h-5" }), _jsx(CardTitle, { children: "Create News" })] }) }), _jsx(CardContent, { className: "pt-6", children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "title", rules: { required: 'Title is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "flex items-center gap-2", children: "\uD83D\uDCCC Title" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "News title", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "excerpt", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "flex items-center gap-2", children: "\u270F\uFE0F Excerpt" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Short description", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "content", rules: { required: 'Content is required' }, render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "flex items-center gap-2", children: "\uD83D\uDCDD Content" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "News content", className: "min-h-32", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs(Button, { type: "submit", disabled: loading, className: "w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), loading ? 'Creating...' : 'Create News'] })] }) }) })] }), _jsxs(Card, { className: "lg:col-span-2 border-0 shadow-lg", children: [_jsx(CardHeader, { className: "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg", children: _jsxs("div", { className: "flex items-center gap-3 justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Newspaper, { className: "w-5 h-5" }), _jsx(CardTitle, { children: "Recent News" })] }), _jsxs(Badge, { className: "bg-white text-green-600", children: [news.length, " Total"] })] }) }), _jsx(CardContent, { className: "pt-6", children: news.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Newspaper, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "No news published yet" })] })) : (_jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: news.map((item) => (_jsxs("div", { className: "p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsx("div", { className: "flex-1", children: _jsx("h3", { className: "font-semibold text-lg text-gray-800", children: item.title }) }), _jsx(Badge, { className: item.status === 'published' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white', children: item.status === 'published' ? '✓ Published' : '⏱ Draft' })] }), _jsx("p", { className: "text-sm text-gray-600 mb-3 line-clamp-2", children: item.excerpt || item.content }), _jsxs("div", { className: "flex gap-2", children: [item.status === 'draft' && (_jsxs(Button, { size: "sm", className: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white", onClick: () => handlePublish(item._id), children: [_jsx(CheckCircle, { className: "w-4 h-4 mr-1" }), "Publish"] })), _jsxs(Button, { size: "sm", variant: "destructive", onClick: () => handleDelete(item._id), children: [_jsx(Trash2, { className: "w-4 h-4 mr-1" }), "Delete"] })] })] }, item._id))) })) })] })] })] }) }));
}
