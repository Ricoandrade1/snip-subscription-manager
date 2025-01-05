import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { Member, MemberContextType } from './types';
import { 
  fetchMembersFromDB, 
  addMemberToDB, 
  updateMemberInDB, 
  deleteMemberFromDB 
} from './memberUtils';
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
      const channel = setupRealtimeSubscription();
      
      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setMembers([]);
      setIsLoading(false);
    }
  }, [session]);

  const setupRealtimeSubscription = () => {
    console.log('Setting up realtime subscription...');
    
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        async (payload) => {
          console.log('Realtime change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const { data: newMember } = await supabase
              .from('members')
              .select(`
                *,
                plans (
                  id,
                  title,
                  price
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (newMember) {
              setMembers(current => [...current, {
                id: newMember.id,
                name: newMember.name || '',
                nickname: newMember.nickname || '',
                phone: newMember.phone || '',
                nif: newMember.nif || '',
                plan_id: newMember.plan_id,
                plan: newMember.plans?.title || "Basic",
                created_at: newMember.created_at,
                payment_date: newMember.payment_date,
              }]);
              toast.success('Novo membro adicionado');
            }
          }
          
          if (payload.eventType === 'UPDATE') {
            const { data: updatedMember } = await supabase
              .from('members')
              .select(`
                *,
                plans (
                  id,
                  title,
                  price
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (updatedMember) {
              setMembers(current => current.map(member => 
                member.id === payload.new.id ? {
                  id: updatedMember.id,
                  name: updatedMember.name || '',
                  nickname: updatedMember.nickname || '',
                  phone: updatedMember.phone || '',
                  nif: updatedMember.nif || '',
                  plan_id: updatedMember.plan_id,
                  plan: updatedMember.plans?.title || "Basic",
                  created_at: updatedMember.created_at,
                  payment_date: updatedMember.payment_date,
                } : member
              ));
              toast.success('Membro atualizado');
            }
          }
          
          if (payload.eventType === 'DELETE') {
            setMembers(current => current.filter(member => member.id !== payload.old.id));
            toast.success('Membro removido');
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return channel;
  };

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
      const newMember = await addMemberToDB(member);
      await fetchMembers(); // Recarrega a lista após adicionar
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
      await updateMemberInDB(id, updatedFields);
      await fetchMembers(); // Recarrega a lista após atualizar
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
      await deleteMemberFromDB(id);
      await fetchMembers(); // Recarrega a lista após deletar
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