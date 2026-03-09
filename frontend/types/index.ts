export interface Subscription {
  id: number;
  service_name: string;
  plan_name: string;
  price: number;
  currency: string;
  interval: string;
  last_updated: string;
  category?: "ai" | "ott" | "misc";
}

export type Category = "ai" | "ott" | "misc";
