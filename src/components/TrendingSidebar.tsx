"use client";

import GrokInsights from "@/components/GrokInsights";

const marketTrends = [
  { name: "xAI", type: "company", category: "AI Lab", detail: "42 open roles", change: 18 },
  { name: "LLM Fine-tuning", type: "skill", category: "AI/ML · Trending", detail: "4.2K mentions on X", change: 18.4 },
  { name: "Salesforce", type: "company", category: "Enterprise SaaS · Declining", detail: "Froze 1,200 roles", change: -14 },
  { name: "Rust", type: "skill", category: "Engineering · Trending", detail: "3.1K mentions on X", change: 12.1 },
  { name: "Oracle", type: "company", category: "Enterprise · Layoffs", detail: "Cut 18% of workforce", change: -18 },
  { name: "AI Safety", type: "skill", category: "Research · Trending", detail: "1.8K mentions on X", change: 9.3 },
  { name: "NVIDIA", type: "company", category: "Hardware", detail: "120 open roles", change: 22 },
  { name: "Prompt Engineering", type: "skill", category: "AI/ML · Trending", detail: "8.4K mentions on X", change: 6.8 },
  { name: "Stripe", type: "company", category: "Fintech", detail: "41 open roles", change: 8 },
  { name: "React Native", type: "skill", category: "Frontend · Declining", detail: "5.1K mentions on X", change: -6.7 },
];

export default function TrendingSidebar() {
  return (
    <aside className="w-[350px] p-4 h-screen sticky top-0 overflow-y-auto">
      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-x-muted" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-12 pr-5 py-3 rounded-full bg-x-dark border border-transparent text-[15px] text-x-text placeholder-x-muted focus:outline-none focus:border-x-blue focus:bg-x-black transition-colors"
        />
      </div>

      {/* Grok Insights */}
      <div className="mb-4">
        <GrokInsights />
      </div>

      {/* Market Trends */}
      <div className="bg-x-dark rounded-2xl overflow-hidden mb-4">
        <h2 className="text-xl font-extrabold px-4 pt-3 pb-2">Talent Market Trends</h2>
        {marketTrends.slice(0, 5).map((item) => (
          <div
            key={item.name}
            className="px-4 py-3 hover:bg-x-hover/50 transition-colors cursor-pointer flex items-center justify-between"
          >
            <div>
              <div className="text-[13px] text-x-muted">{item.category}</div>
              <div className="text-[15px] font-bold">{item.name}</div>
              <div className="text-[13px] text-x-muted">{item.detail}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-[13px] ${item.change > 0 ? "text-x-green" : "text-x-red"}`}>
                {item.change > 0 ? "▲" : "▼"} {item.change > 0 ? "+" : ""}{item.change}%
              </span>
              <span className="text-x-muted text-[18px] cursor-pointer hover:text-x-blue">···</span>
            </div>
          </div>
        ))}
        <div className="px-4 py-3 text-x-blue text-[15px] hover:bg-x-hover/50 cursor-pointer transition-colors">
          Show more
        </div>
      </div>

    </aside>
  );
}
