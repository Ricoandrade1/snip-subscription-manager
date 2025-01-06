import { ThemeType } from 'jspdf-autotable';

export interface TableConfig {
  startY: number;
  theme: ThemeType;
  styles: {
    fontSize: number;
    cellPadding: number;
    lineColor: number[];
    lineWidth: number;
  };
  headStyles: {
    fillColor: number[];
    textColor: number[];
    fontStyle: string;
    halign: string;
  };
  columnStyles: {
    [key: number]: { cellWidth: number };
  };
  margin: { top: number };
}