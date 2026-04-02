export const profileData = {
  name: "X Careers",
  handle: "@xcareers",
  avatar: "A",
  score: 847.3,
  change: 12.4,
  changePct: 1.5,
  percentile: 91,
  sector: "Product & AI",
  skills: ["Product Strategy", "AI / ML", "Engineering Mgmt", "Growth"],
  watchlistCount: 2400,
  repostCount: 891,
};

export const portfolioData = [
  { name: "Product Strategy", pct: 35, change: 3.1, color: "#1d9bf0" },
  { name: "AI / ML", pct: 25, change: 7.2, color: "#00ba7c" },
  { name: "Engineering Mgmt", pct: 20, change: 1.4, color: "#f59e0b" },
  { name: "Growth Strategy", pct: 12, change: 2.8, color: "#8b5cf6" },
  { name: "GTM Strategy", pct: 8, change: -0.5, color: "#ec4899" },
];

export const chartData = [
  { date: "Mar 1", value: 780 },
  { date: "Mar 3", value: 785 },
  { date: "Mar 5", value: 778 },
  { date: "Mar 7", value: 792 },
  { date: "Mar 9", value: 788 },
  { date: "Mar 11", value: 801 },
  { date: "Mar 13", value: 798 },
  { date: "Mar 15", value: 810 },
  { date: "Mar 17", value: 815 },
  { date: "Mar 19", value: 808 },
  { date: "Mar 21", value: 822 },
  { date: "Mar 23", value: 830 },
  { date: "Mar 25", value: 825 },
  { date: "Mar 27", value: 838 },
  { date: "Mar 29", value: 842 },
  { date: "Mar 31", value: 847 },
];

export const trendingSkills = [
  { name: "LLM Fine-tuning", category: "Skill · AI/ML", change: 18.4, roles: 2100 },
  { name: "Rust Systems", category: "Skill · Engineering", change: 12.1, roles: 890 },
  { name: "AI Safety Research", category: "Skill · Research", change: 9.3, roles: 340 },
  { name: "React Native", category: "Skill · Frontend", change: -6.7, roles: 4200 },
];

export const sectorIndex = [
  { name: "AI / ML", roles: 12400, change: 8.7 },
  { name: "Security", roles: 5600, change: 3.7 },
  { name: "Product", roles: 8900, change: 2.1 },
  { name: "Design", roles: 3200, change: 1.1 },
  { name: "Data Science", roles: 6100, change: 0.8 },
  { name: "Backend", roles: 15200, change: 0.3 },
  { name: "Frontend", roles: 14200, change: -0.5 },
  { name: "DevOps", roles: 7800, change: -1.3 },
];

export const signalFeed = [
  {
    id: 1,
    type: "grok" as const,
    name: "Grok",
    handle: "@grok",
    time: "2m",
    content:
      "**@xcareers** AI-native product management roles surged **8.7% this week**. Your portfolio is in the 91st percentile. 3 companies on your watchlist (xAI, Anthropic, OpenAI) posted matching senior PM roles in the last 24h.",
    likes: 142,
    reposts: 38,
  },
  {
    id: 2,
    type: "market" as const,
    name: "X Careers Market",
    handle: "@xcareers",
    time: "18m",
    content:
      "**Talent Market Alert:** LLM fine-tuning specialists saw the largest demand spike today at **+18.4%**. Driven by 6 new AI lab postings and 12 enterprise roles. Rust systems engineers also trending at +12.1%.",
    likes: 1200,
    reposts: 340,
  },
  {
    id: 3,
    type: "grok" as const,
    name: "Grok",
    handle: "@grok",
    time: "1h",
    content:
      "**Weekly Market Recap:** The talent market index rose 2.3% this week. Top sectors: AI/ML (+8.7%), Security (+3.7%), Product (+2.1%). Underperformers: Frontend (-0.5%), DevOps (-1.3%). Salary benchmarks for AI product leaders: $245K–$310K base in SF, up 8% QoQ.",
    likes: 3800,
    reposts: 1100,
  },
  {
    id: 4,
    type: "market" as const,
    name: "X Careers Market",
    handle: "@xcareers",
    time: "3h",
    content:
      "**Social Signal:** Your recent X thread on AI product strategy reached **12.4K impressions**. Portfolio visibility score increased +3.2 points. Keep publishing — you're 11 points away from \"High Visibility\" tier.",
    likes: 89,
    reposts: 22,
  },
  {
    id: 5,
    type: "grok" as const,
    name: "Grok",
    handle: "@grok",
    time: "5h",
    content:
      "**Earnings Impact:** Alphabet Q1 earnings beat expectations. GCP AI hiring projected to increase 15% next quarter — positive signal for AI/ML sector talent. Your portfolio exposure to this sector: 25%.",
    likes: 2100,
    reposts: 640,
  },
];

export const statsData = {
  marketRank: "Top 3%",
  demandScore: 92,
  salaryBenchmark: "$278K",
  visibility: 74,
};
