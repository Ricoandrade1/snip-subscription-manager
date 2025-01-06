type PlanType = "Basic" | "Classic" | "Business";

const PLAN_PRICES: Record<PlanType, number> = {
  Basic: 30,    // 30€
  Classic: 40,  // 40€
  Business: 50  // 50€
};

export const getPlanPrice = (plan: PlanType): number => {
  return PLAN_PRICES[plan] || 0;
};