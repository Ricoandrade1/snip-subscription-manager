import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import Members from "./pages/Members";
import Schedule from "./pages/Schedule";
import Story from "./pages/Story";
import Feed from "./pages/Feed";
import Barbers from "./pages/Barbers";
import Login from "./pages/Login";
import { MemberProvider } from "./contexts/MemberContext";
import { SidebarProvider } from "./components/ui/sidebar";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "./integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { useSession } from '@supabase/auth-helpers-react';

import "./App.css";

function RequireAuth({ children }: { children: JSX.Element }) {
  const session = useSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

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
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={
                    <RequireAuth>
                      <Index />
                    </RequireAuth>
                  } />
                  <Route path="/members" element={
                    <RequireAuth>
                      <Members />
                    </RequireAuth>
                  } />
                  <Route path="/members/basic" element={
                    <RequireAuth>
                      <Members planType="Basic" />
                    </RequireAuth>
                  } />
                  <Route path="/members/classic" element={
                    <RequireAuth>
                      <Members planType="Classic" />
                    </RequireAuth>
                  } />
                  <Route path="/members/business" element={
                    <RequireAuth>
                      <Members planType="Business" />
                    </RequireAuth>
                  } />
                  <Route path="/schedule" element={
                    <RequireAuth>
                      <Schedule />
                    </RequireAuth>
                  } />
                  <Route path="/story" element={
                    <RequireAuth>
                      <Story />
                    </RequireAuth>
                  } />
                  <Route path="/feed" element={
                    <RequireAuth>
                      <Feed />
                    </RequireAuth>
                  } />
                  <Route path="/barbers" element={
                    <RequireAuth>
                      <Barbers />
                    </RequireAuth>
                  } />
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