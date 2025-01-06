import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/auth/UserMenu";
import Index from "@/pages/Index";
import Subscribers from "@/pages/Subscribers";
import Products from "@/pages/Products";
import Barbers from "@/pages/Barbers";
import Revenue from "@/pages/Revenue";
import Categories from "@/pages/Categories";
import Brands from "@/pages/Brands";
import CashFlow from "@/pages/CashFlow";
import Schedule from "@/pages/Schedule";
import Feed from "@/pages/Feed";
import Story from "@/pages/Story";
import ResetPassword from "@/pages/ResetPassword";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setIsAdmin(session.user.user_metadata.role === 'admin');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSession(session);
        setIsAdmin(session.user.user_metadata.role === 'admin');
        if (event === 'SIGNED_IN') {
          toast.success('Login realizado com sucesso!');
        }
      } else {
        setSession(null);
        setIsAdmin(false);
        if (event === 'SIGNED_OUT') {
          toast.success('Logout realizado com sucesso!');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const publicPages = ["/login", "/reset-password"];
  const isPublicPage = publicPages.includes(location.pathname);

  if (!session && !isPublicPage) {
    return <Navigate to="/login" replace />;
  }

  if (session && isPublicPage) {
    return <Navigate to="/" replace />;
  }

  if (session && !isAdmin && !isPublicPage) {
    toast.error('Acesso restrito a administradores');
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex w-full">
      {session && <AppSidebar />}
      <main className={session ? "flex-1 relative" : "w-full"}>
        {session && (
          <div className="absolute top-4 right-4 z-50">
            <UserMenu />
          </div>
        )}
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Index />} />
          <Route path="/subscribers" element={<Subscribers />} />
          <Route path="/subscribers/basic" element={<Subscribers planFilter="Basic" />} />
          <Route path="/subscribers/classic" element={<Subscribers planFilter="Classic" />} />
          <Route path="/subscribers/business" element={<Subscribers planFilter="Business" />} />
          <Route path="/products" element={<Products />} />
          <Route path="/barbers" element={<Barbers />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/cash-flow" element={<CashFlow />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/story" element={<Story />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;