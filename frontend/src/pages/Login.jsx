import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/admin'), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4 pt-20">
        <div className="w-full flex-auto my-24 max-w-xl">
          <Card className="border-0 flex flex-col py-16 justify-around shadow-xl">
            <CardHeader className="space-y-2">
              <div className="flex justify-center mb-4"><div className="bg-blue-100 p-3 rounded-lg"><Lock className="w-6 h-6 text-blue-600" /></div></div>
              <CardTitle className="text-center text-2xl">Admin Login</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-gap-2"><AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-red-700 ml-2">{error}</p></div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" />Email Address</Label><Input id="email" type="email" placeholder="admin@divysrishti.org" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="px-4 py-2" /></div>
                <div className="space-y-2"><Label htmlFor="password" className="flex items-center gap-2"><Lock className="w-4 h-4" />Password</Label><Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} className="px-4 py-2" /></div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-4">Contact your administrator if you need access.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
