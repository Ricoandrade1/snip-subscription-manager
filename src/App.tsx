import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import Members from "./pages/Members";
import Schedule from "./pages/Schedule";
import Story from "./pages/Story";
import Feed from "./pages/Feed";
import Barbers from "./pages/Barbers";
import Revenue from "./pages/Revenue";
import CashFlow from "./pages/CashFlow";
import { MemberProvider } from "./contexts/MemberContext";
import { SidebarProvider } from "./components/ui/sidebar";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "./integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

import "./App.css";

// Create a default session object
const defaultSession = {
  access_token: 'default_token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'default_refresh',
  user: {
    id: 'default_user_id',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'default@example.com',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: {
      provider: 'email',
      providers: ['email'],
    },
    user_metadata: {},
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  expires_at: Math.floor(Date.now() / 1000) + 3600,
};

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={defaultSession}>
      <MemberProvider>
        <SidebarProvider>
          <Router>
            <div className="flex min-h-screen">
              <AppSidebar />
              <main className="flex-1 bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/members/basic" element={<Members planType="Basic" />} />
                  <Route path="/members/classic" element={<Members planType="Classic" />} />
                  <Route path="/members/business" element={<Members planType="Business" />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/story" element={<Story />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/barbers" element={<Barbers />} />
                  <Route path="/revenue" element={<Revenue />} />
                  <Route path="/cash-flow" element={<CashFlow />} />
                </Routes>
              </main>
            </div>
          </Router>
          <Toaster />
        </SidebarProvider>
      </MemberProvider>
    </SessionContextProvider>
  );
}

export default App;