import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CalendarDays, HeartHandshake, LogOut, UserRound } from 'lucide-react';

const VolunteerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const actions = [
    { title: 'Explore activities', description: 'See the latest work and community updates.', href: '/activities', icon: Activity },
    { title: 'Find opportunities', description: 'Explore programs and ways to contribute.', href: '/get-involved', icon: HeartHandshake },
    { title: 'Upcoming campaigns', description: 'Learn about current campaigns and initiatives.', href: '/campaigns', icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      <main className="flex-1 container mx-auto w-full max-w-6xl px-4 py-10">
        <section className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white md:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">Volunteer portal</p>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">Welcome, {user?.name || 'Volunteer'}</h1>
              <p className="mt-2 text-blue-100">Manage your account and find ways to support the community.</p>
            </div>
            <Button variant="secondary" onClick={handleLogout} className="gap-2 self-start sm:self-auto">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {actions.map(({ title, description, href, icon: Icon }) => (
            <Card key={title} className="border-0 shadow-sm">
              <CardHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate(href)}>Open</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" /> Account details</CardTitle>
            <CardDescription>Your authenticated volunteer account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div><p className="text-sm text-slate-500">Name</p><p className="font-medium">{user?.name || '—'}</p></div>
            <div><p className="text-sm text-slate-500">Email</p><p className="font-medium break-all">{user?.email || '—'}</p></div>
            <div><p className="text-sm text-slate-500">Role</p><p className="font-medium capitalize">{user?.role || 'volunteer'}</p></div>
            <div><p className="text-sm text-slate-500">Email verification</p><p className="font-medium">{user?.isEmailVerified ? 'Verified' : 'Pending'}</p></div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default VolunteerDashboard;
