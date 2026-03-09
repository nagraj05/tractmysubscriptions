import { cn } from "@/utils/utils";
import { Subscription } from "@/types";

export default function PlanCard({
  plan,
  selected,
  onToggle,
  accent,
}: {
  plan: Subscription;
  selected: boolean;
  onToggle: () => void;
  accent: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "group relative w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 active:scale-[0.97] text-left",
        selected
          ? "bg-white/10 border-white/20 shadow-lg"
          : "bg-white/3 border-white/5 hover:bg-white/6 hover:border-white/10"
      )}
      style={selected ? { boxShadow: `0 0 0 1px ${accent}40, 0 4px 24px ${accent}15` } : {}}
    >
      {/* Radio dot */}
      <div className="flex items-center gap-3">
        <div
          className="h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all"
          style={selected ? { borderColor: accent } : { borderColor: "#3f3f46" }}
        >
          {selected && (
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
          )}
        </div>
        <div>
          <span className="font-semibold text-sm text-white">{plan.plan_name}</span>
          <span className="ml-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            {plan.interval}
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-lg font-black" style={selected ? { color: accent } : { color: "#fff" }}>
          ${Number(plan.price).toFixed(0)}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">/mo</span>
      </div>
    </button>
  );
}