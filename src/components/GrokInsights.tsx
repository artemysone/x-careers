"use client";

import { useState, useEffect } from "react";
import { profileData } from "@/lib/mock-data";
import { grokInsights } from "@/lib/api";

interface Insight {
  title: string;
  body: string;
  type: "opportunity" | "warning" | "trend";
}

const fallbackInsights: Insight[] = [
  { title: "Lean into AI/ML", body: "Your AI/ML allocation is 25% but demand is surging at +8.7%. Increase your exposure — take on an AI-focused project or publish technical content to move this to 30%+.", type: "opportunity" },
  { title: "Boost your visibility", body: "Your visibility score is 74 — you're 11 points from \"High\" tier. Publishing 2 threads/week on X about AI product strategy could get you there in 3 weeks.", type: "trend" },
  { title: "3 companies want someone like you", body: "xAI, Anthropic, and OpenAI posted senior PM roles in the last 24h that match your profile. Your percentile ranking puts you in the top candidate pool.", type: "opportunity" },
];

const typeColors: Record<Insight["type"], { bg: string; text: string }> = {
  opportunity: { bg: "bg-x-green/15", text: "text-x-green" },
  warning: { bg: "bg-x-red/15", text: "text-x-red" },
  trend: { bg: "bg-x-blue/15", text: "text-x-blue" },
};

export default function GrokInsights() {
  const [insights, setInsights] = useState<Insight[]>(fallbackInsights);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    grokInsights({
      skills: profileData.skills,
      role: "Senior Product Manager",
      experience: "8 years",
      location: "San Francisco, CA",
    })
      .then((data) => {
        if (cancelled) return;
        if (data?.insights && Array.isArray(data.insights)) {
          setInsights(data.insights);
          setIsLive(true);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-x-dark rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <img src="https://www.google.com/s2/favicons?domain=grok.com&sz=128" alt="Grok" className="w-5 h-5 rounded-full" />
        <h2 className="text-xl font-extrabold">Grok Insights</h2>
        {isLive && (
          <span className="px-2 py-0.5 rounded-full bg-x-green/15 text-x-green text-[11px] font-semibold">LIVE</span>
        )}
        {loading && (
          <span className="text-[12px] text-x-muted animate-pulse">Analyzing...</span>
        )}
      </div>
      {insights.slice(0, 3).map((insight, i) => {
        const colors = typeColors[insight.type] || typeColors.trend;
        return (
          <div key={i} className="px-4 py-3 hover:bg-x-hover/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} text-[13px] font-bold flex-shrink-0 mt-0.5`}>
                {i + 1}
              </div>
              <div>
                <div className="text-[15px] font-bold">{insight.title}</div>
                <p className="text-[13px] text-x-muted leading-relaxed mt-0.5">
                  {insight.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
