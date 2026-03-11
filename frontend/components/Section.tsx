import { CATEGORY_CONFIG } from "@/config/categoryConfig";
import { Subscription, Category } from "@/types";
import ServiceCard from "./ServiceCard";

interface SectionProps {
  category: Category;
  groups: Record<string, Subscription[]>;
  selectedPlanIds: Record<string, number>;
  onToggle: (service: string, id: number) => void;
  currency: "USD" | "INR";
  interval: "monthly" | "yearly";
  exchangeRate: number | null;
}

export default function Section({
  category,
  groups,
  selectedPlanIds,
  onToggle,
  currency,
  interval,
  exchangeRate,
}: SectionProps) {
  const cfg = CATEGORY_CONFIG[category];
  const Icon = cfg.icon;
  const services = Object.entries(groups);
  if (services.length === 0) return null;

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
          style={{ backgroundColor: `${cfg.accent}15` }}
        >
          <Icon size={16} style={{ color: cfg.accent }} />
        </div>
        <h2 className="text-sm font-black uppercase tracking-[0.25em] text-muted-foreground">{cfg.label}</h2>
        <div className="flex-1 h-px bg-border mx-4 opacity-50" />
        <span
          className="text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest"
          style={{ color: cfg.accent, backgroundColor: `${cfg.accent}10`, borderColor: `${cfg.accent}25` }}
        >
          {services.length} {services.length === 1 ? 'service' : 'services'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(([name, plans]) => (
          <ServiceCard
            key={name}
            serviceName={name}
            plans={plans}
            category={category}
            selectedPlanId={selectedPlanIds[name]}
            onToggle={(id) => onToggle(name, id)}
            currency={currency}
            interval={interval}
            exchangeRate={exchangeRate}
          />
        ))}
      </div>
    </section>
  );
}
