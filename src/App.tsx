import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import Members from "./pages/Members";
import Schedule from "./pages/Schedule";
import Story from "./pages/Story";
import Feed from "./pages/Feed";
import Barbers from "./pages/Barbers";
import Revenue from "./pages/Revenue";
import CashFlow from "./pages/CashFlow";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import Categories from "./pages/Categories";
import { MemberProvider } from "./contexts/MemberContext";
import { SidebarProvider } from "./components/ui/sidebar";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "./integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

import "./App.css";

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function LoginPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Login</h2>
          <p className="mt-2 text-gray-600">Entre com sua conta para continuar</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <MemberProvider>
        <SidebarProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <AuthenticatedRoute>
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
                          <Route path="/products" element={<Products />} />
                          <Route path="/brands" element={<Brands />} />
                          <Route path="/categories" element={<Categories />} />
                        </Routes>
                      </main>
                    </div>
                  </AuthenticatedRoute>
                }
              />
            </Routes>
          </Router>
          <Toaster />
        </SidebarProvider>
      </MemberProvider>
    </SessionContextProvider>
  );
}

export default App;