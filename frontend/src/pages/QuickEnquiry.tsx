import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { enquiryAPI } from '@/lib/apiClient';

interface EnquiryFormData { name: string; email: string; phone: string; subject: string; message: string; }

export default function Enquiry() {
    const form = useForm<EnquiryFormData>({ defaultValues: { name: '', email: '', phone: '', subject: '', message: '' } });
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: EnquiryFormData) => {
        setLoading(true);
        try {
            const response = await enquiryAPI.submitEnquiry({ ...data, name: data.name.trim(), email: data.email.trim().toLowerCase(), phone: data.phone.trim(), subject: data.subject.trim(), message: data.message.trim() });
            if (response.data?.success !== false) {
                toast({ title: 'Success', description: 'Your enquiry has been submitted successfully!' });
                form.reset();
            }
        } catch (error: any) {
            toast({ title: 'Error', description: error.response?.data?.error || error.message || 'Failed to submit enquiry', variant: 'destructive' });
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader><CardTitle>Quick Enquiry</CardTitle><CardDescription>Have a question? Get in touch with us</CardDescription></CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField control={form.control} name="name" rules={{ required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } }} render={({ field }) => <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="email" rules={{ required: 'Email is required' }} render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="phone" render={({ field }) => <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="subject" rules={{ required: 'Subject is required' }} render={({ field }) => <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="Subject" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name="message" rules={{ required: 'Message is required', minLength: { value: 10, message: 'Message is too short' } }} render={({ field }) => <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea rows={6} placeholder="Your message" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <Button type="submit" disabled={loading} className="w-full">{loading ? 'Sending...' : 'Send Enquiry'}</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
