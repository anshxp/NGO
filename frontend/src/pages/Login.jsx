import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { authAPI } from '@/lib/apiClient';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const finishLogin = () => { toast.success('Login successful.'); setTimeout(() => navigate('/admin'), 300); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password, mfaCode);
      if (data?.mfaRequired) return;
      finishLogin();
    } catch (err) {
      const data = err.response?.data || {};
      if (data.mfaSetupRequired && data.setupToken) {
        setSetupToken(data.setupToken);
        try {
          const setup = await authAPI.mfaSetup(data.setupToken);
          setSetupSecret(setup.data.secret);
          setMode('mfa-setup');
          setError('');
        } catch (setupError) { setError(setupError.response?.data?.error || 'Unable to start MFA setup.'); }
      } else if (data.mfaRequired) {
        setMode('mfa-login');
        setError('Enter the 6-digit code from your authenticator app.');
      } else if (data.emailVerificationRequired) {
        setMode('verification');
        setError('Verify your email address before signing in.');
      } else {
        setError(data.error || err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmMfa = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.mfaConfirm(setupToken, mfaCode);
      if (response.data?.user) { toast.success('MFA enabled.'); navigate('/admin'); }
    } catch (err) { setError(err.response?.data?.error || 'Invalid authenticator code.'); }
    finally { setLoading(false); }
  };

  const resendVerification = async () => {
    setLoading(true);
    try { await authAPI.resendVerification(email); toast.success('If the account needs verification, a new email has been sent.'); }
    catch (_err) { toast.error('Unable to request verification email.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4 pt-20">
        <div className="w-full my-24 max-w-xl">
          <Card className="border-0 shadow-xl py-8">
            <CardHeader className="space-y-2">
              <div className="flex justify-center mb-4"><div className="bg-blue-100 p-3 rounded-lg"><Lock className="w-6 h-6 text-blue-600" /></div></div>
              <CardTitle className="text-center text-2xl">{mode === 'mfa-setup' ? 'Secure Admin Account' : 'Admin Login'}</CardTitle>
              <CardDescription className="text-center">
                {mode === 'mfa-setup' ? 'MFA is required for administrator accounts.' : 'Enter your credentials to access the admin dashboard'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start"><AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-red-700 ml-2">{error}</p></div>}

              {mode === 'mfa-setup' ? (
                <form onSubmit={confirmMfa} className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4 text-sm">Add this secret to Google Authenticator, Microsoft Authenticator, Authy, or another TOTP app:<div className="font-mono break-all mt-2">{setupSecret}</div></div>
                  <div className="space-y-2"><Label htmlFor="mfaCode">Authenticator code</Label><Input id="mfaCode" inputMode="numeric" maxLength={6} value={mfaCode} onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))} required disabled={loading} /></div>
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Confirming...' : 'Enable MFA and Continue'}</Button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" />Email Address</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} /></div>
                  <div className="space-y-2"><Label htmlFor="password" className="flex items-center gap-2"><Lock className="w-4 h-4" />Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={12} required disabled={loading} /></div>
                  {(mode === 'mfa-login') && <div className="space-y-2"><Label htmlFor="mfaCode" className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" />MFA code</Label><Input id="mfaCode" inputMode="numeric" maxLength={6} value={mfaCode} onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))} required disabled={loading} /></div>}
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Authenticating...' : 'Login'}</Button>
                  {mode === 'verification' && <Button type="button" variant="outline" className="w-full" onClick={resendVerification} disabled={loading}>Resend verification email</Button>}
                  <a href="/forgot-password" className="block text-center text-sm text-blue-600 hover:underline">Forgot password?</a>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
