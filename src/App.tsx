import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase/client";
import { Toaster } from "sonner";

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
import Users from "./pages/Users";
import Reports from "./pages/Reports";

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
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          setSession(session);
          setIsAdmin(session.user.user_metadata.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setSession(session);
        setIsAdmin(session.user.user_metadata.role === 'admin');
      } else {
        setSession(null);
        setIsAdmin(false);
        if (event === 'SIGNED_OUT') {
          // Clear local storage
          localStorage.removeItem('barber-session');
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

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Redirect to login if not authenticated and trying to access private route
  if (!session && !isPublicRoute) {
    return <LoginForm />;
  }

  // Redirect to dashboard if authenticated and trying to access public route
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
            <Route path="/users" element={<Users />} />
            <Route path="/reports/*" element={<Reports />} />
          </Routes>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}

export default App;