"use client";

import { profileData } from "@/lib/mock-data";
import ScoreChart from "./ScoreChart";

export default function ScoreCard() {
  const p = profileData;

  return (
    <div className="px-5 pt-5 pb-4">
      {/* Human-readable headline */}
      <div className="mb-4">
        <h2 className="text-[22px] font-extrabold leading-snug">
          You're more in-demand than {p.percentile}% of product leaders in AI
        </h2>
        <p className="text-[15px] text-x-muted mt-2 leading-relaxed">
          Your demand is <span className="text-x-green font-semibold">rising</span> — up {p.changePct}% this month. Based on 12,400 open roles matching your profile across 840 companies.
        </p>
      </div>

      {/* Chart */}
      <div className="mt-3">
        <ScoreChart />
      </div>
    </div>
  );
}
