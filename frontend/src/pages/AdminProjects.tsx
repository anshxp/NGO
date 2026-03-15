import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { gql } from '@/lib/graphqlClient';

interface Project {
    id: string;
    projectId: string;
    title: string;
    description: string;
    objective?: string;
    totalBudget: number;
    fundsReceived: number;
    expenses: number;
    status: string;
}

export default function AdminProjects() {
    const form = useForm();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const query = `
            query GetProjects {
                getProjects {
                    id
                    projectId
                    title
                    description
                    objective
                    totalBudget
                    fundsReceived
                    expenses
                    status
                }
            }
        `;
        try {
            const token = localStorage.getItem('token');
            const result: any = await gql(query, {}, token || undefined);
            const data = result.getProjects.map((p: any) => ({ ...p, id: p.id || p._id }));
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch projects',
                variant: 'destructive'
            });
        }
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        const mutation = `
            mutation CreateProject(
                $title: String!
                $description: String!
                $objective: String
                $totalBudget: Float!
                $endDate: String
            ) {
                createProject(
                    title: $title
                    description: $description
                    objective: $objective
                    totalBudget: $totalBudget
                    endDate: $endDate
                ) {
                    id
                    success
                }
            }
        `;

        try {
            const token = localStorage.getItem('token');
            const variables = {
                ...data,
                totalBudget: parseFloat(data.totalBudget)
            };
            await gql(mutation, variables, token || undefined);

            toast({ title: 'Success', description: 'Project created successfully' });
            form.reset();
            fetchProjects();
        } catch (error) {
            console.error('Create project error', error);
            toast({
                title: 'Error',
                description: 'Failed to create project',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manage Projects</h1>
                <p className="text-gray-600">Track and manage NGO projects</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Create Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    rules={{ required: 'Title is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Project title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    rules={{ required: 'Description is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Project description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="objective"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Objective (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Project objective" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="totalBudget"
                                    rules={{ required: 'Budget is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Budget (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0.00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date (Optional)</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? 'Creating...' : 'Create Project'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Projects List</CardTitle>
                        <CardDescription>Total: {projects.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {projects.map((project) => (
                                <div key={project.id} className="p-3 border rounded-lg hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">{project.title}</h3>
                                            <p className="text-sm text-gray-600">{project.projectId}</p>
                                        </div>
                                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 mt-2 gap-2 text-xs text-gray-700">
                                        <p>Budget: ₹{project.totalBudget.toLocaleString()}</p>
                                        <p>Received: ₹{project.fundsReceived.toLocaleString()}</p>
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
