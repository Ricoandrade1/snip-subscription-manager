import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/members/*" element={<div>Members Page</div>} />
                <Route path="/revenue" element={<div>Revenue Page</div>} />
                <Route path="/schedule" element={<div>Schedule Page</div>} />
                <Route path="/suppliers/*" element={<div>Suppliers Page</div>} />
                <Route path="/products" element={<div>Products Page</div>} />
                <Route path="/barbers" element={<div>Barbers Page</div>} />
                <Route path="/locations" element={<div>Locations Page</div>} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;