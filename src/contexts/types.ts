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
  plan_id: number;
  plan: "Basic" | "Classic" | "Business";
  created_at?: string;
  nextPaymentDue?: string;
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

export interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, "id">) => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMembersByPlan: (plan: Member["plan"]) => number;
  isLoading: boolean;
}