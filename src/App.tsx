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

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'citizen' | 'admin' }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/citizen'} replace />;
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
            ? <Navigate to={user?.role === 'admin' ? '/admin' : '/citizen'} replace />
            : <Login />
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
