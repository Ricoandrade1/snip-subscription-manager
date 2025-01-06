import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemberProvider } from "@/contexts/MemberContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MemberProvider>
        <BrowserRouter>
          <div className="flex">
            <AppSidebar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </BrowserRouter>
      </MemberProvider>
    </QueryClientProvider>
  );
}

export default App;