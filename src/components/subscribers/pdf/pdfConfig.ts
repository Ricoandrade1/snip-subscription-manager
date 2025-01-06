import { TableConfig, tableHeaders } from './types';

export const tableConfig: TableConfig = {
  startY: 50,
  theme: 'grid',
  styles: {
    fontSize: 8,
    cellPadding: 2,
    lineColor: [128, 128, 128],
    lineWidth: 0.2,
  },
  headStyles: {
    fillColor: [26, 26, 26],
    textColor: [191, 155, 48],
    fontStyle: 'bold',
    halign: 'center',
  },
  columnStyles: {
    0: { cellWidth: 25 },
    1: { cellWidth: 40 },
    2: { cellWidth: 30 },
    3: { cellWidth: 25 },
    4: { cellWidth: 30 },
    5: { cellWidth: 30 },
  },
  margin: { top: 10 },
};

export { tableHeaders };