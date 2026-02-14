import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ComplaintsProvider } from "@/contexts/ComplaintsContext";

// Layouts
import CitizenLayout from "@/layouts/CitizenLayout";

// Pages
import Login from "@/pages/Login";
import CitizenHome from "@/pages/citizen/CitizenHome";
import RegisterComplaint from "@/pages/citizen/RegisterComplaint";
import MyComplaints from "@/pages/citizen/MyComplaints";
import CitizenProfile from "@/pages/citizen/CitizenProfile";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

import ProfileSetup from "@/pages/citizen/ProfileSetup";

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'citizen' | 'admin' }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Admin doesn't need profile setup
  if (user?.role === 'admin') {
    if (role && role !== 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <>{children}</>;
  }

  // Allow access to profile-setup even if not verified
  const isProfileSetupPage = window.location.pathname === '/citizen/profile-setup';

  if (user && !user.isProfileComplete && !isProfileSetupPage) {
    return <Navigate to="/citizen/profile-setup" replace />;
  }

  // Don't block unverified users from profile-setup page
  if (user && !user.isVerified && !isProfileSetupPage && window.location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  // At this point, user is a citizen (admins returned early above)
  if (role && user?.role !== role) {
    return <Navigate to="/citizen" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? (user?.role === 'admin'
                ? <Navigate to="/admin" replace />
                : !user?.isProfileComplete
                  ? <Navigate to="/citizen/profile-setup" replace />
                  : user?.isVerified
                    ? <Navigate to="/citizen" replace />
                    : <Login />)
            : <Login />
        } 
      />

      {/* Citizen Profile Setup */}
      <Route 
        path="/citizen/profile-setup" 
        element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        } 
      />

      {/* Citizen Routes */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute role="citizen">
            <CitizenLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CitizenHome />} />
        <Route path="register" element={<RegisterComplaint />} />
        <Route path="complaints" element={<MyComplaints />} />
        <Route path="profile" element={<CitizenProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ComplaintsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ComplaintsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
