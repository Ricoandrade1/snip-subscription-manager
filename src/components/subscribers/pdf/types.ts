import { ThemeType } from 'jspdf-autotable';

type RGBColor = [number, number, number];

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
    fontStyle: string;
    halign: string;
  };
  columnStyles: {
    [key: number]: { cellWidth: number };
  };
  margin: { top: number };
}