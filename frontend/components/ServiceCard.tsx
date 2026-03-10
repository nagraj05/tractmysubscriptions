import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import PlanCard from "./PlanCard";
import { CATEGORY_CONFIG } from "@/config/categoryConfig";
import { Subscription } from "@/types";
export default function ServiceCard({
  serviceName,
  plans,
  category,
  selectedPlanId,
  onToggle,
  currency,
  interval,
  exchangeRate,
}: {
  serviceName: string;
  plans: Subscription[];
  category: "ai" | "ott" | "misc";
  selectedPlanId: number | undefined;
  onToggle: (id: number) => void;
  currency: "USD" | "INR";
  interval: "monthly" | "yearly";
  exchangeRate: number;
}) {
  const [open, setOpen] = useState(false);
  const cfg = CATEGORY_CONFIG[category];
  const Icon = cfg.icon;
  const activePlan = plans.find((p) => p.id === selectedPlanId);

  return (
    <div
      className={cn(
        "rounded-3xl border border-border overflow-hidden transition-all duration-300",
        open ? "bg-muted/50" : "bg-card hover:bg-muted/30"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 group"
      >
        <div className="flex items-center gap-4">
          <div
            className="h-11 w-11 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${cfg.accent}15`, border: `1px solid ${cfg.accent}30` }}
          >
            <Icon size={20} style={{ color: cfg.accent }} />
          </div>
          <div className="text-left">
            <div className="font-bold text-foreground text-base">{serviceName}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              {plans.length} plan{plans.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {activePlan && (
            <span
              className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-3 py-1 rounded-full border"
              style={{ color: cfg.accent, backgroundColor: `${cfg.accent}12`, borderColor: `${cfg.accent}30` }}
            >
              {activePlan.plan_name}
            </span>
          )}
          <div
            className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center border transition-all",
              open ? "bg-accent border-border" : "bg-muted border-border hover:bg-accent/50"
            )}
          >
            <ChevronRight
              size={16}
              className={cn("text-muted-foreground transition-transform duration-300", open && "rotate-90")}
            />
          </div>
        </div>
      </button>

      {/* Plans */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out overflow-hidden",
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 pb-5 space-y-2 pt-1">
          <div className="h-px bg-border mb-4 opacity-50" />
          {plans
            .sort((a, b) => a.price - b.price)
            .map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlanId === plan.id}
                onToggle={() => onToggle(plan.id)}
                accent={cfg.accent}
                displayCurrency={currency}
                displayInterval={interval}
                exchangeRate={exchangeRate}
              />
            ))}
        </div>
      </div>
    </div>
  );
}