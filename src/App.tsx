import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donor-registration" element={<DonorRegistration />} />
          <Route path="/blood-request" element={<BloodRequest />} />
          <Route path="/patient-portal" element={<PatientPortal />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/hospital-portal" element={<HospitalPortal />} />
          <Route path="/donor-portal" element={<DonorPortal />} />
          <Route path="/emergency-requests" element={<EmergencyRequests />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
