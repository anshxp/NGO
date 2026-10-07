import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '@/lib/apiClient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e) => { e.preventDefault(); setLoading(true); try { const r=await authAPI.forgotPassword(email.trim().toLowerCase()); setStatus(r.data?.message || 'If the account exists, a reset email has been sent.'); } finally { setLoading(false); } };
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4"><form onSubmit={submit} className="max-w-md w-full bg-white rounded-xl shadow p-8 space-y-4"><h1 className="text-2xl font-semibold">Forgot Password</h1><p className="text-sm text-gray-600">Enter your email. For privacy, the response is the same whether an account exists.</p><input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><button className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-50" disabled={loading}>{loading?'Sending...':'Send reset link'}</button>{status&&<p className="text-sm text-gray-600">{status}</p>}<Link className="text-blue-600 hover:underline" to="/login">Back to login</Link></form></div>;
};
export default ForgotPassword;
