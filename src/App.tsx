import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "@/pages/Index";
import Members from "@/pages/Members";
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

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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

  // Páginas públicas que não precisam de autenticação
  const publicPages = ["/login", "/reset-password"];
  const isPublicPage = publicPages.includes(location.pathname);

  // Se não estiver autenticado e tentar acessar uma página protegida
  if (!session && !isPublicPage) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado e tentar acessar páginas de login/reset
  if (session && isPublicPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex w-full">
      {session && <AppSidebar />}
      <main className={session ? "flex-1" : "w-full"}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Index />} />
          <Route path="/members" element={<Members />} />
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