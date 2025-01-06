import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase/client";
import { Toaster } from "sonner";
import { toast } from "sonner";

// Pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import Categories from "./pages/Categories";
import Subscribers from "./pages/Subscribers";
import Revenue from "./pages/Revenue";
import Barbers from "./pages/Barbers";
import CashFlow from "./pages/CashFlow";
import Feed from "./pages/Feed";
import Story from "./pages/Story";
import Schedule from "./pages/Schedule";
import ResetPassword from "./pages/ResetPassword";

// Components
import { LoginForm } from "./components/auth/LoginForm";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider } from "./components/ui/sidebar";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setIsAdmin(session.user.user_metadata.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSession(session);
        setIsAdmin(session.user.user_metadata.role === 'admin');
        // Only redirect on sign in
        if (event === 'SIGNED_IN') {
          toast.success('Login realizado com sucesso!');
          navigate('/');
        }
      } else {
        setSession(null);
        setIsAdmin(false);
        // Only redirect on sign out
        if (event === 'SIGNED_OUT') {
          toast.success('Logout realizado com sucesso!');
          navigate('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-barber-gold" />
      </div>
    );
  }

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/login', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Redirecionar para login se não estiver autenticado e tentar acessar rota privada
  if (!session && !isPublicRoute) {
    return <LoginForm />;
  }

  // Redirecionar para dashboard se estiver autenticado e tentar acessar rota pública
  if (session && isPublicRoute) {
    navigate('/');
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex">
        {session && <AppSidebar />}
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Index />} />
            <Route path="/subscribers/*" element={<Subscribers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/barbers" element={<Barbers />} />
            <Route path="/cash-flow" element={<CashFlow />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/story" element={<Story />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}

export default App;