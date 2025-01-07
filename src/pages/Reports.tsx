import { FileBarChart2, FileText, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Reports() {
  const navigate = useNavigate();

  const reports = [
    {
      title: "Relatório de Vendas",
      description: "Análise detalhada das vendas por período",
      icon: FileBarChart2,
      path: "/reports/sales"
    },
    {
      title: "Relatório de Clientes",
      description: "Informações sobre clientes e assinaturas",
      icon: FileText,
      path: "/reports/customers"
    },
    {
      title: "Relatório de Produtos",
      description: "Análise de estoque e movimentação",
      icon: FileSpreadsheet,
      path: "/reports/products"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-barber-gold mb-6">Relatórios</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card 
            key={report.title}
            className="bg-barber-black border-barber-gold/20 hover:border-barber-gold transition-colors cursor-pointer"
            onClick={() => navigate(report.path)}
          >
            <CardHeader className="flex flex-row items-center space-x-4">
              <report.icon className="h-8 w-8 text-barber-gold" />
              <div>
                <CardTitle className="text-barber-gold">{report.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-barber-light/60">{report.description}</p>
              <Button 
                variant="outline" 
                className="mt-4 w-full border-barber-gold/20 hover:border-barber-gold text-barber-gold"
              >
                Ver Relatório
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}