import { Bot, Layers, Tv } from "lucide-react";
import { Category } from "../types";

export const SERVICE_ICONS: Record<string, string> = {
  "ChatGPT": "/icons/chatgpt-icon.svg",
  "Claude": "/icons/claude-ai-icon.svg",
  "Cursor": "/icons/cursor-ai-code-icon.svg",
  "Gemini": "/icons/google-gemini-icon.svg",
  "Perplexity": "/icons/perplexity-ai-icon.svg",
  "Netflix": "/icons/netflix-icon.svg",
  "Prime Video":"/icons/amazon-prime-icon.svg"
};

export const CATEGORY_CONFIG = {
  ai: {
    label: "AI Tools",
    icon: Bot,
    accent: "#6EE7B7",
    bg: "from-emerald-950/60 to-zinc-950/40",
    pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "shadow-emerald-500/10",
    services: ["Claude", "OpenAI", "Cursor", "Midjourney", "Perplexity", "Gemini", "ChatGPT", "Antigravity"],
  },
  ott: {
    label: "Streaming & OTT",
    icon: Tv,
    accent: "#F472B6",
    bg: "from-pink-950/60 to-zinc-950/40",
    pill: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    glow: "shadow-pink-500/10",
    services: ["Netflix", "Spotify", "Disney+", "Prime Video", "Apple TV+", "YouTube", "Hotstar"],
  },
  misc: {
    label: "Miscellaneous",
    icon: Layers,
    accent: "#A78BFA",
    bg: "from-violet-950/60 to-zinc-950/40",
    pill: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    glow: "shadow-violet-500/10",
    services: [],
  },
} as const;

export function categorize(serviceName: string): Category {
  const name = serviceName.toLowerCase();
  
  if (CATEGORY_CONFIG.ai.services.some((s) => {
    const sLower = s.toLowerCase();
    return name.includes(sLower) || sLower.includes(name);
  })) return "ai";
  
  if (CATEGORY_CONFIG.ott.services.some((s) => {
    const sLower = s.toLowerCase();
    return name.includes(sLower) || sLower.includes(name);
  })) return "ott";
  
  return "misc";
}
