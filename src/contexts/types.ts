export type Member = {
  id: string;
  name: string;
  nickname: string | null;
  phone: string | null;
  nif: string | null;
  plan_id: number | null;
  plan: "Basic" | "Classic" | "Business";
  created_at?: string;
  due_date?: string;
};

export interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, "id" | "plan">) => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMembersByPlan: (plan: Member["plan"]) => number;
  isLoading: boolean;
}