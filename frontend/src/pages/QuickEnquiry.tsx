import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { gql } from '@/lib/graphqlClient';

interface EnquiryFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export default function Enquiry() {
    const form = useForm<EnquiryFormData>();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: EnquiryFormData) => {
        setLoading(true);
        console.log('📝 Submitting enquiry form:', data);
        try {
            const mutation = `
                mutation SubmitEnquiry($name: String!, $email: String!, $phone: String!, $subject: String!, $message: String!) {
                    submitEnquiry(name: $name, email: $email, phone: $phone, subject: $subject, message: $message) {
                        success
                        message
                    }
                }
            `;

            const result = await gql(mutation, data);
            console.log('✅ Enquiry submitted successfully:', result);

            if (result.submitEnquiry?.success) {
                toast({
                    title: 'Success',
                    description: 'Your enquiry has been submitted successfully!',
                });
                form.reset();
            }
        } catch (error: any) {
            console.error('❌ Error submitting enquiry:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to submit enquiry',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Enquiry</CardTitle>
                        <CardDescription>Have a question? Get in touch with us</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    rules={{ required: 'Name is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    rules={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+$/, message: 'Invalid email' } }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="your@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    rules={{ required: 'Phone is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+91 XXXXX XXXXX" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subject"
                                    rules={{ required: 'Subject is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl>
                                                <Input placeholder="What is this about?" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="message"
                                    rules={{ required: 'Message is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us more about your enquiry..."
                                                    className="min-h-32"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? 'Submitting...' : 'Submit Enquiry'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
