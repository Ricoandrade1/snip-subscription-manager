import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const customTheme = {
  default: {
    colors: {
      brand: 'hsl(var(--barber-black))',
      brandAccent: 'hsl(var(--barber-gold))',
      brandButtonText: 'white',
      defaultButtonBackground: '#ffffff',
      defaultButtonBackgroundHover: '#eaeaea',
      defaultButtonBorder: 'lightgray',
      defaultButtonText: '#000000',
      dividerBackground: '#e9e9e9',
      inputBackground: 'transparent',
      inputBorder: 'lightgray',
      inputBorderHover: 'hsl(var(--barber-gold))',
      inputBorderFocus: 'hsl(var(--barber-gold))',
      inputText: '#000000',
      inputLabelText: '#666666',
      inputPlaceholder: '#666666',
    },
    space: {
      spaceSmall: '4px',
      spaceMedium: '8px',
      spaceLarge: '12px',
    },
    fonts: {
      bodyFontFamily: `Montserrat, sans-serif`,
      buttonFontFamily: `Montserrat, sans-serif`,
      inputFontFamily: `Montserrat, sans-serif`,
      labelFontFamily: `Montserrat, sans-serif`,
    },
  },
};

export const LoginForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-barber-light p-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold mb-2 text-barber-black">Bem-vindo</h1>
          <p className="text-sm text-gray-600 mb-2">
            Faça login para continuar
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
            <p className="font-medium mb-1">Credenciais de teste:</p>
            <p>Email: admin@example.com</p>
            <p>Senha: 1234</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: customTheme,
              style: {
                button: {
                  fontWeight: '500',
                  padding: '10px 16px',
                  transition: 'all 0.2s ease',
                },
                anchor: {
                  color: '#666666',
                  textDecoration: 'none',
                  fontSize: '14px',
                },
                message: {
                  fontSize: '14px',
                  margin: '12px 0',
                },
                container: {
                  width: '100%',
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  social_provider_text: 'Criar conta com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
                },
                forgotten_password: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Enviar instruções',
                  loading_button_label: 'Enviando instruções...',
                  link_text: 'Esqueceu sua senha?',
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};