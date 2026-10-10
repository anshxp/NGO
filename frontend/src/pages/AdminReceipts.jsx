import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/AdminLayout';
import { FileText, Download, Search, DollarSign, TrendingUp } from 'lucide-react';
import { receiptAPI } from '@/lib/apiClient';

export default function AdminReceipts() {
  const [receipts, setReceipts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await receiptAPI.getReceipts();
      setReceipts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to load receipts. Check the API and database connection.';
      setError(message);
      toast({ title: 'Could not load receipts', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { void fetchReceipts(); }, [fetchReceipts]);

  const filteredReceipts = useMemo(() => receipts.filter((receipt) => {
    const typeMatches = filterType === 'all' || receipt.receiptType === filterType;
    const idMatches = String(receipt.receiptId || '').toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatches && idMatches;
  }), [receipts, searchTerm, filterType]);

  const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + (Number(receipt.amount) || 0), 0);
  const donationCount = filteredReceipts.filter((receipt) => receipt.receiptType === 'donation').length;
  const typeColors = { membership: 'bg-blue-100 text-blue-800', donation: 'bg-green-100 text-green-800', event: 'bg-purple-100 text-purple-800', cash_donation: 'bg-orange-100 text-orange-800' };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header><h1 className="text-4xl font-bold">Receipt Management</h1><p className="mt-2 text-gray-600">View and manage receipts issued by the organisation.</p></header>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card><CardContent className="flex items-center justify-between p-6"><div><p className="text-sm text-gray-600">Total receipts</p><p className="text-3xl font-bold">{filteredReceipts.length}</p></div><FileText className="h-10 w-10 text-blue-500" /></CardContent></Card>
          <Card><CardContent className="flex items-center justify-between p-6"><div><p className="text-sm text-gray-600">Total amount</p><p className="text-3xl font-bold">₹{totalAmount.toLocaleString('en-IN')}</p></div><DollarSign className="h-10 w-10 text-green-500" /></CardContent></Card>
          <Card><CardContent className="flex items-center justify-between p-6"><div><p className="text-sm text-gray-600">Donation receipts</p><p className="text-3xl font-bold">{donationCount}</p></div><TrendingUp className="h-10 w-10 text-orange-500" /></CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> Search and filter</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input aria-label="Search receipt ID" placeholder="Search receipt ID…" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <select aria-label="Receipt type" value={filterType} onChange={(event) => setFilterType(event.target.value)} className="rounded-md border border-gray-300 bg-white px-3 py-2">
              <option value="all">All types</option><option value="membership">Membership</option><option value="donation">Donation</option><option value="event">Event</option><option value="cash_donation">Cash donation</option>
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Receipts</CardTitle></CardHeader>
          <CardContent>
            {loading ? <p className="py-8 text-center text-gray-500">Loading receipts…</p> : error ? <div className="py-8 text-center"><p className="text-red-600">{error}</p><button className="mt-3 rounded bg-slate-900 px-4 py-2 text-white" onClick={() => void fetchReceipts()}>Retry</button></div> : filteredReceipts.length === 0 ? <p className="py-8 text-center text-gray-500">No receipts match these filters.</p> : (
              <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b bg-gray-50 text-left"><th className="p-3">Receipt ID</th><th className="p-3">Type</th><th className="p-3">Amount</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">PDF</th></tr></thead>
                <tbody>{filteredReceipts.map((receipt) => <tr key={receipt._id || receipt.receiptId} className="border-b"><td className="p-3 font-medium">{receipt.receiptId}</td><td className="p-3"><Badge className={typeColors[receipt.receiptType] || 'bg-gray-100 text-gray-800'}>{String(receipt.receiptType || 'unknown').replace('_', ' ')}</Badge></td><td className="p-3">₹{(Number(receipt.amount) || 0).toLocaleString('en-IN')}</td><td className="p-3">{receipt.date ? new Date(receipt.date).toLocaleDateString('en-IN') : '—'}</td><td className="p-3">{receipt.status || '—'}</td><td className="p-3">{receipt.pdfUrl ? <a href={receipt.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-700 underline"><Download className="h-4 w-4" /> View PDF</a> : '—'}</td></tr>)}</tbody>
              </table></div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
