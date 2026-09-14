import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/lib/apiClient';

export default function MembershipRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', dateOfBirth: '', address: '', referralCode: '' });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    if (form.password.length < 12) {
      toast({ title: 'Password too short', description: 'Use at least 12 characters.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await authAPI.register({ ...form, referralCode: form.referralCode || undefined });
      toast({ title: 'Registration successful', description: 'Your account has been created. Membership is pending approval.' });
      navigate('/');
    } catch (error) {
      toast({ title: 'Registration failed', description: error.response?.data?.error || 'Unable to create your account.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen"><Navigation /><main className="py-16 px-4 bg-gray-50"><Card className="max-w-2xl mx-auto"><CardHeader><CardTitle>Become a Member</CardTitle><CardDescription>Create your member account. Membership remains pending until it is approved.</CardDescription></CardHeader><CardContent><form onSubmit={onSubmit} className="space-y-5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="name" className="text-sm font-medium">Full Name</label><Input id="name" name="name" value={form.name} onChange={update} required /></div><div><label htmlFor="email" className="text-sm font-medium">Email</label><Input id="email" name="email" type="email" value={form.email} onChange={update} required /></div></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="phone" className="text-sm font-medium">Phone</label><Input id="phone" name="phone" value={form.phone} onChange={update} required /></div><div><label htmlFor="password" className="text-sm font-medium">Password</label><Input id="password" name="password" type="password" minLength={12} value={form.password} onChange={update} required /></div></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</label><Input id="dateOfBirth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={update} /></div><div><label htmlFor="referralCode" className="text-sm font-medium">Referral Code (optional)</label><Input id="referralCode" name="referralCode" value={form.referralCode} onChange={update} /></div></div>
    <div><label htmlFor="address" className="text-sm font-medium">Address</label><Input id="address" name="address" value={form.address} onChange={update} /></div>
    <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Register as Member'}</Button>
  </form></CardContent></Card></main><Footer /></div>;
}
