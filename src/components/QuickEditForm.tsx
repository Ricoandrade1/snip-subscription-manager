import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Member } from "@/contexts/MemberContext";
import { format } from "date-fns";
import { PersonalInfoFields } from "./member-form/PersonalInfoFields";
import { PlanFields } from "./member-form/PlanFields";
import { DueDateField } from "./member-form/DueDateField";
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
      due_date: member.due_date ? new Date(member.due_date) : undefined,
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...data,
      due_date: data.due_date ? format(data.due_date, 'yyyy-MM-dd') : undefined,
    };
    await onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalInfoFields form={form} />
          <PlanFields form={form} />
          <DueDateField form={form} />
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