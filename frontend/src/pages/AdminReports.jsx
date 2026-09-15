import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/AdminLayout';
import { FileText, Download, Users, TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';
export default function AdminReports() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const generateReport = async (reportType) => {
        setLoading(true);
        try {
            // Get the auth token from localStorage
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast({
                    title: '❌ Error',
                    description: 'You are not authenticated. Please login again.',
                    variant: 'destructive'
                });
                setLoading(false);
                return;
            }
            const response = await fetch(`/api/admin/reports/${reportType}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
                a.click();
                toast({
                    title: '✅ Success',
                    description: `${reportType} report downloaded successfully`
                });
            }
            else {
                toast({
                    title: '❌ Error',
                    description: `Failed to generate report: ${response.statusText}`,
                    variant: 'destructive'
                });
            }
        }
        catch (error) {
            console.error('Report generation error:', error);
            toast({
                title: '❌ Error',
                description: 'Failed to generate report',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    const reportTypes = [
        { id: 'membership', label: 'Membership Report', description: 'Complete membership statistics', icon: Users, color: 'from-blue-500 to-blue-600' },
        { id: 'donations', label: 'Donation Report', description: 'Donation summary and details', icon: TrendingUp, color: 'from-green-500 to-green-600' },
        { id: 'projects', label: 'Project Report', description: 'Project fund allocation and usage', icon: Target, color: 'from-purple-500 to-purple-600' },
        { id: 'beneficiaries', label: 'Beneficiary Report', description: 'Beneficiary and help history', icon: Users, color: 'from-orange-500 to-orange-600' },
        { id: 'expenses', label: 'Expense Report', description: 'Category-wise expense breakdown', icon: DollarSign, color: 'from-red-500 to-red-600' },
        { id: 'campaigns', label: 'Campaign Report', description: 'Campaign performance and metrics', icon: BarChart3, color: 'from-indigo-500 to-indigo-600' }
    ];
    return (_jsx(AdminLayout, { children: _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold", children: "\uD83D\uDCCA Report Management" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Generate and download reports in PDF format" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: reportTypes.map((report) => {
                        const IconComponent = report.icon;
                        return (_jsxs(Card, { className: "border-0 shadow-lg hover:shadow-xl transition-all duration-300 group", children: [_jsx(CardHeader, { className: `bg-gradient-to-r ${report.color} text-white rounded-t-lg`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-xl", children: report.label }), _jsx(CardDescription, { className: "text-blue-100 mt-1", children: report.description })] }), _jsx(IconComponent, { className: "w-8 h-8 opacity-80" })] }) }), _jsx(CardContent, { className: "pt-6", children: _jsxs(Button, { onClick: () => generateReport(report.id), disabled: loading, className: "w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white transition-all", children: [_jsx(Download, { className: "w-4 h-4 mr-2" }), loading ? 'Generating...' : 'Download'] }) })] }, report.id));
                    }) }), _jsxs(Card, { className: "border-0 shadow-lg", children: [_jsx(CardHeader, { className: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-t-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(BarChart3, { className: "w-6 h-6" }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-2xl", children: "\uD83D\uDCB0 Income vs Expense Report" }), _jsx(CardDescription, { className: "text-blue-100 mt-1", children: "Monthly financial overview" })] })] }) }), _jsx(CardContent, { className: "pt-8", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-200", children: [_jsx("p", { className: "text-gray-700 font-medium mb-4", children: "\uD83D\uDCC8 This report provides a comprehensive view of your organization's income and expenses month by month." }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Includes:" }), _jsxs("ul", { className: "list-disc list-inside text-gray-700 mt-2 space-y-1", children: [_jsx("li", { children: "Monthly totals" }), _jsx("li", { children: "Year-to-date" })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Benefits:" }), _jsxs("ul", { className: "list-disc list-inside text-gray-700 mt-2 space-y-1", children: [_jsx("li", { children: "Trend analysis" }), _jsx("li", { children: "Budget tracking" })] })] })] })] }), _jsxs(Button, { onClick: () => generateReport('income-expense'), disabled: loading, className: "w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white h-12 text-base", children: [_jsx(Download, { className: "w-5 h-5 mr-2" }), loading ? 'Generating...' : 'Generate Income vs Expense Report'] })] }) })] }), _jsxs(Card, { className: "border-l-4 border-l-blue-500 bg-blue-50", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "w-5 h-5 text-blue-600" }), "\uD83D\uDCCB Report Generation Tips"] }) }), _jsx(CardContent, { children: _jsxs("ul", { className: "space-y-2 text-sm text-gray-700", children: [_jsx("li", { children: "\u2713 Reports are generated in PDF format for easy sharing" }), _jsx("li", { children: "\u2713 Each report includes detailed breakdowns and summaries" }), _jsx("li", { children: "\u2713 Reports are timestamped with generation date" }), _jsx("li", { children: "\u2713 Download to your device for offline access" })] }) })] })] }) }));
}
