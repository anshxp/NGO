import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '@/lib/apiClient';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('Verifying...');
  useEffect(() => {
    const token = params.get('token');
    if (!token) return setStatus('Verification link is missing.');
    authAPI.verifyEmail(token).then(() => setStatus('Email verified successfully. You can now sign in.')).catch((err) => setStatus(err.response?.data?.error || 'Verification failed.'));
  }, [params]);
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4"><div className="max-w-md w-full bg-white rounded-xl shadow p-8 text-center"><h1 className="text-2xl font-semibold mb-4">Email Verification</h1><p className="text-gray-600 mb-6">{status}</p><Link className="text-blue-600 hover:underline" to="/login">Go to login</Link></div></div>;
};
export default VerifyEmail;
