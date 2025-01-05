import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductServiceForm } from "@/components/pdv/forms/ProductServiceForm";
import { ProductServiceGrid } from "@/components/pdv/ProductServiceGrid";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DebtInfo {
  member_name: string;
  amount: number;
  due_date: string;
  days_overdue: number;
}

const CashFlow = () => {
  const [debts, setDebts] = useState<DebtInfo[]>([]);

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        amount,
        payment_date,
        member:members (
          name
        )
      `)
      .eq('status', 'overdue');

    if (error) {
      toast.error("Erro ao carregar dívidas");
      return;
    }

    const formattedDebts = data.map(debt => {
      const dueDate = new Date(debt.payment_date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        member_name: debt.member?.name || 'Cliente não encontrado',
        amount: debt.amount,
        due_date: debt.payment_date,
        days_overdue: diffDays
      };
    });

    setDebts(formattedDebts);
  };

  const totalDebt = debts.reduce((acc, debt) => acc + debt.amount, 0);

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold text-barber-gold">Fluxo de Caixa</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-barber-black border-barber-gray">
          <CardHeader>
            <CardTitle className="text-barber-gold">Dívidas em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold text-barber-light">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(totalDebt)}
              </div>
              
              <div className="space-y-2">
                {debts.map((debt, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg bg-barber-gray border border-barber-gray/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-barber-light">{debt.member_name}</h3>
                        <p className="text-sm text-barber-light/60">
                          Vencimento: {format(new Date(debt.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-barber-light">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(debt.amount)}
                        </p>
                        <p className="text-sm text-red-500">
                          {debt.days_overdue} dias em atraso
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-barber-black border-barber-gray">
          <CardHeader>
            <CardTitle className="text-barber-gold">Produtos e Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductServiceGrid />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashFlow;