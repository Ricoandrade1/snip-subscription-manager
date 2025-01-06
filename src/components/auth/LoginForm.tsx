import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const customTheme = {
  default: {
    colors: {
      brand: '#BF9B30',
      brandAccent: '#1A1A1A',
      brandButtonText: 'white',
      defaultButtonBackground: '#1A1A1A',
      defaultButtonBackgroundHover: '#2A2A2A',
      defaultButtonBorder: '#BF9B30',
      defaultButtonText: '#F5F5F5',
      dividerBackground: '#2A2A2A',
      inputBackground: '#1A1A1A',
      inputBorder: '#2A2A2A',
      inputBorderHover: '#BF9B30',
      inputBorderFocus: '#BF9B30',
      inputText: '#F5F5F5',
      inputLabelText: '#F5F5F5',
      inputPlaceholder: '#666666',
    },
    space: {
      spaceSmall: '4px',
      spaceMedium: '8px',
      spaceLarge: '16px',
    },
    fonts: {
      bodyFontFamily: `Montserrat, sans-serif`,
      buttonFontFamily: `Montserrat, sans-serif`,
      inputFontFamily: `Montserrat, sans-serif`,
      labelFontFamily: `Montserrat, sans-serif`,
    },
    fontSizes: {
      baseBodySize: '14px',
      baseInputSize: '14px',
      baseLabelSize: '14px',
      baseButtonSize: '14px',
    },
    borderWidths: {
      buttonBorderWidth: '1px',
      inputBorderWidth: '1px',
    },
    radii: {
      borderRadiusButton: '6px',
      buttonBorderRadius: '6px',
      inputBorderRadius: '6px',
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
        if (session.user.email === 'admin@example.com') {
          supabase.auth.updateUser({
            data: { role: 'admin' }
          }).catch(error => {
            console.error('Error updating user role:', error);
            toast.error('Erro ao atualizar papel do usuário');
          });
        }
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-barber-black p-4">
      <div className="w-full max-w-[420px] space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-barber-gold">
            Barber Pro
          </h1>
          <p className="text-barber-light/60 text-sm">
            Faça login para acessar o sistema
          </p>
        </div>

        <div className="bg-barber-gray/50 border border-barber-gray rounded-lg p-4">
          <p className="text-barber-gold font-medium text-sm mb-2">
            Credenciais de Administrador:
          </p>
          <div className="space-y-1 text-sm text-barber-light/80">
            <p>Email: admin@example.com</p>
            <p>Senha: admin123</p>
          </div>
        </div>

        <div className="bg-barber-gray/30 backdrop-blur-sm rounded-lg p-6 border border-barber-gray/50">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: customTheme }}
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
