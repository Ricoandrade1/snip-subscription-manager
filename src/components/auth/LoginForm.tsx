import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";

const customTheme = {
  default: {
    colors: {
      brand: '#D4AF37',
      brandAccent: '#B4941F',
      brandButtonText: '#111827',
      defaultButtonBackground: '#111827',
      defaultButtonBackgroundHover: '#1F2937',
      defaultButtonBorder: '#D4AF37',
      defaultButtonText: '#D4AF37',
      dividerBackground: '#2D3748',
      inputBackground: '#111827',
      inputBorder: '#D4AF37',
      inputBorderHover: '#B4941F',
      inputBorderFocus: '#B4941F',
      inputText: '#D4AF37',
      inputLabelText: '#D4AF37',
      inputPlaceholder: '#4A5568',
      messageText: '#D4AF37',
      messageTextDanger: '#FF4B4B',
      anchorTextColor: '#D4AF37',
      anchorTextHoverColor: '#B4941F',
    },
    space: {
      spaceSmall: '4px',
      spaceMedium: '8px',
      spaceLarge: '16px',
      labelBottomMargin: '8px',
      anchorBottomMargin: '4px',
      emailInputSpacing: '4px',
      socialAuthSpacing: '4px',
      buttonPadding: '10px 15px',
      inputPadding: '10px 15px',
    },
    fonts: {
      bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
    },
    fontSizes: {
      baseBodySize: '13px',
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-barber-black p-4">
      <div className="w-full max-w-[420px] space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-barber-gold">
            Barbearia
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Faça login para continuar
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: customTheme }}
          theme="dark"
          providers={[]}
          redirectTo={`${window.location.origin}/`}
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
              magic_link: {
                email_input_label: 'Email',
                button_label: 'Enviar link mágico',
                loading_button_label: 'Enviando link mágico...',
                link_text: 'Enviar link mágico',
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
        />
      </div>
    </div>
  );
};