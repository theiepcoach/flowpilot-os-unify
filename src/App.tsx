import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SubscriptionRoute } from "@/components/auth/SubscriptionRoute";
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
import AdminBilling from "./pages/AdminBilling";
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
            
            {/* App shell (protected - always accessible) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/app-settings" element={<ProtectedRoute><AppSettings /></ProtectedRoute>} />
            
            {/* Module pages (subscription required) */}
            <Route path="/modules" element={<SubscriptionRoute><Modules /></SubscriptionRoute>} />
            <Route path="/leads" element={<SubscriptionRoute><Leads /></SubscriptionRoute>} />
            <Route path="/schedule" element={<SubscriptionRoute><Schedule /></SubscriptionRoute>} />
            <Route path="/finance" element={<SubscriptionRoute><Finance /></SubscriptionRoute>} />
            <Route path="/inbox" element={<SubscriptionRoute><Inbox /></SubscriptionRoute>} />
            <Route path="/automations" element={<SubscriptionRoute><Automations /></SubscriptionRoute>} />
            <Route path="/team" element={<SubscriptionRoute><Team /></SubscriptionRoute>} />
            <Route path="/marketing" element={<SubscriptionRoute><Marketing /></SubscriptionRoute>} />
            <Route path="/retention" element={<SubscriptionRoute><Retention /></SubscriptionRoute>} />
            <Route path="/proposals" element={<SubscriptionRoute><Proposals /></SubscriptionRoute>} />
            <Route path="/insights" element={<SubscriptionRoute><Insights /></SubscriptionRoute>} />
            <Route path="/admin/billing" element={<AdminRoute><AdminBilling /></AdminRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
