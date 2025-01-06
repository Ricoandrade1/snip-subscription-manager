import { TableConfig } from "./types";

export const tableHeaders = [
  'Nome', 
  'Telefone', 
  'NIF', 
  'Plano', 
  'Data Pagamento',
  'Próximo Pagamento',
  'Status'
];

export const tableConfig: TableConfig = {
  startY: 50,
  theme: 'grid' as const,
  styles: {
    fontSize: 8,
    cellPadding: 2,
    lineColor: [200, 200, 200],
    lineWidth: 0.1,
  },
  headStyles: {
    fillColor: [51, 51, 51],
    textColor: [255, 255, 255],
    fontStyle: 'bold',
    halign: 'center',
  },
  columnStyles: {
    0: { cellWidth: 40 }, // Nome
    1: { cellWidth: 25 }, // Telefone
    2: { cellWidth: 20 }, // NIF
    3: { cellWidth: 20 }, // Plano
    4: { cellWidth: 25 }, // Data Pagamento
    5: { cellWidth: 25 }, // Próximo Pagamento
    6: { cellWidth: 20 }, // Status
  },
  margin: { top: 10 },
};