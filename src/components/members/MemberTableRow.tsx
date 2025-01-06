import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Member } from "@/contexts/MemberContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MemberTableRowProps {
  member: Member;
  memberCode: string;
  onClick: () => void;
}

export function MemberTableRow({ member, memberCode, onClick }: MemberTableRowProps) {
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "Basic":
        return "bg-blue-500 hover:bg-blue-600";
      case "Classic":
        return "bg-purple-500 hover:bg-purple-600";
      case "Business":
        return "bg-barber-gold hover:bg-barber-gold/90";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Tem certeza que deseja excluir este membro?')) {
      return;
    }

    try {
      // First check if there are any payments associated with this member
      const { data: payments, error: checkError } = await supabase
        .from('payments')
        .select('id')
        .eq('member_id', member.id)
        .limit(1);

      if (checkError) throw checkError;

      if (payments && payments.length > 0) {
        setPaymentId(payments[0].id);
        setShowErrorDialog(true);
        return;
      }

      // If no payments are found, proceed with deletion
      const { error: deleteError } = await supabase
        .from('members')
        .delete()
        .eq('id', member.id);

      if (deleteError) throw deleteError;
      
      toast.success('Membro excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
      toast.error('Erro ao excluir membro');
    }
  };

  return (
    <>
      <TableRow 
        className="group cursor-pointer hover:bg-barber-gray/50 border-b border-barber-gray transition-colors relative"
        onClick={onClick}
      >
        <TableCell className="font-medium text-barber-light">{memberCode}</TableCell>
        <TableCell className="text-barber-light">{member.name}</TableCell>
        <TableCell className="text-barber-light">{member.nickname || '-'}</TableCell>
        <TableCell>
          <Badge className={`${getPlanBadgeColor(member.plan)}`}>
            {member.plan}
          </Badge>
        </TableCell>
        <TableCell className="text-barber-light">{member.phone || '-'}</TableCell>
        <TableCell className="text-barber-light">
          {member.payment_date 
            ? format(new Date(member.payment_date), "dd/MM/yyyy", { locale: ptBR })
            : '-'}
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Não é possível excluir este membro
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Este membro não pode ser excluído pois já possui pagamentos registrados no sistema.
            </p>
            {paymentId && (
              <p className="text-sm text-muted-foreground">
                ID do pagamento associado: {paymentId}
              </p>
            )}
            <Button 
              variant="outline" 
              onClick={() => setShowErrorDialog(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}