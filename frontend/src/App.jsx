import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Impact from "./pages/Impact";
import GetInvolved from "./pages/GetInvolved";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import Campaigns from "./pages/Campaigns";
import ActivityFeed from "./pages/ActivityFeed";
import Membership from "./pages/Membership";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVolunteers from "./pages/AdminVolunteers";
import AdminEnquiries from "./pages/AdminEnquiries";
import AdminMessages from "./pages/AdminMessages";
import AdminBeneficiaries from "./pages/AdminBeneficiaries";
import AdminNews from "./pages/AdminNews";
import AdminReceipts from "./pages/AdminReceipts";
import AdminReports from "./pages/AdminReports";
import AdminProjects from "./pages/AdminProjects";
import AdminCertificates from "./pages/AdminCertificates";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" /><p className="text-gray-600">Loading...</p></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const roleHome = user?.role === 'admin' ? '/admin' : '/volunteer';
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to={roleHome} replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/activities" element={<ActivityFeed />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/volunteer" element={<ProtectedRoute allowedRoles={["volunteer"]}><VolunteerDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/volunteers" element={<ProtectedRoute allowedRoles={["admin"]}><AdminVolunteers /></ProtectedRoute>} />
            <Route path="/admin/enquiries" element={<ProtectedRoute allowedRoles={["admin"]}><AdminEnquiries /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute allowedRoles={["admin"]}><AdminMessages /></ProtectedRoute>} />
            <Route path="/admin/beneficiaries" element={<ProtectedRoute allowedRoles={["admin"]}><AdminBeneficiaries /></ProtectedRoute>} />
            <Route path="/admin/news" element={<ProtectedRoute allowedRoles={["admin"]}><AdminNews /></ProtectedRoute>} />
            <Route path="/admin/receipts" element={<ProtectedRoute allowedRoles={["admin"]}><AdminReceipts /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["admin"]}><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute allowedRoles={["admin"]}><AdminProjects /></ProtectedRoute>} />
            <Route path="/admin/certificates" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCertificates /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
