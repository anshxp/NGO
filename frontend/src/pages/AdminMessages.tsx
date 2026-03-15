import React, { useState, useEffect } from 'react';
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

    const onSubmit = async (data: any) => {
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
        } catch (error) {
            toast({
                title: '❌ Error',
                description: 'Failed to send message',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">💬 Send Messages</h1>
                    <p className="text-gray-600">Send notifications and messages to members directly to their dashboard and email</p>
                </div>

                {/* Main Card */}
                <Card className="border-0 shadow-lg max-w-2xl">
                    <CardHeader className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-primary rounded-lg">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">New Message</CardTitle>
                                <CardDescription>Messages will be emailed and shown in member dashboard</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Send to All Checkbox */}
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <FormField
                                        control={form.control}
                                        name="sendToAll"
                                        render={() => (
                                            <FormItem className="flex items-center space-x-3">
                                                <Checkbox
                                                    checked={sendToAll}
                                                    onCheckedChange={(checked) => setSendToAll(checked as boolean)}
                                                    className="w-5 h-5"
                                                />
                                                <div>
                                                    <FormLabel className="cursor-pointer font-semibold text-gray-900 flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        Send to all members
                                                    </FormLabel>
                                                    <p className="text-xs text-gray-600 mt-1">Check this to send to every member at once</p>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Recipient Selection */}
                                {!sendToAll && (
                                    <FormField
                                        control={form.control}
                                        name="recipientId"
                                        rules={{ required: sendToAll ? false : 'Select a member' }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">📧 Select Member</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Search member by name or email..." 
                                                        {...field}
                                                        className="h-10"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {/* Message Title */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    rules={{ required: 'Title is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">📝 Message Subject</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="e.g., Important Update, New Event, etc." 
                                                    {...field}
                                                    className="h-10"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Message Content */}
                                <FormField
                                    control={form.control}
                                    name="content"
                                    rules={{ required: 'Message is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">💭 Message Content</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Type your message here... Keep it clear and professional."
                                                    className="min-h-40 resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="w-full h-11 bg-gradient-primary hover:opacity-90 text-white font-semibold flex items-center justify-center gap-2 text-base"
                                >
                                    <Send className="w-5 h-5" />
                                    {loading ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Info Box */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-cyan-50 to-blue-50 max-w-2xl">
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            <p className="font-semibold text-gray-900">💡 Tips for Effective Messages:</p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                <li>Keep messages concise and clear</li>
                                <li>Use a specific subject line</li>
                                <li>Messages will be sent via email and appear in member dashboard</li>
                                <li>You can target individual members or broadcast to all</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
