import { FileBarChart2, FileText, FileSpreadsheet, Scissors } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarberProductionReport } from "@/components/reports/BarberProductionReport";
import { SalesReport } from "@/components/reports/SalesReport";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export default function Reports() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleGeneratePDF = (reportType: string) => {
    try {
      // PDF generation logic will be implemented per report type
      toast.success(`Relatório ${reportType} gerado com sucesso!`);
    } catch (error) {
      toast.error("Erro ao gerar relatório");
    }
  };

  const reports = [
    {
      id: "sales",
      title: "Relatório de Vendas",
      description: "Análise detalhada das vendas por período",
      icon: FileBarChart2,
      path: "/reports/sales",
      details: [
        "Visualize o total de vendas por período",
        "Análise de métodos de pagamento",
        "Comparativo de vendas mensais",
        "Desempenho por categoria de produto"
      ]
    },
    {
      id: "customers",
      title: "Relatório de Clientes",
      description: "Informações sobre clientes e assinaturas",
      icon: FileText,
      path: "/reports/customers",
      details: [
        "Distribuição de clientes por plano",
        "Taxa de renovação de assinaturas",
        "Histórico de visitas",
        "Análise de retenção"
      ]
    },
    {
      id: "products",
      title: "Relatório de Produtos",
      description: "Análise de estoque e movimentação",
      icon: FileSpreadsheet,
      path: "/reports/products",
      details: [
        "Produtos mais vendidos",
        "Controle de estoque",
        "Margem de lucro por produto",
        "Histórico de preços"
      ]
    },
    {
      id: "barbers",
      title: "Produção de Barbeiros",
      description: "Análise de produção e receita por barbeiro",
      icon: Scissors,
      path: "/reports/barbers",
      details: [
        "Produtividade por barbeiro",
        "Comissões geradas",
        "Serviços realizados",
        "Avaliações de clientes"
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-barber-gold mb-6">Relatórios</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {reports.map((report) => (
          <div key={report.id}>
            <Card 
              className="bg-barber-black border-barber-gold/20 hover:border-barber-gold transition-colors cursor-pointer"
              onClick={() => setOpenDialog(report.id)}
            >
              <CardHeader className="flex flex-row items-center space-x-4">
                <report.icon className="h-8 w-8 text-barber-gold" />
                <div>
                  <CardTitle className="text-barber-gold">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-barber-light/60">{report.description}</p>
              </CardContent>
            </Card>

            <Dialog open={openDialog === report.id} onOpenChange={() => setOpenDialog(null)}>
              <DialogContent className="bg-barber-black border-barber-gold/20 max-w-7xl mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-barber-gold flex items-center gap-2 text-2xl">
                    <report.icon className="h-6 w-6" />
                    {report.title}
                  </DialogTitle>
                  <DialogDescription className="text-barber-light/60 text-lg">
                    {report.description}
                  </DialogDescription>
                </DialogHeader>
                
                {report.id === "sales" && <SalesReport />}
                {report.id === "barbers" && <BarberProductionReport />}
                
                {/* Outros relatórios serão implementados aqui */}
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
