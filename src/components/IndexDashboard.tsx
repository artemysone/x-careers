"use client";

import { portfolioData } from "@/lib/mock-data";

// Sectors relevant to THIS user's portfolio (not the full market)
const yourSectors = [
  { name: "Product", roles: 8900, change: 2.1, color: "#1d9bf0" },
  { name: "AI / ML", roles: 12400, change: 8.7, color: "#00ba7c" },
  { name: "Engineering Mgmt", roles: 4200, change: 1.4, color: "#f59e0b" },
  { name: "Growth", roles: 3100, change: 2.8, color: "#8b5cf6" },
  { name: "GTM / Strategy", roles: 2800, change: -0.5, color: "#ec4899" },
];

function StorySection({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-5">
      {children}
    </div>
  );
}

export default function IndexDashboard() {
  const topSkill = portfolioData[0];
  const risingSkill = portfolioData.reduce((a, b) => (b.change > a.change ? b : a));

  return (
    <div>
      {/* Section: What you're worth */}
      <StorySection>
        <h3 className="text-[15px] font-bold mb-3">Your market position</h3>
        <div className="bg-x-dark rounded-2xl p-5">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[32px] font-extrabold">$278K</div>
              <div className="text-[13px] text-x-muted mt-0.5">median base salary for your profile in SF</div>
            </div>
            <div className="text-right">
              <div className="text-x-green font-semibold text-[15px]">▲ +8%</div>
              <div className="text-[12px] text-x-muted">vs. last quarter</div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-x-black rounded-xl p-3 text-center">
              <div className="text-[18px] font-bold">$245K</div>
              <div className="text-[11px] text-x-muted mt-0.5">25th percentile</div>
            </div>
            <div className="flex-1 bg-x-black rounded-xl p-3 text-center">
              <div className="text-[18px] font-bold">$278K</div>
              <div className="text-[11px] text-x-muted mt-0.5">median</div>
            </div>
            <div className="flex-1 bg-x-black rounded-xl p-3 text-center">
              <div className="text-[18px] font-bold">$340K</div>
              <div className="text-[11px] text-x-muted mt-0.5">75th percentile</div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* Section: Your strongest skill */}
      <StorySection>
        <h3 className="text-[15px] font-bold mb-3">Your career portfolio</h3>
        <p className="text-[14px] text-x-muted leading-relaxed mb-4">
          Your strongest asset is <span className="text-x-text font-semibold">{topSkill.name}</span> at {topSkill.pct}% of your portfolio.{" "}
          <span className="text-x-text font-semibold">{risingSkill.name}</span> is your fastest-growing skill, up <span className="text-x-green font-semibold">{risingSkill.change}%</span> this month.
        </p>

        {/* Portfolio bar */}
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
          {portfolioData.map((skill) => (
            <div
              key={skill.name}
              style={{ width: `${skill.pct}%`, backgroundColor: skill.color }}
              className="rounded-full"
            />
          ))}
        </div>

        {portfolioData.map((skill) => (
          <div key={skill.name} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: skill.color }} />
              <span className="text-[14px]">{skill.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-semibold">{skill.pct}%</span>
              <span className={`text-[13px] font-medium ${skill.change >= 0 ? "text-x-green" : "text-x-red"}`}>
                {skill.change >= 0 ? "▲ +" : "▼ "}{skill.change}%
              </span>
            </div>
          </div>
        ))}
      </StorySection>

    </div>
  );
}
