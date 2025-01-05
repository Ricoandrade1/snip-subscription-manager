import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { BankingFields } from "./BankingFields";
import { SpecialtiesFields } from "./SpecialtiesFields";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  nickname: z.string().optional(),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  email: z.string().email("Email inválido").optional(),
  nif: z.string().min(9, "NIF deve ter 9 dígitos"),
  birthDate: z.string(),
  startDate: z.string(),
  specialties: z.array(z.string()).min(1, "Selecione pelo menos uma especialidade"),
  commissionRate: z.number().min(0).max(100),
  bankName: z.string().min(2, "Nome do banco é obrigatório"),
  iban: z.string().min(15, "IBAN inválido"),
});

type BarberFormData = z.infer<typeof formSchema>;

interface BarberFormProps {
  onSuccess?: () => void;
}

export function BarberForm({ onSuccess }: BarberFormProps) {
  const { toast } = useToast();

  const form = useForm<BarberFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nickname: "",
      phone: "",
      email: "",
      nif: "",
      birthDate: "",
      startDate: new Date().toISOString().split('T')[0],
      specialties: [],
      commissionRate: 50,
      bankName: "",
      iban: "",
    },
  });

  const onSubmit = async (data: BarberFormData) => {
    try {
      const { error } = await supabase.from('barbers').insert([{
        name: data.name,
        nickname: data.nickname,
        phone: data.phone,
        email: data.email,
        nif: data.nif,
        birth_date: data.birthDate,
        start_date: data.startDate,
        specialties: data.specialties,
        commission_rate: data.commissionRate,
        bank_name: data.bankName,
        iban: data.iban,
      }]);

      if (error) throw error;

      toast({
        title: "Barbeiro cadastrado com sucesso!",
        description: "O novo barbeiro foi adicionado à equipe.",
      });
      
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro ao cadastrar barbeiro",
        description: "Ocorreu um erro ao tentar cadastrar o barbeiro.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalInfoFields form={form} />
          <BankingFields form={form} />
        </div>

        <SpecialtiesFields form={form} />

        <Button type="submit" className="w-full">
          Cadastrar Barbeiro
        </Button>
      </form>
    </Form>
  );
}