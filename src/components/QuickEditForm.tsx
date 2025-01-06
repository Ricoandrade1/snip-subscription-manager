import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Member } from "@/contexts/MemberContext";
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
      name: member.name,
      nickname: member.nickname || "",
      phone: member.phone || "",
      nif: member.nif || "",
      plan: member.plan,
      payment_date: member.payment_date ? new Date(member.payment_date) : new Date(),
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalInfoFields form={form} />
          <div className="space-y-6">
            <PlanFields form={form} />
            <PaymentDateField form={form} />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            type="submit"
            className="bg-barber-gold hover:bg-barber-gold/90 text-barber-black font-semibold"
          >
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}