import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import Members from "./pages/Members";
import PaymentReports from "./pages/PaymentReports";
import Revenue from "./pages/Revenue";
import Schedule from "./pages/Schedule";
import Story from "./pages/Story";
import Feed from "./pages/Feed";
import Barbers from "./pages/Barbers";
import { MemberProvider } from "./contexts/MemberContext";
import { SidebarProvider } from "./components/ui/sidebar";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "./integrations/supabase/client";

import "./App.css";

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <MemberProvider>
        <SidebarProvider>
          <Router>
            <div className="flex min-h-screen">
              <AppSidebar />
              <main className="flex-1 bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/payment-reports" element={<PaymentReports />} />
                  <Route path="/revenue" element={<Revenue />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/story" element={<Story />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/barbers" element={<Barbers />} />
                </Routes>
              </main>
            </div>
          </Router>
        </SidebarProvider>
      </MemberProvider>
    </SessionContextProvider>
  );
}

export default App;