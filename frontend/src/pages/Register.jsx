import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Mail, User, Phone, MapPin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { authAPI } from '@/lib/apiClient';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '', dateOfBirth: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        ...(formData.dateOfBirth ? { dateOfBirth: formData.dateOfBirth } : {}),
      });
      await login(formData.email, formData.password);
      toast.success('Registration successful.');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full flex-auto my-8 max-w-xl">
          <Card className="border-0 flex flex-col py-8 justify-around shadow-xl">
            <CardHeader className="space-y-2">
              <div className="flex justify-center mb-4"><div className="bg-blue-100 p-3 rounded-lg"><User className="w-6 h-6 text-blue-600" /></div></div>
              <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
              <CardDescription className="text-center">Join our community as a volunteer or donor</CardDescription>
            </CardHeader>
            <CardContent>
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start"><AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-red-700 ml-2">{error}</p></div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="name" className="flex items-center gap-2"><User className="w-4 h-4" />Full Name</Label><Input id="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required disabled={loading} className="px-4 py-2" /></div>
                <div className="space-y-2"><Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" />Email Address</Label><Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required disabled={loading} className="px-4 py-2" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="phone" className="flex items-center gap-2"><Phone className="w-4 h-4" />Phone Number</Label><Input id="phone" type="tel" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange} required disabled={loading} className="px-4 py-2" /></div>
                  <div className="space-y-2"><Label htmlFor="dateOfBirth" className="flex items-center gap-2"><User className="w-4 h-4" />Date of Birth</Label><Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} disabled={loading} className="px-4 py-2" /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="address" className="flex items-center gap-2"><MapPin className="w-4 h-4" />Address</Label><Input id="address" type="text" placeholder="Your address" value={formData.address} onChange={handleChange} disabled={loading} className="px-4 py-2" /></div>
                <div className="space-y-2"><Label htmlFor="password" className="flex items-center gap-2"><Lock className="w-4 h-4" />Password</Label><Input id="password" type="password" placeholder="At least 12 characters" value={formData.password} onChange={handleChange} minLength={12} required disabled={loading} className="px-4 py-2" /></div>
                <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating account...' : 'Create Account'}</Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-6">Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
