import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
  barberId?: string;
  onSuccess?: () => void;
}

export function BarberForm({ barberId, onSuccess }: BarberFormProps) {
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

  useEffect(() => {
    if (barberId) {
      loadBarberData();
    }
  }, [barberId]);

  const loadBarberData = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .eq('id', barberId)
        .single();

      if (error) throw error;

      if (data) {
        form.reset({
          name: data.name,
          nickname: data.nickname || "",
          phone: data.phone,
          email: data.email || "",
          nif: data.nif,
          birthDate: data.birth_date,
          startDate: data.start_date,
          specialties: data.specialties,
          commissionRate: data.commission_rate,
          bankName: data.bank_name,
          iban: data.iban,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do barbeiro.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: BarberFormData) => {
    try {
      const barberData = {
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
      };

      let error;
      if (barberId) {
        ({ error } = await supabase
          .from('barbers')
          .update(barberData)
          .eq('id', barberId));
      } else {
        ({ error } = await supabase
          .from('barbers')
          .insert([barberData]));
      }

      if (error) throw error;

      toast({
        title: barberId ? "Barbeiro atualizado com sucesso!" : "Barbeiro cadastrado com sucesso!",
        description: barberId ? "Os dados do barbeiro foram atualizados." : "O novo barbeiro foi adicionado à equipe.",
      });
      
      if (!barberId) {
        form.reset();
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: barberId ? "Erro ao atualizar barbeiro" : "Erro ao cadastrar barbeiro",
        description: "Ocorreu um erro ao tentar salvar os dados do barbeiro.",
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
          {barberId ? "Atualizar Barbeiro" : "Cadastrar Barbeiro"}
        </Button>
      </form>
    </Form>
  );
}