"use client";

interface TrendingFeedProps {
  onDM?: () => void; // reserved for future use
}

const hiringPosts = [
  {
    id: 1,
    company: "xAI",
    handle: "@xaboratory",
    logoUrl: "https://www.google.com/s2/favicons?domain=x.ai&sz=128",
    verified: true,
    time: "12m",
    title: "Senior AI Product Manager",
    location: "San Francisco, CA",
    salary: "$280K – $350K",
    tags: ["AI/ML", "Product Strategy", "LLMs"],
    content: "We're building the most powerful AI in the world. Looking for a Senior PM to lead our consumer product strategy. You'll work directly with the founding team to shape how millions interact with Grok.",
    applicants: 142,
    saves: 1800,
    shares: 430,
    grok: { match: 94, salaryVsMarket: "above", velocity: "High", insight: "Your AI/ML + Product Strategy skills are a direct fit" },
  },
  {
    id: 2,
    company: "Anthropic",
    handle: "@AnthropicAI",
    logoUrl: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
    verified: true,
    time: "1h",
    title: "Product Lead, Claude Platform",
    location: "San Francisco, CA · Remote",
    salary: "$300K – $380K",
    tags: ["AI Safety", "Product", "Platform"],
    content: "Join us in building safe, beneficial AI. We're looking for a Product Lead to drive the Claude platform roadmap — API, enterprise features, and developer experience. Must have strong opinions on AI safety and alignment.",
    applicants: 89,
    saves: 2400,
    shares: 670,
    grok: { match: 91, salaryVsMarket: "above", velocity: "High", insight: "Strong alignment with your platform experience" },
  },
  {
    id: 3,
    company: "OpenAI",
    handle: "@OpenAI",
    logoUrl: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    verified: true,
    time: "2h",
    title: "Head of Growth, ChatGPT",
    location: "San Francisco, CA",
    salary: "$320K – $400K",
    tags: ["Growth", "Product", "Consumer"],
    content: "ChatGPT has 200M+ weekly active users. We need a Head of Growth to take it to the next billion. You'll own user acquisition, activation, and retention across all surfaces. Experience scaling consumer products at 100M+ scale required.",
    applicants: 312,
    saves: 5200,
    shares: 1400,
    grok: { match: 78, salaryVsMarket: "above", velocity: "Very High", insight: "Growth focus is a partial match — strong comp" },
  },
  {
    id: 4,
    company: "Stripe",
    handle: "@stripe",
    logoUrl: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
    verified: true,
    time: "3h",
    title: "Staff Engineer, AI Infrastructure",
    location: "San Francisco, CA · Seattle, WA",
    salary: "$270K – $340K",
    tags: ["Infrastructure", "AI/ML", "Distributed Systems"],
    content: "We're embedding AI across every Stripe product. Looking for a Staff Engineer to architect our ML inference platform — low-latency, high-reliability systems processing millions of fraud and revenue optimization decisions per second.",
    applicants: 67,
    saves: 1100,
    shares: 280,
    grok: { match: 62, salaryVsMarket: "market", velocity: "Medium", insight: "Infra-heavy — consider upskilling systems design" },
  },
  {
    id: 5,
    company: "Tesla",
    handle: "@Tesla",
    logoUrl: "https://www.google.com/s2/favicons?domain=tesla.com&sz=128",
    verified: true,
    time: "4h",
    title: "Senior Robotics Engineer, Optimus",
    location: "Palo Alto, CA",
    salary: "$250K – $320K",
    tags: ["Robotics", "AI/ML", "Computer Vision"],
    content: "The Optimus humanoid robot program is scaling from prototype to production. We need engineers who can bridge perception, planning, and control. If you want to build the future of physical AI, this is the role.",
    applicants: 203,
    saves: 3800,
    shares: 920,
    grok: { match: 55, salaryVsMarket: "market", velocity: "High", insight: "Robotics is outside your portfolio — stretch role" },
  },
  {
    id: 6,
    company: "Figma",
    handle: "@figma",
    logoUrl: "https://www.google.com/s2/favicons?domain=figma.com&sz=128",
    verified: true,
    time: "5h",
    title: "Product Designer, AI Features",
    location: "San Francisco, CA · Remote",
    salary: "$200K – $260K",
    tags: ["Design", "AI/ML", "Product"],
    content: "AI is transforming design workflows. We're looking for a Product Designer to define how AI assists and augments the creative process in Figma. You'll prototype, test, and ship features used by millions of designers worldwide.",
    applicants: 178,
    saves: 2900,
    shares: 510,
    grok: { match: 68, salaryVsMarket: "below", velocity: "Medium", insight: "Design-focused — your product skills transfer well" },
  },
];

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toString();
}

export default function TrendingFeed({ onDM }: TrendingFeedProps) {
  return (
    <div>
      {hiringPosts.map((post) => (
        <div
          key={post.id}
          className="px-5 py-4 border-b border-x-border hover:bg-x-hover/50 transition-colors cursor-pointer"
        >
          {/* Company header */}
          <div className="flex items-center gap-2.5 mb-3">
            <img
              src={post.logoUrl}
              alt={post.company}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-bold text-[15px]">{post.company}</span>
            {post.verified && (
              <svg className="w-[18px] h-[18px] text-x-blue" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            )}
            <span className="text-x-muted text-[13px]">{post.handle}</span>
            <span className="text-x-muted text-[13px]">·</span>
            <span className="text-x-muted text-[13px]">{post.time}</span>
          </div>

          {/* Job details */}
          <div className="text-[17px] font-bold">{post.title}</div>
          <div className="flex items-center gap-3 mt-1 text-[13px] text-x-muted">
            <span>{post.location}</span>
            <span>·</span>
            <span className="text-x-green font-semibold">{post.salary}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-x-blue/10 text-x-blue text-[12px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-[14px] text-x-muted leading-relaxed mt-3">
            {post.content}
          </p>

          {/* Grok Insights */}
          <div className="mt-3 bg-x-dark rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <img src="https://www.google.com/s2/favicons?domain=grok.com&sz=128" alt="Grok" className="w-4 h-4" />
              <span className="text-[12px] font-semibold text-x-muted">Grok Analysis</span>
            </div>
            <div className="flex items-center gap-4 text-[13px]">
              <span className={`font-bold ${post.grok.match >= 85 ? "text-x-green" : post.grok.match >= 70 ? "text-x-blue" : "text-x-muted"}`}>
                {post.grok.match}% match
              </span>
              <span className="text-x-border">·</span>
              <span className={`${post.grok.salaryVsMarket === "above" ? "text-x-green" : post.grok.salaryVsMarket === "below" ? "text-x-red" : "text-x-muted"}`}>
                Salary {post.grok.salaryVsMarket === "above" ? "above" : post.grok.salaryVsMarket === "below" ? "below" : "at"} market
              </span>
              <span className="text-x-border">·</span>
              <span className={`${post.grok.velocity === "Very High" || post.grok.velocity === "High" ? "text-x-green" : "text-x-muted"}`}>
                Velocity: {post.grok.velocity}
              </span>
            </div>
            <p className="text-[13px] text-x-muted mt-1.5">{post.grok.insight}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 mt-3">
            <button className="w-10 h-10 rounded-[12px] bg-x-black border border-x-border flex items-center justify-center transition-colors hover:bg-x-hover text-x-muted hover:text-x-blue">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-[12px] bg-x-black border border-x-border flex items-center justify-center transition-colors hover:bg-x-hover text-x-muted hover:text-x-blue">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>
            <button
              onClick={onDM}
              className="w-10 h-10 rounded-[12px] bg-x-black border border-x-border flex items-center justify-center transition-colors hover:bg-x-hover"
            >
              <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] text-x-text" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
