"use client";

import { signalFeed } from "@/lib/mock-data";

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toString();
}

function renderContent(content: string) {
  // Convert **text** to bold spans
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const text = part.slice(2, -2);
      const isHandle = text.startsWith("@");
      return (
        <span key={i} className={isHandle ? "text-x-blue font-normal" : "text-x-text font-bold"}>
          {text}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function SignalFeed() {
  return (
    <div>
      {signalFeed.map((signal) => (
        <div
          key={signal.id}
          className="px-5 py-4 border-b border-x-border hover:bg-x-hover/50 transition-colors cursor-pointer flex gap-3"
        >
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold ${
              signal.type === "grok"
                ? "bg-gradient-to-br from-x-blue to-x-purple"
                : "bg-x-border"
            }`}
          >
            {signal.type === "grok" ? "G" : "A"}
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-1.5 text-[15px]">
              <span className="font-bold">{signal.name}</span>
              {signal.type === "grok" && (
                <svg className="w-[18px] h-[18px] text-x-purple" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                </svg>
              )}
              <span className="text-x-muted">{signal.handle}</span>
              <span className="text-x-muted">·</span>
              <span className="text-x-muted">{signal.time}</span>
            </div>

            {/* Content */}
            <p className="text-[15px] leading-relaxed mt-1 text-x-muted">
              {renderContent(signal.content)}
            </p>

            {/* Engagement */}
            <div className="flex gap-12 mt-3 text-[13px] text-x-muted">
              <button className="flex items-center gap-1.5 hover:text-x-red transition-colors group">
                <svg className="w-[18px] h-[18px] group-hover:bg-x-red/10 rounded-full p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {formatNumber(signal.likes)}
              </button>
              <button className="flex items-center gap-1.5 hover:text-x-green transition-colors group">
                <svg className="w-[18px] h-[18px] group-hover:bg-x-green/10 rounded-full p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
                {formatNumber(signal.reposts)}
              </button>
              <button className="flex items-center gap-1.5 hover:text-x-blue transition-colors">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
