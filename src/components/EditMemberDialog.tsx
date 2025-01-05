import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Member } from "@/contexts/MemberContext";
import { useMemberContext } from "@/contexts/MemberContext";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { PlanFields } from "./member-dialog/PlanFields";
import { formSchema } from "./member-dialog/schema";
import * as z from "zod";

interface EditMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMemberDialog({ member, open, onOpenChange }: EditMemberDialogProps) {
  const { toast } = useToast();
  const { updateMember } = useMemberContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: member ? {
      name: member.name || "",
      nickname: member.nickname || "",
      phone: member.phone || "",
      plan: member.plan || "Basic",
    } : undefined,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (member) {
      updateMember(member.id, data);
      toast({
        title: "Membro atualizado com sucesso!",
        description: "As alterações foram salvas.",
      });
      onOpenChange(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Membro</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PersonalInfoFields form={form} />
            </div>

            <PlanFields form={form} />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}