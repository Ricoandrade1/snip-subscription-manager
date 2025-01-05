import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";

const customTheme = {
  default: {
    colors: {
      brand: '#BF9B30',
      brandAccent: '#8B7022',
      brandButtonText: 'white',
      defaultButtonBackground: '#2A2A2A',
      defaultButtonBackgroundHover: '#1A1A1A',
      defaultButtonBorder: '#BF9B30',
      defaultButtonText: '#F5F5F5',
      dividerBackground: '#2A2A2A',
      inputBackground: 'transparent',
      inputBorder: '#2A2A2A',
      inputBorderHover: '#BF9B30',
      inputBorderFocus: '#BF9B30',
      inputText: '#F5F5F5',
      inputLabelText: '#BF9B30',
      inputPlaceholder: '#666666',
      messageText: '#F5F5F5',
      messageTextDanger: '#e11d48',
      anchorTextColor: '#BF9B30',
      anchorTextHoverColor: '#8B7022',
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
      borderRadiusButton: '4px',
      buttonBorderRadius: '4px',
      inputBorderRadius: '4px',
    },
  },
};

export const LoginForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-barber-black p-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-barber-gold mb-2">Bem-vindo</h1>
          <p className="text-sm text-barber-light/80">
            Faça login para continuar
          </p>
        </div>
        <div className="bg-barber-gray rounded-lg p-6 border border-barber-gold/20">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: customTheme,
              style: {
                button: {
                  fontWeight: '500',
                  padding: '8px 12px',
                  transition: 'all 0.2s ease',
                },
                anchor: {
                  color: '#BF9B30',
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
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};