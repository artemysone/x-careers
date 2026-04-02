"use client";

import { useState } from "react";
import { chartData } from "@/lib/mock-data";

const timeRanges = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

function buildPath(data: typeof chartData, width: number, height: number) {
  const padding = 4;
  const min = Math.min(...data.map((d) => d.value)) - 10;
  const max = Math.max(...data.map((d) => d.value)) + 10;
  const xStep = (width - padding * 2) / (data.length - 1);

  const points = data.map((d, i) => ({
    x: padding + i * xStep,
    y: padding + ((max - d.value) / (max - min)) * (height - padding * 2),
  }));

  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cp1x = points[i - 1].x + xStep * 0.4;
    const cp1y = points[i - 1].y;
    const cp2x = points[i].x - xStep * 0.4;
    const cp2y = points[i].y;
    path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i].x},${points[i].y}`;
  }

  const fillPath = `${path} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

  return { linePath: path, fillPath };
}

export default function ScoreChart() {
  const [activeRange, setActiveRange] = useState("1M");
  const width = 600;
  const height = 140;
  const { linePath, fillPath } = buildPath(chartData, width, height);

  return (
    <div>
      {/* Time range tabs */}
      <div className="flex gap-1 mb-3">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
              activeRange === range
                ? "bg-x-blue/15 text-x-blue"
                : "text-x-muted hover:bg-x-hover"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d9bf0" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1d9bf0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fillPath} fill="url(#chartGradient)" />
          <path d={linePath} fill="none" stroke="#1d9bf0" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
