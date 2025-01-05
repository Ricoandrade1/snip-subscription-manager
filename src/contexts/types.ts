export type Member = {
  id: string;
  name: string;
  nickname: string;
  phone: string;
  plan_id: number;
  plan: "Basic" | "Classic" | "Business";
  created_at?: string;
};

export interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, "id" | "plan">) => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMembersByPlan: (plan: Member["plan"]) => number;
  isLoading: boolean;
}