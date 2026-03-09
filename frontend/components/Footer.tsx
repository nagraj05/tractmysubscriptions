export default function Footer() {
  return (
    <footer className="relative max-w-5xl mx-auto px-6 py-10 mt-16 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
        Vault Protocol v1.4.2
      </div>
      <div className="flex gap-6">
        {["Documentation", "API Status", "Security"].map((item) => (
          <span
            key={item}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 hover:text-zinc-400 cursor-pointer transition-colors"
          >
            {item}
          </span>
        ))}
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-700">
        © 2026 Antigravity Systems
      </div>
    </footer>
  );
}
