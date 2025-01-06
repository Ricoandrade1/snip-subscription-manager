import { Member } from "@/contexts/MemberContext";

interface MemberCodeProps {
  member: Member;
  members: Member[];
}

export function getMemberCode({ member, members }: MemberCodeProps) {
  // Filter members with the same plan and sort them by creation date
  const samePlanMembers = members
    .filter(m => m.plan === member.plan)
    .sort((a, b) => {
      const dateA = new Date(a.created_at || '1970-01-01');
      const dateB = new Date(b.created_at || '1970-01-01');
      return dateA.getTime() - dateB.getTime();
    });
  
  // Find the index of the current member in the sorted array
  const memberIndex = samePlanMembers.findIndex(m => m.id === member.id);
  
  // Create the sequence number with leading zeros (4 digits)
  const sequenceNumber = String(memberIndex + 1).padStart(4, '0');
  
  return `${member.plan} ${sequenceNumber}`;
}