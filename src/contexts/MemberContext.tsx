import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/client';
import { toast } from "sonner";

export type Member = {
  id: string;
  name: string;
  nickname: string;
  nif: string;
  birthDate: string;
  passport: string;
  citizenCard: string;
  bi: string;
  bank: string;
  iban: string;
  debitDate: string;
  phone: string;
  plan: "Basic" | "Classic" | "Business";
  paymentHistory?: {
    date: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
    receiptUrl?: string;
  }[];
  visits?: {
    date: string;
    service: string;
    barber: string;
  }[];
};

interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, "id">) => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMembersByPlan: (plan: Member["plan"]) => Member[];
  isLoading: boolean;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select(`
          *,
          payments (
            id,
            amount,
            status,
            payment_date,
            receipt_url
          ),
          visits (
            id,
            service,
            barber,
            visit_date
          )
        `);

      if (membersError) throw membersError;

      const formattedMembers: Member[] = membersData.map(member => ({
        id: member.id,
        name: member.name,
        nickname: member.nickname || '',
        phone: member.phone,
        nif: member.nif || '',
        birthDate: member.birth_date,
        passport: member.passport || '',
        citizenCard: member.citizen_card || '',
        bi: member.bi || '',
        bank: member.bank,
        iban: member.iban,
        debitDate: member.debit_date,
        plan: member.plan_id === '1' ? 'Basic' : member.plan_id === '2' ? 'Classic' : 'Business',
        paymentHistory: member.payments?.map(payment => ({
          date: payment.payment_date,
          amount: payment.amount,
          status: payment.status,
          receiptUrl: payment.receipt_url || undefined
        })),
        visits: member.visits?.map(visit => ({
          date: visit.visit_date,
          service: visit.service,
          barber: visit.barber
        }))
      }));

      setMembers(formattedMembers);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      toast.error('Erro ao carregar membros');
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (member: Omit<Member, "id">) => {
    try {
      const { data: planData } = await supabase
        .from('plans')
        .select('id')
        .eq('title', member.plan)
        .single();

      if (!planData) throw new Error('Plano não encontrado');

      const { data, error } = await supabase
        .from('members')
        .insert([{
          name: member.name,
          nickname: member.nickname,
          phone: member.phone,
          nif: member.nif,
          birth_date: member.birthDate,
          passport: member.passport,
          citizen_card: member.citizenCard,
          bi: member.bi,
          bank: member.bank,
          iban: member.iban,
          debit_date: member.debitDate,
          plan_id: planData.id
        }])
        .select()
        .single();

      if (error) throw error;

      setMembers(prev => [...prev, { ...member, id: data.id }]);
      toast.success('Membro adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast.error('Erro ao adicionar membro');
    }
  };

  const updateMember = async (id: string, updatedFields: Partial<Member>) => {
    try {
      let planId = null;
      if (updatedFields.plan) {
        const { data: planData } = await supabase
          .from('plans')
          .select('id')
          .eq('title', updatedFields.plan)
          .single();
        planId = planData?.id;
      }

      const { error } = await supabase
        .from('members')
        .update({
          name: updatedFields.name,
          nickname: updatedFields.nickname,
          phone: updatedFields.phone,
          nif: updatedFields.nif,
          birth_date: updatedFields.birthDate,
          passport: updatedFields.passport,
          citizen_card: updatedFields.citizenCard,
          bi: updatedFields.bi,
          bank: updatedFields.bank,
          iban: updatedFields.iban,
          debit_date: updatedFields.debitDate,
          ...(planId && { plan_id: planId })
        })
        .eq('id', id);

      if (error) throw error;

      setMembers(prev =>
        prev.map(member =>
          member.id === id ? { ...member, ...updatedFields } : member
        )
      );
      toast.success('Membro atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      toast.error('Erro ao atualizar membro');
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMembers(prev => prev.filter(member => member.id !== id));
      toast.success('Membro removido com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar membro:', error);
      toast.error('Erro ao remover membro');
    }
  };

  const getMembersByPlan = (plan: Member["plan"]) => {
    return members.filter(member => member.plan === plan);
  };

  return (
    <MemberContext.Provider value={{ 
      members, 
      addMember, 
      updateMember, 
      deleteMember,
      getMembersByPlan,
      isLoading
    }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
};