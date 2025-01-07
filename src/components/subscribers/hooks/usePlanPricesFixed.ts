import { useState } from "react";

export function usePlanPricesFixed() {
  const [planPrices] = useState<Record<string, number>>({
    Basic: 30,
    Classic: 40,
    Business: 50
  });

  return planPrices;
}