import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import EmployeePortalLayout from "./components/layouts/EmployeePortalLayout";
import Dashboard from "./pages/employee/Dashboard";
import Budget from "./pages/employee/Budget";
import Tasks from "./pages/employee/Tasks";
import Projects from "./pages/employee/Projects";
import Users from "./pages/employee/Users";
import Requests from "./pages/employee/Requests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<AboutUs />} />
            
            {/* Employee Portal Routes */}
            <Route path="/employee/login" element={<EmployeeLogin />} />
            <Route path="/employee" element={<EmployeePortalLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="income-projects" element={<Projects />} />
              <Route path="requests" element={<Requests />} />
              <Route path="departments" element={<Dashboard />} /> {/* TODO: Create Departments component */}
              <Route path="budget" element={<Budget />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="settings" element={<Dashboard />} /> {/* TODO: Create Settings component */}
              <Route path="users" element={<Users />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
