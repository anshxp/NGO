import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/AdminLayout';
import { FileText, Download, Users, TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';

const reports = [
  { id: 'membership', label: 'Membership Report', description: 'Membership statistics', icon: Users, color: 'from-blue-500 to-blue-600' },
  { id: 'donations', label: 'Donation Report', description: 'Donation summary and details', icon: TrendingUp, color: 'from-green-500 to-green-600' },
  { id: 'projects', label: 'Project Report', description: 'Project fund allocation and usage', icon: Target, color: 'from-purple-500 to-purple-600' },
  { id: 'beneficiaries', label: 'Beneficiary Report', description: 'Beneficiary and help history', icon: Users, color: 'from-orange-500 to-orange-600' },
  { id: 'expenses', label: 'Expense Report', description: 'Category-wise expense breakdown', icon: DollarSign, color: 'from-red-500 to-red-600' },
  { id: 'campaigns', label: 'Campaign Report', description: 'Campaign performance and metrics', icon: BarChart3, color: 'from-indigo-500 to-indigo-600' },
  { id: 'income-expense', label: 'Income vs Expense Report', description: 'Financial totals and balance', icon: BarChart3, color: 'from-cyan-500 to-cyan-600' },
];

export default function AdminReports() {
  const [loadingReport, setLoadingReport] = useState('');
  const { toast } = useToast();

  const generateReport = async (reportType) => {
    setLoadingReport(reportType);
    try {
      const response = await fetch(`/api/admin/reports/${encodeURIComponent(reportType)}`, { method: 'GET', credentials: 'include', headers: { Accept: 'text/csv' } });
      if (!response.ok) {
        let message = `Report request failed (${response.status})`;
        try { const data = await response.json(); message = data.error || message; } catch (parseError) { console.debug('Report error response was not JSON', parseError); }
        throw new Error(message);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `ngo-${reportType}-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Report downloaded', description: 'The CSV report was downloaded successfully.' });
    } catch (error) {
      console.error('Report generation error:', error);
      toast({ title: 'Report failed', description: error.message || 'Unable to generate report.', variant: 'destructive' });
    } finally {
      setLoadingReport('');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header><h1 className="text-4xl font-bold">Report Management</h1><p className="mt-2 text-gray-600">Generate and download CSV reports.</p></header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map(({ id, label, description, icon: Icon, color }) => (
            <Card key={id} className="overflow-hidden border-0 shadow-lg">
              <CardHeader className={`bg-gradient-to-r ${color} text-white`}><div className="flex items-start justify-between gap-3"><div><CardTitle>{label}</CardTitle><CardDescription className="mt-1 text-white/90">{description}</CardDescription></div><Icon className="h-7 w-7 shrink-0" /></div></CardHeader>
              <CardContent className="pt-5"><Button onClick={() => void generateReport(id)} disabled={Boolean(loadingReport)} className="w-full"><Download className="mr-2 h-4 w-4" />{loadingReport === id ? 'Generating…' : 'Download CSV'}</Button></CardContent>
            </Card>
          ))}
        </div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Report notes</CardTitle></CardHeader><CardContent className="text-sm text-gray-600">Reports use current database records and download as CSV files that can be opened in spreadsheet software. Access is restricted to authenticated administrators.</CardContent></Card>
      </div>
    </AdminLayout>
  );
}
