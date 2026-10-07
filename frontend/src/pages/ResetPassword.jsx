import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/apiClient';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setStatus('Passwords do not match.');
    setLoading(true); setStatus('');
    try { await authAPI.resetPassword(params.get('token'), password); setStatus('Password reset successfully.'); setTimeout(() => navigate('/login'), 1000); }
    catch (err) { setStatus(err.response?.data?.error || 'Password reset failed.'); }
    finally { setLoading(false); }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4"><form onSubmit={submit} className="max-w-md w-full bg-white rounded-xl shadow p-8 space-y-4"><h1 className="text-2xl font-semibold">Reset Password</h1><input className="w-full border rounded px-3 py-2" type="password" minLength={12} placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} required/><input className="w-full border rounded px-3 py-2" type="password" minLength={12} placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/><button className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-50" disabled={loading}>{loading?'Resetting...':'Reset password'}</button>{status&&<p className="text-sm text-gray-600">{status}</p>}<Link className="text-blue-600 hover:underline" to="/login">Back to login</Link></form></div>;
};
export default ResetPassword;
