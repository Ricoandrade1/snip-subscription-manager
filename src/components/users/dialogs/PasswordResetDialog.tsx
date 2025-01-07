import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const passwordSchema = z.object({
  password: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(50, "A senha não pode ter mais de 50 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordResetDialogProps {
  user: {
    id: string;
    email: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getCardStyle: () => string;
  onSuccess?: () => void;
}

export function PasswordResetDialog({
  user,
  isOpen,
  onOpenChange,
  getCardStyle,
  onSuccess,
}: PasswordResetDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleUpdatePassword = async (data: PasswordFormData) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        // Check for the specific "same password" error
        if (error.message.includes("same_password")) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "A nova senha deve ser diferente da senha atual.",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Senha atualizada com sucesso!",
      });
      
      form.reset();
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar a senha.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("border-barber-gold/20", getCardStyle())}>
        <DialogTitle className="text-xl font-semibold text-barber-light">
          Alterar Senha - {user.email}
        </DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdatePassword)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-barber-light">Nova Senha</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password"
                      className="bg-barber-black border-barber-gold/20 focus:border-barber-gold text-barber-light"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-barber-light">Confirmar Nova Senha</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password"
                      className="bg-barber-black border-barber-gold/20 focus:border-barber-gold text-barber-light"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-barber-gold hover:bg-barber-gold/90 text-barber-black"
            >
              {isLoading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}