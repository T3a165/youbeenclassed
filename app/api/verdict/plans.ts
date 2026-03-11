export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    description: "5 verdicts per day",
    features: ["Basic verdicts", "S-F ranking", "Text analysis up to 500 chars"],
    limits: { daily: 5, maxLength: 500 },
  },
  CASUAL: {
    name: "Casual",
    price: 9,
    description: "50 verdicts per day",
    features: ["Full verdicts with strengths/weaknesses", "Up to 2000 chars", "Priority processing"],
    limits: { daily: 50, maxLength: 2000 },
  },
  PRO: {
    name: "Pro",
    price: 29,
    description: "200 verdicts per day",
    features: ["Detailed analysis", "Up to 5000 chars", "Context assessment", "API access"],
    limits: { daily: 200, maxLength: 5000 },
  },
  TEAM: {
    name: "Team",
    price: 99,
    description: "1000 verdicts per day",
    features: ["Team analytics", "Up to 10000 chars", "Shared verdicts", "Admin dashboard"],
    limits: { daily: 1000, maxLength: 10000 },
  },
} as const;

export type PlanType = keyof typeof PLANS;
