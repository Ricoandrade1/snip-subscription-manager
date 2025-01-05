import { LoginForm } from "@/components/auth/LoginForm";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoginForm />
    </div>
  );
}