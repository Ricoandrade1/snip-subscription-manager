import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '-';
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const formatNextPaymentDate = (date: string | null | undefined): string => {
  if (!date) return '-';
  const nextDate = addDays(new Date(date), 30);
  return format(nextDate, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};