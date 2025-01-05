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
    plan_id: member.plan_id,
    plan: member.plans?.title || "Basic",
    created_at: member.created_at,
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
  const { error } = await supabase
    .from('members')
    .update({
      name: member.name,
      nickname: member.nickname,
      phone: member.phone,
      plan_id: member.plan_id,
    })
    .eq('id', id);

  if (error) throw error;
};

export const deleteMemberFromDB = async (id: string) => {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id);

  if (error) throw error;
};