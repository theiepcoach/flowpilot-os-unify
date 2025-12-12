import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
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
import Settings from "./pages/Settings";
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
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
            <Route path="/automations" element={<ProtectedRoute><Automations /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
            <Route path="/retention" element={<ProtectedRoute><Retention /></ProtectedRoute>} />
            <Route path="/proposals" element={<ProtectedRoute><Proposals /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
