import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Companies from "./pages/Companies";
import Leads from "./pages/Leads";
import Jobs from "./pages/Jobs";
import NewJobs from "./pages/NewJobs";
import MorningView from "./pages/MorningView";
import EndingSoon from "./pages/EndingSoon";
import Opportunities from "./pages/Opportunities";
import Campaigns from "./pages/Campaigns";
import Reporting from "./pages/Reporting";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/companies" element={<Layout><Companies /></Layout>} />
          <Route path="/leads" element={<Layout><Leads /></Layout>} />
          <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
          <Route path="/jobs/new" element={<Layout><NewJobs /></Layout>} />
          <Route path="/jobs/morning-view" element={<Layout><MorningView /></Layout>} />
          <Route path="/jobs/ending-soon" element={<Layout><EndingSoon /></Layout>} />
          <Route path="/opportunities" element={<Layout><Opportunities /></Layout>} />
          <Route path="/campaigns" element={<Layout><Campaigns /></Layout>} />
          <Route path="/reporting" element={<Layout><Reporting /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
