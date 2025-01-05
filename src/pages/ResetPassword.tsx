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

export default function ResetPassword() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-barber-light p-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold mb-2 text-barber-black">Redefinir senha</h1>
          <p className="text-sm text-gray-600">
            Digite seu email para receber as instruções
          </p>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100">
          <Auth
            supabaseClient={supabase}
            view="forgotten_password"
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
                forgotten_password: {
                  email_label: 'Email',
                  password_label: 'Nova senha',
                  button_label: 'Enviar instruções',
                  loading_button_label: 'Enviando...',
                  confirmation_text: 'Verifique seu email para redefinir sua senha',
                  link_text: 'Esqueceu sua senha?',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}