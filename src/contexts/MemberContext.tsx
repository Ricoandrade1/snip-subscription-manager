import React, { createContext, useContext, useState } from 'react';

export interface Member {
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
  phone: string; // New field
  plan: "Basic" | "Classic" | "Business";
  // Campos adicionais para relatórios e pagamentos
  lastPayment?: string;
  nextPaymentDue?: string;
  paymentHistory?: {
    date: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
    receiptUrl?: string;
  }[];
  // Campos para relatórios futuros
  visits?: {
    date: string;
    service: string;
    barber: string;
  }[];
}

interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, "id">) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  getMembersByPlan: (plan: Member["plan"]) => Member[];
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "João Silva",
      nickname: "João",
      nif: "123456789",
      birthDate: "1990-01-15",
      passport: "AB123456",
      citizenCard: "",
      bi: "",
      bank: "Banco do Brasil",
      iban: "PT50123456789012345678901",
      debitDate: "2024-03-01",
      phone: "+351 912 345 678",
      plan: "Basic",
      lastPayment: "2024-02-01",
      nextPaymentDue: "2024-03-01",
      paymentHistory: [
        {
          date: "2024-02-01",
          amount: 30,
          status: "paid",
        }
      ]
    },
    {
      id: "2",
      name: "Maria Santos",
      nickname: "Mari",
      nif: "987654321",
      birthDate: "1985-06-20",
      passport: "",
      citizenCard: "12345678",
      bi: "",
      bank: "Caixa Geral",
      iban: "PT50987654321098765432109",
      debitDate: "2024-03-05",
      phone: "+351 987 654 321",
      plan: "Classic",
      lastPayment: "2024-02-05",
      nextPaymentDue: "2024-03-05",
      paymentHistory: [
        {
          date: "2024-02-05",
          amount: 40,
          status: "paid",
        }
      ]
    },
    {
      id: "3",
      name: "António Ferreira",
      nickname: "Tony",
      nif: "456789123",
      birthDate: "1982-12-10",
      passport: "",
      citizenCard: "",
      bi: "87654321",
      bank: "Millennium BCP",
      iban: "PT50456789123456789123456",
      debitDate: "2024-03-10",
      phone: "+351 654 321 987",
      plan: "Business",
      lastPayment: "2024-02-10",
      nextPaymentDue: "2024-03-10",
      paymentHistory: [
        {
          date: "2024-02-10",
          amount: 50,
          status: "paid",
        }
      ]
    }
  ]);

  const addMember = (member: Omit<Member, "id">) => {
    const newMember = {
      ...member,
      id: Date.now().toString(),
    };
    setMembers([...members, newMember]);
  };

  const updateMember = (id: string, updatedFields: Partial<Member>) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, ...updatedFields } : member
    ));
  };

  const deleteMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const getMembersByPlan = (plan: Member["plan"]) => {
    return members.filter(member => member.plan === plan);
  };

  return (
    <MemberContext.Provider value={{ 
      members, 
      addMember, 
      updateMember, 
      deleteMember,
      getMembersByPlan
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
