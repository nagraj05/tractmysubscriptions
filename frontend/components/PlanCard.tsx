import { cn } from "@/lib/utils";
import { Subscription } from "@/types";
import { Check } from "lucide-react";

export default function PlanCard({
  plan,
  selected,
  onToggle,
  accent,
  displayCurrency,
  displayInterval,
  exchangeRate,
}: {
  plan: Subscription;
  selected: boolean;
  onToggle: () => void;
  accent: string;
  displayCurrency: "USD" | "INR";
  displayInterval: "monthly" | "yearly";
  exchangeRate: number | null;
}) {
  const currencySymbol = displayCurrency === "USD" ? "$" : "₹";
  
  const getDisplayPrice = () => {
    const originalPrice = Number(plan.price);
    const originalCurrency = plan.currency || "USD";
    
    // Convert to target currency
    let targetPrice = originalPrice;
    if (exchangeRate) {
      if (originalCurrency === "USD" && displayCurrency === "INR") targetPrice = originalPrice * exchangeRate;
      if (originalCurrency === "INR" && displayCurrency === "USD") targetPrice = originalPrice / exchangeRate;
    }
    
    
    // Normalize to monthly
    let monthlyPrice = targetPrice;
    if (plan.interval === "yearly") monthlyPrice = targetPrice / 12;
    if (plan.interval === "quarterly") monthlyPrice = targetPrice / 3;
    
    // Re-normalize to target interval
    if (displayInterval === "yearly") return monthlyPrice * 12;
    return monthlyPrice;
  };

  const displayPrice = getDisplayPrice();

  return (
    <button
      onClick={onToggle}
      className={cn(
        "group relative w-full flex items-center justify-between px-5 py-5 rounded-2xl border transition-all duration-300 active:scale-[0.98] text-left overflow-hidden",
        selected
          ? "bg-white/5 border-white/20 shadow-2xl"
          : "bg-zinc-900/20 border-white/5 hover:bg-white/5 hover:border-white/10"
      )}
    >
      {/* Selection Indicator Background */}
      {selected && (
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ background: `radial-gradient(circle at 100% 0%, ${accent} 0%, transparent 70%)` }}
        />
      )}

      <div className="flex items-center gap-4 relative z-10">
        <div
          className={cn(
            "h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-300",
            selected 
              ? "bg-white border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
              : "bg-transparent border-white/20 group-hover:border-white/40"
          )}
        >
          {selected && <Check size={12} className="text-black stroke-[3]" />}
        </div>
        
        <div className="flex flex-col gap-0.5">
          <span className={cn(
            "font-bold text-sm transition-colors",
            selected ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
          )}>
            {plan.plan_name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 font-extrabold">
              {plan.interval}
            </span>
            {plan.interval === "yearly" && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-wider">
                Best Value
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end relative z-10">
        <div className="flex items-baseline gap-1">
          <span className={cn(
            "text-xl font-black transition-colors",
            selected ? "text-white" : "text-zinc-300 group-hover:text-white"
          )}>
            {currencySymbol}{displayPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            /{displayInterval === 'monthly' ? 'mo' : 'yr'}
          </span>
        </div>
      </div>
    </button>
  );
}