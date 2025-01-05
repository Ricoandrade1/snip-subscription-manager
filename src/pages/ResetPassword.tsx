import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const customTheme = {
  default: {
    colors: {
      brand: '#000000',
      brandAccent: '#666666',
      brandButtonText: 'white',
      defaultButtonBackground: '#ffffff',
      defaultButtonBackgroundHover: '#eaeaea',
      defaultButtonBorder: 'lightgray',
      defaultButtonText: '#000000',
      dividerBackground: '#e9e9e9',
      inputBackground: 'transparent',
      inputBorder: 'lightgray',
      inputBorderHover: '#000000',
      inputBorderFocus: '#000000',
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
      bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      labelFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
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
    <div className="w-full max-w-[420px] mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-medium mb-2">Redefinir senha</h1>
        <p className="text-sm text-gray-600">
          Digite seu email para receber as instruções
        </p>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <Auth
          supabaseClient={supabase}
          view="reset-password"
          appearance={{
            theme: customTheme,
            style: {
              button: {
                fontWeight: '400',
                padding: '6px 12px',
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
              reset_password: {
                email_label: 'Email',
                password_label: 'Nova senha',
                button_label: 'Enviar instruções',
                loading_button_label: 'Enviando...',
                confirmation_text: 'Verifique seu email para redefinir sua senha',
              },
            },
          }}
        />
      </div>
    </div>
  );
}