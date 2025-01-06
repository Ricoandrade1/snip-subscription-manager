export interface TableConfig {
  startY: number;
  theme: string;
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