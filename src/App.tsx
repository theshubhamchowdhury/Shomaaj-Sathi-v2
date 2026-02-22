import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ComplaintsProvider } from "@/contexts/ComplaintsContext";
import Onboarding from "@/pages/citizen/Onboarding";

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

import { useLocation } from "react-router-dom";

function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "citizen" | "admin";
}) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Admin handling
  if (user?.role === "admin") {
    if (role && role !== "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <>{children}</>;
  }

  // Citizen onboarding check
  if (user && !user.language && location.pathname !== "/citizen/onboarding") {
    return <Navigate to="/citizen/onboarding" replace />;
  }

  // Profile setup check (but allow manual return to onboarding)
  if (
    user &&
    user.language &&
    !user.isProfileComplete &&
    location.pathname !== "/citizen/profile-setup" &&
    location.pathname !== "/citizen/onboarding"
  ) {
    return <Navigate to="/citizen/profile-setup" replace />;
  }

  // Verification check
  if (
    user &&
    user.isProfileComplete &&
    !user.isVerified &&
    location.pathname !== "/"
  ) {
    return <Navigate to="/" replace />;
  }

  // Role protection
  if (role && user?.role !== role) {
    return <Navigate to="/citizen" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  const language = user?.language ?? (typeof window !== 'undefined' ? localStorage.getItem('appLanguage') : null);

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? (user?.role === 'admin'
              ? <Navigate to="/admin" replace />
              : !language
                ? <Navigate to="/citizen/onboarding" replace />
                : !user?.isProfileComplete
                  ? <Navigate to="/citizen/profile-setup" replace />
                  : user?.isVerified
                    ? <Navigate to="/citizen" replace />
                    : <Login />)
            : <Login />
        }
      />

      {/* Onboarding Route */}
      <Route
        path="/citizen/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
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
