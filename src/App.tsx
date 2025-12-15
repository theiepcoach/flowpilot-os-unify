import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";

// Marketing pages
import Home from "./pages/marketing/Home";
import Features from "./pages/marketing/Features";
import Pricing from "./pages/marketing/Pricing";
import Security from "./pages/marketing/Security";

// Auth
import Auth from "./pages/Auth";

// App pages
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import Billing from "./pages/Billing";
import AppSettings from "./pages/AppSettings";

// Module pages
import Leads from "./pages/Leads";
import Schedule from "./pages/Schedule";
import Finance from "./pages/Finance";
import Inbox from "./pages/Inbox";
import Automations from "./pages/Automations";
import Team from "./pages/Team";
import Marketing from "./pages/Marketing";
import Retention from "./pages/Retention";
import Proposals from "./pages/Proposals";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public marketing pages */}
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/security" element={<Security />} />
            
            {/* Auth */}
            <Route path="/auth" element={<Auth />} />
            
            {/* App shell (protected) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/app-settings" element={<ProtectedRoute><AppSettings /></ProtectedRoute>} />
            
            {/* Module pages (protected) */}
            <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
            <Route path="/automations" element={<AdminRoute><Automations /></AdminRoute>} />
            <Route path="/team" element={<AdminRoute><Team /></AdminRoute>} />
            <Route path="/marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
            <Route path="/retention" element={<ProtectedRoute><Retention /></ProtectedRoute>} />
            <Route path="/proposals" element={<ProtectedRoute><Proposals /></ProtectedRoute>} />
            <Route path="/insights" element={<AdminRoute><Insights /></AdminRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
