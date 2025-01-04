import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { Member, MemberContextType } from './types';
import { 
  fetchMembersFromDB, 
  addMemberToDB, 
  updateMemberInDB, 
  deleteMemberFromDB 
} from './memberUtils';

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const formattedMembers = await fetchMembersFromDB();
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      toast.error('Erro ao carregar membros');
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (member: Omit<Member, "id">) => {
    try {
      const newMember = await addMemberToDB(member);
      setMembers(prev => [...prev, { ...member, id: newMember.id }]);
      toast.success('Membro adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast.error('Erro ao adicionar membro');
    }
  };

  const updateMember = async (id: string, updatedFields: Partial<Member>) => {
    try {
      await updateMemberInDB(id, updatedFields);
      setMembers(prev =>
        prev.map(member =>
          member.id === id ? { ...member, ...updatedFields } : member
        )
      );
      toast.success('Membro atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      toast.error('Erro ao atualizar membro');
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await deleteMemberFromDB(id);
      setMembers(prev => prev.filter(member => member.id !== id));
      toast.success('Membro removido com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar membro:', error);
      toast.error('Erro ao remover membro');
    }
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