import { supabase } from '@/integrations/supabase/client';
import { Member } from './types';

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
    plan: member.plans?.title || "Basic",
    created_at: member.created_at,
    payment_date: member.payment_date,
  })) as Member[];

  console.log('Membros formatados:', formattedMembers);
  return formattedMembers;
};

export const addMemberToDB = async (member: Omit<Member, "id" | "plan">) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .insert([member])
      .select()
      .single();

    if (error) {
      console.error('Erro ao inserir membro:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao adicionar membro:', error);
    throw error;
  }
};

export const updateMemberInDB = async (id: string, member: Partial<Member>) => {
  try {
    // Primeiro, buscar o plan_id baseado no título do plano
    if (member.plan) {
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('id')
        .eq('title', member.plan)
        .single();

      if (planError) {
        console.error('Erro ao buscar plano:', planError);
        throw planError;
      }

      // Atualizar o member com o plan_id correto
      const updateData = {
        name: member.name,
        nickname: member.nickname,
        phone: member.phone,
        nif: member.nif,
        plan_id: planData.id,
        payment_date: member.payment_date,
      };

      const { error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar membro:', error);
        throw error;
      }

      console.log('Membro atualizado com sucesso:', { id, ...updateData });
    }
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    throw error;
  }
};

export const deleteMemberFromDB = async (id: string) => {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id);

  if (error) throw error;
};