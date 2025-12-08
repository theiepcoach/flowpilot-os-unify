import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/team" element={<Team />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/retention" element={<Retention />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
