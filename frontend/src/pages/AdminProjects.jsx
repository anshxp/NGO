import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { projectAPI } from '@/lib/apiClient';
export default function AdminProjects() {
    const form = useForm();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const fetchProjects = useCallback(async () => {
        try {
            const response = await projectAPI.getProjects();
            const list = response.data?.projects || response.data || [];
            setProjects(list.map((p) => ({ ...p, id: p.id || p._id })));
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            toast({ title: 'Error', description: 'Failed to fetch projects', variant: 'destructive' });
        }
    }, [toast]);
    useEffect(() => { void fetchProjects(); }, [fetchProjects]);
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await projectAPI.createProject({ ...data, title: data.title.trim(), description: data.description.trim(), objective: data.objective?.trim(), totalBudget: Number(data.totalBudget) });
            toast({ title: 'Success', description: 'Project created successfully' });
            form.reset();
            await fetchProjects();
        }
        catch (error) {
            console.error('Create project error', error);
            toast({ title: 'Error', description: error.response?.data?.error || 'Failed to create project', variant: 'destructive' });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Manage Projects" }), _jsx("p", { className: "text-gray-600", children: "Track and manage NGO projects" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-1", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Create Project" }) }), _jsx(CardContent, { children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "title", rules: { required: 'Title is required' }, render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Title" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Project title", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "description", rules: { required: 'Description is required' }, render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Description" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Project description", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "objective", render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Objective (Optional)" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Project objective", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "totalBudget", rules: { required: 'Budget is required' }, render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Total Budget (\u20B9)" }), _jsx(FormControl, { children: _jsx(Input, { type: "number", min: "0", step: "0.01", placeholder: "0.00", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(FormField, { control: form.control, name: "endDate", render: ({ field }) => _jsxs(FormItem, { children: [_jsx(FormLabel, { children: "End Date (Optional)" }), _jsx(FormControl, { children: _jsx(Input, { type: "date", ...field }) }), _jsx(FormMessage, {})] }) }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full", children: loading ? 'Creating...' : 'Create Project' })] }) }) })] }), _jsxs(Card, { className: "lg:col-span-2", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Projects List" }), _jsxs(CardDescription, { children: ["Total: ", projects.length] })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: projects.map((project) => _jsxs("div", { className: "p-3 border rounded-lg hover:bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium", children: project.title }), _jsx("p", { className: "text-sm text-gray-600", children: project.projectId })] }), _jsx("span", { className: "text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded", children: project.status })] }), _jsxs("div", { className: "grid grid-cols-2 mt-2 gap-2 text-xs text-gray-700", children: [_jsxs("p", { children: ["Budget: \u20B9", Number(project.totalBudget || 0).toLocaleString()] }), _jsxs("p", { children: ["Received: \u20B9", Number(project.fundsReceived || 0).toLocaleString()] })] })] }, project.id)) }) })] })] })] }));
}
