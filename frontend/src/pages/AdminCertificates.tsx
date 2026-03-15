import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { gql } from '@/lib/graphqlClient';

interface Certificate {
    id: string;
    certificateId: string;
    title: string;
    description: string;
    recipientName: string;
    recipientEmail: string;
    issueDate: string;
    verificationCode: string;
    isVerified: boolean;
}

export default function AdminCertificates() {
    const form = useForm();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [certificates, setCertificates] = useState<Certificate[]>([]);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        const query = `
            query GetCertificates {
                getCertificates {
                    id
                    certificateId
                    title
                    description
                    recipientName
                    recipientEmail
                    issueDate
                    verificationCode
                    isVerified
                }
            }
        `;
        try {
            const token = localStorage.getItem('token');
            const result: any = await gql(query, {}, token || undefined);
            const data = result.getCertificates.map((c: any) => ({ ...c, id: c.id || c._id }));
            setCertificates(data);
        } catch (error) {
            console.error('Error fetching certificates:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch certificates',
                variant: 'destructive'
            });
        }
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        const mutation = `
            mutation IssueCertificate(
                $recipientId: String!
                $recipientName: String!
                $recipientEmail: String!
                $title: String!
                $description: String
            ) {
                issueCertificate(
                    recipientId: $recipientId
                    recipientName: $recipientName
                    recipientEmail: $recipientEmail
                    title: $title
                    description: $description
                ) {
                    id
                    success
                    message
                }
            }
        `;

        try {
            const token = localStorage.getItem('token');
            // We need a recipientId. For now, we can use email or a generated ID if not selecting existing user
            // Ideally this should select from Users context.
            // Simplified: User inputs ID or we generate a dummy one if manual
            const variables = {
                ...data,
                recipientId: `MANUAL-${Date.now()}`
            };

            await gql(mutation, variables, token || undefined);

            toast({ title: 'Success', description: 'Certificate issued successfully' });
            form.reset();
            fetchCertificates();
        } catch (error) {
            console.error('Issue certificate error', error);
            toast({
                title: 'Error',
                description: 'Failed to issue certificate',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manage Certificates</h1>
                <p className="text-gray-600">Issue and track certificates</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Issue Certificate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="recipientName"
                                    rules={{ required: 'Recipient Name is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Recipient Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Recipient Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="recipientEmail"
                                    rules={{ required: 'Recipient Email is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Recipient Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="email@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="title"
                                    rules={{ required: 'Title is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Certificate Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Volunteer of the Year" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Certificate details" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? 'Issuing...' : 'Issue Certificate'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Certificates List</CardTitle>
                        <CardDescription>Total: {certificates.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {certificates.map((cert) => (
                                <div key={cert.id} className="p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">{cert.title}</h3>
                                        <p className="text-sm text-gray-600">To: {cert.recipientName} ({cert.recipientEmail})</p>
                                        <p className="text-xs text-gray-500">ID: {cert.certificateId}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-2 py-1 rounded ${cert.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                            {cert.isVerified ? 'Verified' : 'Unverified'}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(cert.issueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
