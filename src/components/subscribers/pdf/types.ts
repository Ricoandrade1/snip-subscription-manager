import { ThemeType, FontStyle } from 'jspdf-autotable';

type RGBColor = [number, number, number];
type HAlignType = 'left' | 'center' | 'right';

export interface TableConfig {
  startY: number;
  theme: ThemeType;
  styles: {
    fontSize: number;
    cellPadding: number;
    lineColor: RGBColor;
    lineWidth: number;
  };
  headStyles: {
    fillColor: RGBColor;
    textColor: RGBColor;
    fontStyle: FontStyle;
    halign: HAlignType;
  };
  columnStyles: {
    [key: number]: {
      cellWidth: number;
    };
  };
  margin: {
    top: number;
  };
}

export const tableHeaders = [
  'Nome',
  'Telefone',
  'NIF',
  'Plano',
  'Último Pagamento',
  'Próximo Pagamento',
  'Status'
];