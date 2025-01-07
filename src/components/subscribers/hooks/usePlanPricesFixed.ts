import { useState } from "react";

export function usePlanPricesFixed() {
  // Define os preços como números inteiros desde o início
  const [planPrices] = useState<Record<string, number>>({
    Basic: 30,
    Classic: 40,
    Business: 50
  });

  return planPrices;
}