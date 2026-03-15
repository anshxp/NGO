import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/AdminLayout';
import { FileText, Download, Users, TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';

export default function AdminReports() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const generateReport = async (reportType: string) => {
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
            } else {
                toast({
                    title: '❌ Error',
                    description: `Failed to generate report: ${response.statusText}`,
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Report generation error:', error);
            toast({
                title: '❌ Error',
                description: 'Failed to generate report',
                variant: 'destructive'
            });
        } finally {
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

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">📊 Report Management</h1>
                    <p className="text-gray-600 mt-2">Generate and download reports in PDF format</p>
                </div>

                {/* Report Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportTypes.map((report) => {
                        const IconComponent = report.icon;
                        return (
                            <Card key={report.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <CardHeader className={`bg-gradient-to-r ${report.color} text-white rounded-t-lg`}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{report.label}</CardTitle>
                                            <CardDescription className="text-blue-100 mt-1">{report.description}</CardDescription>
                                        </div>
                                        <IconComponent className="w-8 h-8 opacity-80" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <Button
                                        onClick={() => generateReport(report.id)}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white transition-all"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        {loading ? 'Generating...' : 'Download'}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Income vs Expense Report Card */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-6 h-6" />
                            <div>
                                <CardTitle className="text-2xl">💰 Income vs Expense Report</CardTitle>
                                <CardDescription className="text-blue-100 mt-1">Monthly financial overview</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-200">
                                <p className="text-gray-700 font-medium mb-4">
                                    📈 This report provides a comprehensive view of your organization's income and expenses month by month.
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Includes:</p>
                                        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                                            <li>Monthly totals</li>
                                            <li>Year-to-date</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Benefits:</p>
                                        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                                            <li>Trend analysis</li>
                                            <li>Budget tracking</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={() => generateReport('income-expense')}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white h-12 text-base"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                {loading ? 'Generating...' : 'Generate Income vs Expense Report'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            📋 Report Generation Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>✓ Reports are generated in PDF format for easy sharing</li>
                            <li>✓ Each report includes detailed breakdowns and summaries</li>
                            <li>✓ Reports are timestamped with generation date</li>
                            <li>✓ Download to your device for offline access</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
