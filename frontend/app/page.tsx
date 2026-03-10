"use client";

import { useEffect, useState, useMemo } from "react";
import {
  RefreshCw,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Sparkles,
  ArrowUp,
  Layers,
  CheckCircle2,
  Bot,
  ChevronDown,
} from "lucide-react";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import Section from "@/components/Section";
import { categorize, CATEGORY_CONFIG } from "@/config/categoryConfig";
import { Subscription } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanIds, setSelectedPlanIds] = useState<
    Record<string, number>
  >({});
  const [displayCurrency, setDisplayCurrency] = useState<"USD" | "INR">("INR");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [exchangeRate, setExchangeRate] = useState<number>(83.0);

  const fetchSubscriptions = async () => {
    try {
      setError(null);
      const res = await fetch(`/api/subscriptions`);
      if (!res.ok) throw new Error("Backend server error");
      const data = await res.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      setError("Failed to connect to backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const res = await fetch('/api/exchange-rate');
      const data = await res.json();
      if (data.rate) setExchangeRate(data.rate);
    } catch (e) {
      console.error("Failed to fetch exchange rate", e);
    }
  };

  const handleScrape = async (service: string) => {
    const toastId = toast.loading(`Scraping ${service}...`);
    setScraping(service);
    setError(null);
    try {
      const endpoint = `/api/scrape/${service.toLowerCase()}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`${service} scraping service unavailable`);
      await fetchSubscriptions();
      toast.success(`${service} updated successfully`, { id: toastId });
    } catch (error) {
      console.error("Scraping failed:", error);
      const msg = `${service} scraping failed. Check server logs.`;
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setScraping(null);
    }
  };

  const handleScrapeAll = async () => {
    const services = ["Cursor", "Claude", "Netflix", "Prime", "Hotstar", "AppleTV"];
    toast.info("Starting bulk scrape for 6 services");
    for (const service of services) {
      await handleScrape(service);
    }
    toast.success("Bulk scrape completed");
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchExchangeRate();
  }, []);

  // Group by category
  const categorized = useMemo(() => {
    const result: Record<
      "ai" | "ott" | "misc",
      Record<string, Subscription[]>
    > = {
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

  const convertPrice = (price: number, from: string) => {
    if (from === "USD" && displayCurrency === "INR") return price * exchangeRate;
    if (from === "INR" && displayCurrency === "USD") return price / exchangeRate;
    return price;
  };

  const totalMonthlySpend = selectedPlans.reduce((acc, sub) => {
    const price = Number(sub.price) || 0;
    let monthlyPrice = price;
    if (sub.interval === "yearly") monthlyPrice = price / 12;
    if (sub.interval === "quarterly") monthlyPrice = price / 3;
    
    return acc + convertPrice(monthlyPrice, sub.currency || "USD");
  }, 0);

  const togglePlan = (serviceName: string, planId: number) => {
    setSelectedPlanIds((prev) => ({
      ...prev,
      [serviceName]: prev[serviceName] === planId ? -1 : planId,
    }));
  };

  const totalServices =
    Object.keys(categorized.ai).length +
    Object.keys(categorized.ott).length +
    Object.keys(categorized.misc).length;

  const currencySymbol = displayCurrency === "USD" ? "$" : "₹";

  return (
    <div>
      <div className="relative max-w-5xl mx-auto px-6 py-12 space-y-14">
        {/* Header and Toggles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-zinc-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Subscription Intelligence
              </span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none">
                Your Digital
                <br />
                <span className="text-zinc-600">Subscriptions</span>
              </h1>
              <div className="flex items-center gap-3 mt-4">
               <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase">
                    Live Rate: 1 USD = ₹{exchangeRate.toFixed(2)}
                  </span>
               </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Scraper Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 px-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-100 transition flex items-center gap-2">
                  <RefreshCw size={12} className={cn(scraping ? "animate-spin" : "")} />
                  Sync Vault
                  <ChevronDown size={14} className="opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-950/90 backdrop-blur-xl border-white/10 rounded-2xl p-2">
                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-3 py-2">
                  AI Tools
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleScrape("Cursor")} className="rounded-xl focus:bg-white focus:text-black py-2.5 cursor-pointer">
                  Cursor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleScrape("Claude")} className="rounded-xl focus:bg-white focus:text-black py-2.5 cursor-pointer">
                  Claude AI
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/5 my-2" />
                
                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-3 py-2">
                  OTT & Streaming
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleScrape("Netflix")} className="rounded-xl focus:bg-white focus:text-black py-2.5 cursor-pointer">
                  Netflix
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleScrape("Prime")} className="rounded-xl focus:bg-white focus:text-black py-2.5 cursor-pointer">
                  Amazon Prime
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleScrape("Hotstar")} className="rounded-xl focus:bg-white focus:text-black py-2.5 cursor-pointer">
                  Hotstar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleScrape("AppleTV")} className="rounded-xl focus:bg-white focus:text-black py-2.5 cursor-pointer">
                  Apple TV+
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/5 my-2" />
                
                <DropdownMenuItem onClick={handleScrapeAll} className="rounded-xl bg-emerald-500/10 text-emerald-400 focus:bg-emerald-500 focus:text-white py-2.5 font-black uppercase tracking-widest text-[9px] cursor-pointer">
                  Sync All Services
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Currency Toggle */}
            <div className="bg-zinc-900/40 p-1 rounded-xl border border-white/5 flex gap-1">
              {["USD", "INR"].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setDisplayCurrency(curr as "USD" | "INR")}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    displayCurrency === curr ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Billing Toggle */}
            <div className="bg-zinc-900/40 p-1 rounded-xl border border-white/5 flex gap-1">
              {["monthly", "yearly"].map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle as "monthly" | "yearly")}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    billingCycle === cycle ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>
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
            value={`${currencySymbol}${totalMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            sub="combined spend"
            accent="#6EE7B7"
          />
          <StatCard
            icon={TrendingUp}
            label="Annual"
            value={`${currencySymbol}${(totalMonthlySpend * 12).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
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
            <div className="flex flex-wrap justify-center gap-3 px-4">
              {["Cursor", "Claude", "Netflix", "Prime", "Hotstar", "AppleTV"].map((service) => (
                <button
                  key={service}
                  onClick={() => handleScrape(service)}
                  disabled={scraping === service}
                  className={cn(
                    "px-5 py-2.5 text-[10px] font-black rounded-xl transition uppercase tracking-widest border",
                    scraping === service 
                      ? "bg-zinc-800 text-zinc-500 border-zinc-700" 
                      : "bg-white/5 hover:bg-white text-white hover:text-black border-white/10"
                  )}
                >
                  {scraping === service ? (
                    <RefreshCw size={12} className="animate-spin inline mr-2" />
                  ) : null}
                  {service}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-14">
            <Section
              category="ai"
              groups={categorized.ai}
              selectedPlanIds={selectedPlanIds}
              onToggle={togglePlan}
              currency={displayCurrency}
              interval={billingCycle}
              exchangeRate={exchangeRate}
            />
            <Section
              category="ott"
              groups={categorized.ott}
              selectedPlanIds={selectedPlanIds}
              onToggle={togglePlan}
              currency={displayCurrency}
              interval={billingCycle}
              exchangeRate={exchangeRate}
            />
            <Section
              category="misc"
              groups={categorized.misc}
              selectedPlanIds={selectedPlanIds}
              onToggle={togglePlan}
              currency={displayCurrency}
              interval={billingCycle}
              exchangeRate={exchangeRate}
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
                    <span
                      className="text-[9px] font-black"
                      style={{ color: accent }}
                    >
                      {plan.service_name[0]}
                    </span>
                  </div>
                );
              })}
              {selectedPlans.length > 4 && (
                <div className="h-8 w-8 rounded-xl bg-white/5 border-2 border-[#080809] flex items-center justify-center">
                  <span className="text-[9px] font-black text-zinc-500">
                    +{selectedPlans.length - 4}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex-1 text-center">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                Total / mo
              </div>
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
    </div>
  );
}
