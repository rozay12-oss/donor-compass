import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { EmergencyNotificationSystem } from "@/components/EmergencyNotificationSystem";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import DonorRegistration from "./pages/DonorRegistration";
import BloodRequest from "./pages/BloodRequest";
import PatientPortal from "./pages/PatientPortal";
import AdminDashboard from "./pages/AdminDashboard";
import HospitalPortal from "./pages/HospitalPortal";
import DonorPortal from "./pages/DonorPortal";
import EmergencyRequests from "./pages/EmergencyRequests";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import MyRequests from "./pages/MyRequests";
import { ScheduleDonation } from "./pages/ScheduleDonation";
import ProcessBloodRequests from "./pages/ProcessBloodRequests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <EmergencyNotificationSystem />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/donor-registration" element={<ProtectedRoute><DonorRegistration /></ProtectedRoute>} />
            <Route path="/blood-request" element={<ProtectedRoute><BloodRequest /></ProtectedRoute>} />
            <Route path="/patient-portal" element={<ProtectedRoute><PatientPortal /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/hospital-portal" element={<ProtectedRoute><HospitalPortal /></ProtectedRoute>} />
            <Route path="/donor-portal" element={<ProtectedRoute><DonorPortal /></ProtectedRoute>} />
            <Route path="/emergency-requests" element={<ProtectedRoute><EmergencyRequests /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
            <Route path="/schedule-donation" element={<ProtectedRoute><ScheduleDonation /></ProtectedRoute>} />
            <Route path="/process-blood-requests" element={<ProtectedRoute><ProcessBloodRequests /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
