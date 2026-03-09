export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="relative p-6 rounded-3xl bg-zinc-900/50 border border-white/[0.07] overflow-hidden group hover:border-white/10 transition-all">
      <div
        className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"
        style={{ backgroundColor: accent, transform: "translate(50%, -50%)" }}
      />
      <div
        className="h-10 w-10 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}25` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-1">{label}</div>
      <div className="text-3xl font-black text-white tracking-tight">{value}</div>
      <div className="text-[11px] text-zinc-600 mt-1 font-medium">{sub}</div>
    </div>
  );
}