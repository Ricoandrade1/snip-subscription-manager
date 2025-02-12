import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { Member, MemberContextType } from './types';
import { fetchMembersFromDB, setupRealtimeSubscription } from './memberUtils';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    if (session) {
      fetchMembers();
      const channel = setupRealtimeSubscription(setMembers);
      
      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setMembers([]);
      setIsLoading(false);
    }
  }, [session]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const formattedMembers = await fetchMembersFromDB();
      console.log('Membros carregados:', formattedMembers);
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      toast.error('Erro ao carregar membros');
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (member: Omit<Member, "id" | "plan">) => {
    if (!session) {
      toast.error('Você precisa estar logado para adicionar membros');
      return;
    }

    try {
      const { data: newMember, error } = await supabase
        .from('members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;
      
      await fetchMembers();
      toast.success('Membro adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast.error('Erro ao adicionar membro');
    }
  };

  const updateMember = async (id: string, updatedFields: Partial<Member>) => {
    if (!session) {
      toast.error('Você precisa estar logado para atualizar membros');
      return;
    }

    try {
      if (updatedFields.plan) {
        const { data: planData } = await supabase
          .from('plans')
          .select('id')
          .eq('title', updatedFields.plan)
          .single();

        if (planData) {
          const updateData = {
            ...updatedFields,
            plan_id: planData.id,
          };

          const { error } = await supabase
            .from('members')
            .update(updateData)
            .eq('id', id);

          if (error) throw error;
        }
      }

      await fetchMembers();
      toast.success('Membro atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      toast.error('Erro ao atualizar membro');
    }
  };

  const deleteMember = async (id: string) => {
    if (!session) {
      toast.error('Você precisa estar logado para deletar membros');
      return;
    }

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMembers();
      toast.success('Membro removido com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar membro:', error);
      toast.error('Erro ao remover membro');
    }
  };

  const getMembersByPlan = (plan: Member["plan"]) => {
    return members.filter(member => member.plan === plan).length;
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

export type { Member } from './types';