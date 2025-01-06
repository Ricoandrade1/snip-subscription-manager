import { supabase } from '@/integrations/supabase/client';
import { Member } from './types';
import { toast } from "sonner";

export const fetchMembersFromDB = async () => {
  console.log('Iniciando busca de membros...');
  
  const { data: membersData, error: membersError } = await supabase
    .from('members')
    .select(`
      *,
      plans (
        id,
        title,
        price
      )
    `);

  if (membersError) {
    console.error('Erro ao buscar membros:', membersError);
    throw membersError;
  }

  console.log('Dados brutos dos membros:', membersData);

  if (!membersData) {
    console.log('Nenhum membro encontrado');
    return [];
  }

  const formattedMembers = membersData.map(member => ({
    id: member.id,
    name: member.name || '',
    nickname: member.nickname || '',
    phone: member.phone || '',
    nif: member.nif || '',
    plan_id: member.plan_id,
    plan: member.plans?.title as Member["plan"],
    created_at: member.created_at,
    payment_date: member.payment_date,
    status: member.status || 'active'
  }));

  console.log('Membros formatados:', formattedMembers);
  return formattedMembers;
};

export const setupRealtimeSubscription = (setMembers: React.Dispatch<React.SetStateAction<Member[]>>) => {
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
            const formattedMember: Member = {
              id: newMember.id,
              name: newMember.name || '',
              nickname: newMember.nickname || '',
              phone: newMember.phone || '',
              nif: newMember.nif || '',
              plan_id: newMember.plan_id,
              plan: newMember.plans?.title as Member["plan"],
              created_at: newMember.created_at,
              payment_date: newMember.payment_date,
              status: newMember.status || 'active'
            };
            
            setMembers(current => [...current, formattedMember]);
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
            const formattedMember: Member = {
              id: updatedMember.id,
              name: updatedMember.name || '',
              nickname: updatedMember.nickname || '',
              phone: updatedMember.phone || '',
              nif: updatedMember.nif || '',
              plan_id: updatedMember.plan_id,
              plan: updatedMember.plans?.title as Member["plan"],
              created_at: updatedMember.created_at,
              payment_date: updatedMember.payment_date,
              status: updatedMember.status || 'active'
            };
            
            setMembers(current => 
              current.map(member => 
                member.id === payload.new.id ? formattedMember : member
              )
            );
            toast.success('Membro atualizado');
          }
        }
        
        if (payload.eventType === 'DELETE') {
          setMembers(current => 
            current.filter(member => member.id !== payload.old.id)
          );
          toast.success('Membro removido');
        }
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });

  return channel;
};