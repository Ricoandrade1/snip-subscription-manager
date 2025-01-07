import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PasswordResetDialogProps {
  user: {
    id: string;
    email: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getCardStyle: () => string;
}

export function PasswordResetDialog({
  user,
  isOpen,
  onOpenChange,
  getCardStyle,
}: PasswordResetDialogProps) {
  const { toast } = useToast();

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        user.email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Um email foi enviado com instruções para redefinir a senha.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o email de redefinição de senha.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("border-barber-gold/20", getCardStyle())}>
        <DialogTitle className="text-xl font-semibold text-barber-light">
          Alterar Senha - {user.email || "Usuário sem email"}
        </DialogTitle>
        <div className="space-y-4 p-4">
          <p className="text-barber-light">
            Tem certeza que deseja enviar um email de redefinição de senha para este usuário?
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePasswordReset}
              className="bg-barber-gold hover:bg-barber-gold/90 text-barber-black"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}