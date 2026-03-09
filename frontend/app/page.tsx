"use client";

import { useEffect, useState, useMemo } from "react";
import {
  RefreshCw,
  CreditCard,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Sparkles,
  ArrowUp,
  Layers,
  CheckCircle2,
  Zap,
  Bot
} from "lucide-react";

import Footer from "@/components/Footer";
import StatCard from "@/components/StatCard";
import Section from "@/components/Section";
import { categorize, CATEGORY_CONFIG } from "@/config/categoryConfig";
import { Subscription } from "@/types";


// ─── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanIds, setSelectedPlanIds] = useState<Record<string, number>>({});

  const fetchSubscriptions = async () => {
    try {
      setError(null);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${apiBase}/api/subscriptions`);
      if (!res.ok) throw new Error("Backend server error");
      const data = await res.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      setError("Failed to connect to backend. Is the server running on port 3001?");
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async (service: string) => {
    setScraping(service);
    setError(null);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpoint =
        service === "all" ? "/api/subscriptions" : `/api/scrape/${service.toLowerCase()}`;
      const res = await fetch(`${apiBase}${endpoint}`);
      if (!res.ok) throw new Error(`${service} scraping service unavailable`);
      await fetchSubscriptions();
    } catch (error) {
      console.error("Scraping failed:", error);
      setError(`${service} scraping failed. Check backend logs.`);
    } finally {
      setScraping(null);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Group by category
  const categorized = useMemo(() => {
    const result: Record<"ai" | "ott" | "misc", Record<string, Subscription[]>> = {
      ai: {},
      ott: {},
      misc: {},
    };
    subscriptions.forEach((sub) => {
      const cat = categorize(sub.service_name);
      if (!result[cat][sub.service_name]) result[cat][sub.service_name] = [];
      result[cat][sub.service_name].push(sub);
    });
    return result;
  }, [subscriptions]);

  const selectedPlans = useMemo(() => {
    return Object.entries(selectedPlanIds)
      .map(([, id]) => subscriptions.find((s) => s.id === id))
      .filter(Boolean) as Subscription[];
  }, [selectedPlanIds, subscriptions]);

  const totalMonthlySpend = selectedPlans.reduce((acc, sub) => {
    const price = Number(sub.price) || 0;
    return acc + (sub.interval === "yearly" ? price / 12 : price);
  }, 0);

  const togglePlan = (serviceName: string, planId: number) => {
    setSelectedPlanIds((prev) => ({
      ...prev,
      [serviceName]: prev[serviceName] === planId ? -1 : planId,
    }));
  };

  const totalServices = Object.keys(categorized.ai).length +
    Object.keys(categorized.ott).length +
    Object.keys(categorized.misc).length;

  return (
    <div
      className="min-h-screen bg-[#080809] text-zinc-100 font-sans selection:bg-emerald-400 selection:text-black"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Ambient BG */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-pink-500/5 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-violet-500/5 blur-[120px] rounded-full" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* ── Header ── */}
      <header className="relative border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/10">
              <CreditCard size={18} className="text-black" />
            </div>
            <div>
              <span className="font-black text-white tracking-tight text-lg">Track</span>
              <span className="ml-1 text-zinc-600 font-black text-lg">My Subscriptions</span>
            </div>
          </div>

          {/* Status + Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/4 border border-white/[0.07]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Live</span>
            </div>

            <button
              onClick={() => handleScrape("cursor")}
              disabled={!!scraping}
              className="flex items-center gap-2 px-4 py-2 bg-white/7 hover:bg-white/12 border border-white/8 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-40"
            >
              {scraping === "cursor" ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
              Cursor
            </button>
            <button
              onClick={() => handleScrape("claude")}
              disabled={!!scraping}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400 transition-all disabled:opacity-40"
            >
              {scraping === "claude" ? <RefreshCw size={13} className="animate-spin" /> : <Bot size={13} />}
              Claude
            </button>
          </div>
        </div>
      </header>

      <div className="relative max-w-5xl mx-auto px-6 py-12 space-y-14">
        {/* ── Hero ── */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-zinc-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              Subscription Intelligence
            </span>
          </div>
          <h1 className="text-6xl font-black tracking-tight text-white leading-none">
            Your Digital
            <br />
            <span className="text-zinc-600">Subscriptions</span>
          </h1>
          <p className="text-zinc-500 text-base max-w-sm mt-3 leading-relaxed">
            Track AI tools, streaming, and everything else in one place.
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/8 border border-red-500/15 rounded-2xl text-red-400">
            <AlertCircle size={18} />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            label="Monthly"
            value={`$${totalMonthlySpend.toFixed(2)}`}
            sub="combined spend"
            accent="#6EE7B7"
          />
          <StatCard
            icon={TrendingUp}
            label="Annual"
            value={`$${(totalMonthlySpend * 12).toFixed(0)}`}
            sub="projected cost"
            accent="#F472B6"
          />
          <StatCard
            icon={Layers}
            label="Services"
            value={String(totalServices)}
            sub="connected"
            accent="#A78BFA"
          />
          <StatCard
            icon={CheckCircle2}
            label="Selected"
            value={String(selectedPlans.length)}
            sub="active plans"
            accent="#60A5FA"
          />
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-5">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              <div className="relative h-16 w-16 rounded-full border border-white/10 flex items-center justify-center">
                <RefreshCw className="animate-spin text-zinc-400" size={24} />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 animate-pulse">
              Loading vault…
            </p>
          </div>
        ) : totalServices === 0 ? (
          <div className="text-center py-32 rounded-3xl border border-dashed border-white/6 bg-zinc-900/20">
            <Bot size={40} className="mx-auto text-zinc-700 mb-4" />
            <h3 className="text-lg font-bold mb-2">Vault is empty</h3>
            <p className="text-zinc-600 text-sm mb-8 max-w-xs mx-auto">
              Sync a service to start tracking your subscriptions.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleScrape("cursor")}
                className="px-5 py-2.5 bg-white text-black text-xs font-black rounded-xl hover:bg-zinc-100 transition uppercase tracking-widest"
              >
                Connect Cursor
              </button>
              <button
                onClick={() => handleScrape("claude")}
                className="px-5 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black rounded-xl hover:bg-emerald-500/20 transition uppercase tracking-widest"
              >
                Connect Claude
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-14">
            <Section
              category="ai"
              groups={categorized.ai}
              selectedPlanIds={selectedPlanIds}
              onToggle={togglePlan}
            />
            <Section
              category="ott"
              groups={categorized.ott}
              selectedPlanIds={selectedPlanIds}
              onToggle={togglePlan}
            />
            <Section
              category="misc"
              groups={categorized.misc}
              selectedPlanIds={selectedPlanIds}
              onToggle={togglePlan}
            />
          </div>
        )}
      </div>

      {/* ── Sticky Bottom Bar ── */}
      {selectedPlans.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <div className="relative bg-zinc-900/90 backdrop-blur-2xl border border-white/10 p-3 pl-4 rounded-2xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4">
            {/* Plan badges */}
            <div className="flex -space-x-2">
              {selectedPlans.slice(0, 4).map((plan) => {
                const cat = categorize(plan.service_name);
                const accent = CATEGORY_CONFIG[cat].accent;
                return (
                  <div
                    key={plan.id}
                    className="h-8 w-8 rounded-xl flex items-center justify-center border-2 border-[#080809]"
                    style={{ backgroundColor: `${accent}20` }}
                  >
                    <span className="text-[9px] font-black" style={{ color: accent }}>
                      {plan.service_name[0]}
                    </span>
                  </div>
                );
              })}
              {selectedPlans.length > 4 && (
                <div className="h-8 w-8 rounded-xl bg-white/5 border-2 border-[#080809] flex items-center justify-center">
                  <span className="text-[9px] font-black text-zinc-500">+{selectedPlans.length - 4}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex-1 text-center">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Total / mo</div>
              <div className="text-2xl font-black text-white leading-none">
                ${totalMonthlySpend.toFixed(2)}
              </div>
            </div>

            {/* Scroll to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="h-10 w-10 bg-white text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}