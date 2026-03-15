import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { label: '📊 Dashboard', path: '/admin' },
        { label: '👥 Volunteers', path: '/admin/volunteers' },
        { label: '📩 Enquiries', path: '/admin/enquiries' },
        { label: '💬 Messages', path: '/admin/messages' },
        { label: '🤝 Beneficiaries', path: '/admin/beneficiaries' },
        { label: '📰 News', path: '/admin/news' },
        { label: '🧾 Receipts', path: '/admin/receipts' },
        { label: '📈 Reports', path: '/admin/reports' }
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-2xl transition-all duration-300 fixed h-screen overflow-y-auto`}>
                <div className="p-6">
                    {sidebarOpen && (
                        <>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                                    A
                                </div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">NGO Admin</h1>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">Management Portal</p>
                        </>
                    )}
                </div>

                <nav className="mt-8 space-y-1 px-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive(item.path)
                                    ? 'bg-gradient-primary text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            title={!sidebarOpen ? item.label : ''}
                        >
                            {sidebarOpen ? item.label : item.label.charAt(0)}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-3 right-3">
                    <Button
                        onClick={logout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        {sidebarOpen && 'Logout'}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Welcome, {user?.name}</h2>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
