import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Member } from "@/contexts/MemberContext";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "./member-form/PersonalInfoFields";
import { PlanFields } from "./member-form/PlanFields";
import { PaymentDateField } from "./PaymentDateField";
import { formSchema } from "./member-form/schema";

interface QuickEditFormProps {
  member: Member;
  onSubmit: (data: Partial<Member>) => Promise<void>;
}

export function QuickEditForm({ member, onSubmit }: QuickEditFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member.name || "",
      nickname: member.nickname || "",
      phone: member.phone || "",
      nif: member.nif || "",
      plan: member.plan || undefined,
      payment_date: member.payment_date ? new Date(member.payment_date) : undefined,
      status: member.status || "active",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...data,
      payment_date: data.payment_date?.toISOString() || null,
    };
    
    await onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields />
        <PlanFields />
        <PaymentDateField />
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-barber-gold hover:bg-barber-gold/90 text-white px-4 py-2 rounded-md"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </Form>
  );
}