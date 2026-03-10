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
        "rounded-[2rem] border transition-all duration-500 overflow-hidden group/card",
        open 
          ? "bg-zinc-900/40 border-white/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]" 
          : "bg-zinc-900/20 border-white/5 hover:border-white/10"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-6 group/btn"
      >
        <div className="flex items-center gap-5">
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover/btn:scale-105"
            style={{ 
              backgroundColor: `${cfg.accent}10`, 
              border: `1px solid ${cfg.accent}20`,
              boxShadow: open ? `0 0 20px ${cfg.accent}15` : 'none'
            }}
          >
            <Icon size={24} style={{ color: cfg.accent }} />
          </div>
          <div className="text-left flex flex-col gap-0.5">
            <h3 className="font-black text-white text-lg tracking-tight group-hover/btn:text-white/90 transition-colors">
              {serviceName}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                {plans.length} Option{plans.length > 1 ? "s" : ""}
              </span>
              {activePlan && !open && (
                <>
                  <div className="h-1 w-1 rounded-full bg-zinc-700" />
                  <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-md bg-white/5 border border-white/10 uppercase tracking-tighter">
                    {activePlan.plan_name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!open && activePlan && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Active Monthly</span>
              <span className="text-sm font-black text-white tabular-nums">
                {currency === 'USD' ? '$' : '₹'}
                {(activePlan.price / (activePlan.interval === 'yearly' ? 12 : activePlan.interval === 'quarterly' ? 3 : 1)).toFixed(0)}
              </span>
            </div>
          )}
          
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center border transition-all duration-300",
              open 
                ? "bg-white border-white scale-90 shadow-lg" 
                : "bg-white/5 border-white/5 group-hover/btn:border-white/20"
            )}
          >
            <ChevronRight
              size={18}
              className={cn(
                "transition-all duration-500", 
                open ? "rotate-90 text-black stroke-[3]" : "text-zinc-500 group-hover/btn:text-zinc-300"
              )}
            />
          </div>
        </div>
      </button>

      {/* Plans Container */}
      <div
        className={cn(
          "transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center gap-3 mb-6 px-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Pick your tier</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          
          <div className="grid gap-2">
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
    </div>
  );
}