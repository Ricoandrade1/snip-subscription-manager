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
        title,
        price,
        features
      ),
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

  if (membersError) {
    console.error('Erro ao buscar membros:', membersError);
    throw membersError;
  }

  console.log('Membros encontrados:', membersData);

  if (!membersData) {
    console.log('Nenhum membro encontrado');
    return [];
  }

  const formattedMembers = membersData.map(member => {
    return {
      id: member.id,
      name: member.name,
      nickname: member.nickname || '',
      phone: member.phone,
      nif: member.nif || '',
      birthDate: member.birth_date,
      passport: member.passport || '',
      citizenCard: member.citizen_card || '',
      bi: member.bi || '',
      bank: member.bank || '',
      iban: member.iban || '',
      debitDate: member.debit_date,
      plan: member.plans?.title || "Basic",
      created_at: member.created_at,
      nextPaymentDue: member.debit_date,
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
    } as Member;
  });

  console.log('Membros formatados:', formattedMembers);
  return formattedMembers;
};

export const addMemberToDB = async (member: Omit<Member, "id">) => {
  // First, get the plan_id based on the plan title
  const { data: planData, error: planError } = await supabase
    .from('plans')
    .select('id')
    .eq('title', member.plan)
    .single();

  if (planError) {
    console.error('Erro ao buscar plano:', planError);
    throw planError;
  }

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
  return data;
};

export const updateMemberInDB = async (id: string, member: Partial<Member>) => {
  let planId = null;
  if (member.plan) {
    const { data: planData } = await supabase
      .from('plans')
      .select('id')
      .eq('title', member.plan)
      .single();
    planId = planData?.id;
  }

  const { error } = await supabase
    .from('members')
    .update({
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
      ...(planId && { plan_id: planId })
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