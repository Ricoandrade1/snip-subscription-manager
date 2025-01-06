import { ThemeType, FontStyle } from 'jspdf-autotable';

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
    fontStyle: FontStyle;
    halign: string;
  };
  columnStyles: {
    [key: number]: {
      cellWidth: number;
    };
  };
  margin: {
    top: number;
  };
  head: string[][];
  body: string[][];
}