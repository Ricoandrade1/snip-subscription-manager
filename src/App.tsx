import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
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
    const initSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          await handleLogout();
          return;
        }
        
        if (currentSession) {
          setSession(currentSession);
          setIsAdmin(currentSession.user.user_metadata.role === 'admin');
        }
      } catch (error) {
        console.error('Error in session initialization:', error);
        await handleLogout();
      } finally {
        setLoading(false);
      }
    };

    const handleLogout = async () => {
      await supabase.auth.signOut();
      setSession(null);
      setIsAdmin(false);
      navigate('/login');
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (session) {
        setSession(session);
        setIsAdmin(session.user.user_metadata.role === 'admin');
        
        if (event === 'SIGNED_IN') {
          if (session.user.email === 'admin@example.com') {
            try {
              await supabase.auth.updateUser({
                data: { role: 'admin' }
              });
            } catch (error) {
              console.error('Error updating user role:', error);
            }
          }
          
          toast.success('Login realizado com sucesso!');
          navigate('/');
        }
      } else {
        setSession(null);
        setIsAdmin(false);
        
        if (event === 'SIGNED_OUT') {
          toast.success('Logout realizado com sucesso!');
          navigate('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-barber-gold border-t-transparent" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const publicRoutes = ['/login', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (!session && !isPublicRoute) {
    return <LoginForm />;
  }

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