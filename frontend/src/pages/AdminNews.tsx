import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    const [news, setNews] = useState<any[]>([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/api/admin/news');
            const data = await response.json();
            setNews(data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const onSubmit = async (data: any) => {
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
        } catch (error) {
            toast({
                title: '❌ Error',
                description: 'Failed to create news',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (newsId: string) => {
        try {
            const response = await fetch(`/api/admin/news/${newsId}/publish`, {
                method: 'POST'
            });

            if (response.ok) {
                toast({ title: '✅ Success', description: 'News published' });
                fetchNews();
            }
        } catch (error) {
            toast({
                title: '❌ Error',
                description: 'Failed to publish',
                variant: 'destructive'
            });
        }
    };

    const handleDelete = async (newsId: string) => {
        if (!confirm('Delete this news?')) return;
        try {
            const response = await fetch(`/api/admin/news/${newsId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast({ title: '✅ Success', description: 'News deleted' });
                fetchNews();
            }
        } catch (error) {
            toast({
                title: '❌ Error',
                description: 'Failed to delete',
                variant: 'destructive'
            });
        }
    };

    const publishedCount = news.filter(n => n.status === 'published').length;
    const draftCount = news.filter(n => n.status === 'draft').length;

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">📰 Manage News</h1>
                    <p className="text-gray-600 mt-2">Create and publish news for your website</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total News</p>
                                    <p className="text-3xl font-bold text-blue-600">{news.length}</p>
                                </div>
                                <Newspaper className="w-12 h-12 text-blue-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Published</p>
                                    <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
                                </div>
                                <CheckCircle className="w-12 h-12 text-green-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Drafts</p>
                                    <p className="text-3xl font-bold text-orange-600">{draftCount}</p>
                                </div>
                                <Clock className="w-12 h-12 text-orange-300" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Create Form */}
                    <Card className="lg:col-span-1 border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <Plus className="w-5 h-5" />
                                <CardTitle>Create News</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        rules={{ required: 'Title is required' }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">📌 Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="News title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="excerpt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">✏️ Excerpt</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Short description" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="content"
                                        rules={{ required: 'Content is required' }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">📝 Content</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="News content" className="min-h-32" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        {loading ? 'Creating...' : 'Create News'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* News List */}
                    <Card className="lg:col-span-2 border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                            <div className="flex items-center gap-3 justify-between">
                                <div className="flex items-center gap-3">
                                    <Newspaper className="w-5 h-5" />
                                    <CardTitle>Recent News</CardTitle>
                                </div>
                                <Badge className="bg-white text-green-600">{news.length} Total</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {news.length === 0 ? (
                                <div className="text-center py-12">
                                    <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No news published yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {news.map((item) => (
                                        <div key={item._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                                                </div>
                                                <Badge className={item.status === 'published' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'}>
                                                    {item.status === 'published' ? '✓ Published' : '⏱ Draft'}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.excerpt || item.content}</p>

                                            <div className="flex gap-2">
                                                {item.status === 'draft' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                                        onClick={() => handlePublish(item._id)}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Publish
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
