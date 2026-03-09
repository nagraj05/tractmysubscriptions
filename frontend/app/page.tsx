"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  RefreshCw, 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  ChevronRight, 
  Zap, 
  Bot, 
  CheckCircle2,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Subscription {
  id: number;
  service_name: string;
  plan_name: string;
  price: number;
  currency: string;
  interval: string;
  last_updated: string;
}

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanIds, setSelectedPlanIds] = useState<Record<string, number>>({});
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setError(null);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ;
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
      const endpoint = service === 'all' ? '/api/subscriptions' : `/api/scrape/${service.toLowerCase()}`;
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

  const groupedSubscriptions = useMemo(() => {
    const groups: Record<string, Subscription[]> = {};
    subscriptions.forEach(sub => {
      if (!groups[sub.service_name]) groups[sub.service_name] = [];
      groups[sub.service_name].push(sub);
    });
    return groups;
  }, [subscriptions]);

  const selectedPlans = useMemo(() => {
    const plans: Subscription[] = [];
    Object.entries(selectedPlanIds).forEach(([service, id]) => {
      const plan = subscriptions.find(s => s.id === id);
      if (plan) plans.push(plan);
    });
    return plans;
  }, [selectedPlanIds, subscriptions]);

  const totalMonthlySpend = selectedPlans.reduce((acc, sub) => {
    const price = Number(sub.price) || 0;
    return acc + (sub.interval === 'yearly' ? price / 12 : price);
  }, 0);

  const togglePlan = (serviceName: string, planId: number) => {
    setSelectedPlanIds(prev => ({
      ...prev,
      [serviceName]: prev[serviceName] === planId ? -1 : planId
    }));
  };

  return (
    <div className="min-h-screen bg-[#050506] text-zinc-100 font-sans p-4 md:p-12 selection:bg-white selection:text-black">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="relative max-w-6xl mx-auto flex flex-col md:row justify-between items-start md:items-center gap-8 mb-16">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">System Live</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            Subscription <span className="text-zinc-500">Vault</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md">Smart tracking for your AI tools and media services.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleScrape('cursor')}
            disabled={!!scraping}
            className="group px-6 py-3 bg-white text-black font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
          >
            {scraping === 'cursor' ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            Sync Cursor
          </button>
          <button
            onClick={() => handleScrape('claude')}
            disabled={!!scraping}
            className="group px-6 py-3 bg-zinc-800 text-white font-bold rounded-2xl border border-white/5 hover:bg-zinc-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
          >
            {scraping === 'claude' ? <RefreshCw className="animate-spin" size={18} /> : <Bot size={18} />}
            Sync Claude
          </button>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto space-y-16">
        {error && (
          <div className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle size={22} />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Summary Dashboard */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 backdrop-blur-md transition-all hover:border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6 text-zinc-400">
              <div className="p-3 rounded-2xl bg-white/5 text-blue-400">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Monthly Budget</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">${totalMonthlySpend.toFixed(2)}</span>
              <span className="text-zinc-500 font-medium">/mo</span>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500 bg-white/5 w-fit px-3 py-1.5 rounded-full border border-white/5">
               <CheckCircle2 size={14} className="text-green-500" />
               Calculated from {selectedPlans.length} active plans
            </div>
          </div>

          <div className="group p-8 rounded-4xl bg-zinc-900/40 border border-white/5 backdrop-blur-md transition-all hover:border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6 text-zinc-400">
              <div className="p-3 rounded-2xl bg-white/5 text-purple-400">
                <DollarSign size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Annual Outlook</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">${(totalMonthlySpend * 12).toFixed(2)}</span>
              <span className="text-zinc-500 font-medium">/yr</span>
            </div>
            <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
              Based on current selections. Total cost including taxes and platform fees.
            </p>
          </div>

          <div className="group p-8 rounded-4xl bg-zinc-900/40 border border-white/5 backdrop-blur-md transition-all hover:border-white/10 shadow-2xl flex flex-col justify-center">
            <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Quick Stats</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-white">{Object.keys(groupedSubscriptions).length}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Services</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-white">{subscriptions.length}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Plan Options</div>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <CreditCard className="text-zinc-500" />
              Connected Services
            </h2>
            <div className="text-sm text-zinc-500 font-medium">
              Last update: {subscriptions[0] ? new Date(subscriptions[0].last_updated).toLocaleString() : 'Never'}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse rounded-full" />
                <RefreshCw className="animate-spin text-white relative" size={48} />
              </div>
              <p className="text-zinc-500 font-medium animate-pulse tracking-widest uppercase text-xs">Scanning Vault...</p>
            </div>
          ) : Object.keys(groupedSubscriptions).length === 0 ? (
            <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-white/5 bg-zinc-900/20 group">
              <div className="mb-6 flex justify-center">
                <div className="p-6 rounded-3xl bg-white/5 group-hover:scale-110 transition-transform">
                  <Bot size={48} className="text-zinc-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">The vault is empty</h3>
              <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Sync your first service to start tracking your automated pricing updates.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => handleScrape('cursor')} className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors uppercase tracking-widest">Connect Cursor</button>
                <button onClick={() => handleScrape('claude')} className="px-5 py-2.5 bg-zinc-800 text-white text-xs font-bold rounded-xl hover:bg-zinc-700 border border-white/5 transition-colors uppercase tracking-widest">Connect Claude</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {Object.entries(groupedSubscriptions).map(([serviceName, plans]) => (
                <div 
                  key={serviceName} 
                  className={cn(
                    "flex flex-col p-2 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 transition-all duration-500",
                    expandedService === serviceName ? "ring-2 ring-white/10 bg-zinc-900/60" : "hover:border-white/10"
                  )}
                >
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "p-5 rounded-[1.5rem] shadow-xl", 
                        serviceName === 'Cursor' ? "bg-[#252528] text-white" : "bg-zinc-100 text-black"
                      )}>
                        {serviceName === 'Cursor' ? <Zap size={28} /> : <Bot size={28} />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight">{serviceName}</h3>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{plans.length} available plans</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setExpandedService(expandedService === serviceName ? null : serviceName)}
                      className="p-3 rounded-2xl hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
                    >
                      <ChevronRight className={cn("transition-transform duration-300", expandedService === serviceName && "rotate-90")} size={24} />
                    </button>
                  </div>

                  <div className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out px-6",
                    expandedService === serviceName ? "max-h-[600px] pb-8 opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="grid gap-3 pt-4">
                      {plans.sort((a,b) => a.price - b.price).map(plan => (
                        <button
                          key={plan.id}
                          onClick={() => togglePlan(serviceName, plan.id)}
                          className={cn(
                            "group flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 active:scale-[0.98]",
                            selectedPlanIds[serviceName] === plan.id 
                              ? "bg-white text-black border-transparent shadow-lg shadow-white/5 translate-x-1" 
                              : "bg-white/5 border-white/5 text-white hover:bg-white/10 hover:border-white/10"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                selectedPlanIds[serviceName] === plan.id ? "border-black" : "border-zinc-700 group-hover:border-zinc-500"
                            )}>
                                {selectedPlanIds[serviceName] === plan.id && <div className="h-2 w-2 bg-black rounded-full" />}
                            </div>
                            <span className="font-bold text-lg">{plan.plan_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className={cn(
                                "text-xl font-black",
                                selectedPlanIds[serviceName] === plan.id ? "text-black" : "text-white"
                             )}>${Number(plan.price).toFixed(0)}</span>
                             <span className={cn(
                                "text-[10px] uppercase font-bold tracking-widest",
                                selectedPlanIds[serviceName] === plan.id ? "text-zinc-600" : "text-zinc-500"
                             )}>/MO</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Footer for Service */}
                  {selectedPlanIds[serviceName] && selectedPlanIds[serviceName] !== -1 && (
                    <div className="mt-auto px-6 pb-6 pt-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-500" size={16} />
                                <span className="text-xs font-bold text-zinc-300">Active Selection</span>
                            </div>
                            <span className="text-xs font-black text-white px-2 py-1 rounded bg-white/10 uppercase tracking-tighter">
                                {plans.find(p => p.id === selectedPlanIds[serviceName])?.plan_name}
                            </span>
                        </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Selected Summary Sticky Bar */}
        {selectedPlans.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 animate-in slide-in-from-bottom-8 duration-500">
                <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 p-4 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex items-center justify-between">
                    <div className="flex -space-x-3 pl-2">
                        {selectedPlans.map(plan => (
                             <div key={plan.id} className={cn(
                                "h-10 w-10 rounded-2xl flex items-center justify-center border-2 border-[#050506] shadow-lg",
                                plan.service_name === 'Cursor' ? "bg-zinc-800 text-white" : "bg-white text-black"
                             )}>
                                {plan.service_name === 'Cursor' ? <Zap size={16} /> : <Bot size={16} />}
                             </div>
                        ))}
                    </div>
                    <div className="px-6 flex flex-col items-center">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Live Combined Total</div>
                        <div className="text-3xl font-black text-white leading-none">${totalMonthlySpend.toFixed(2)}<span className="text-sm font-medium text-zinc-500 ml-1">/mo</span></div>
                    </div>
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="h-12 w-12 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10"
                    >
                        <ChevronRight size={24} className="-rotate-90" />
                    </button>
                </div>
            </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto mt-32 pb-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] pt-12">
        <div>Vault Protocol v1.4.2</div>
        <div className="flex gap-8">
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">API Status</span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Security</span>
        </div>
        <div>&copy; 2026 Antigravity Systems</div>
      </footer>
    </div>
  );
}
