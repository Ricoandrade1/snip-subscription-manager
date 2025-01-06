import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member } from "@/contexts/types";
import { Form } from "@/components/ui/form";
import { formSchema, FormValues } from "./member-form/schema";
import { useMemberUpdate } from "./member-form/useMemberUpdate";
import { MemberFormFields } from "./member-form/MemberFormFields";

interface QuickEditFormProps {
  member: Member;
  onSubmit: (data: Partial<Member>) => Promise<void>;
}

export function QuickEditForm({ member, onSubmit }: QuickEditFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member.name || "",
      nickname: member.nickname || "",
      phone: member.phone || "",
      nif: member.nif || "",
      plan: member.plan || "Basic",
      payment_date: member.payment_date ? new Date(member.payment_date) : undefined,
      status: member.status || "pendente",
    },
  });

  const { handleSubmit, isSubmitting } = useMemberUpdate(member, form, onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <MemberFormFields form={form} />
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-barber-gold hover:bg-barber-gold/90 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </Form>
  );
}