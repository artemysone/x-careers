"use client";

import { useState } from "react";
import ScoreCard from "@/components/ScoreCard";
import IndexDashboard from "@/components/IndexDashboard";
import TrendingTweets from "@/components/TrendingTweets";
import TrendingFeed from "@/components/TrendingFeed";
import TrendingSidebar from "@/components/TrendingSidebar";

const tabs = [
  {
    id: "For You" as const,
    label: "For You",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M12 1.75l2.22 6.83h7.18l-5.81 4.22 2.22 6.83L12 15.41l-5.81 4.22 2.22-6.83-5.81-4.22h7.18z" />
      </svg>
    ),
  },
  {
    id: "Explore" as const,
    label: "Explore",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
      </svg>
    ),
  },
  {
    id: "Watchlist" as const,
    label: "Watchlist",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
      </svg>
    ),
  },
] as const;

type Tab = (typeof tabs)[number]["id"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("For You");

  return (
    <div className="flex min-h-screen max-w-[1100px] mx-auto">
      {/* Left Nav */}
      <nav className="w-[72px] h-screen sticky top-0 flex flex-col items-center pt-4 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-x-hover ${
              activeTab === tab.id ? "text-x-text" : "text-x-muted"
            }`}
          >
            {tab.icon}
          </button>
        ))}

        {/* Grok */}
        <button
          title="Grok"
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-x-hover transition-colors text-x-muted"
        >
          <img src="https://www.google.com/s2/favicons?domain=grok.com&sz=128" alt="Grok" className="w-7 h-7" />
        </button>
      </nav>

      {/* Main Feed */}
      <main className="flex-1 max-w-[600px] border-x border-x-border">
        {activeTab === "For You" && (
          <>
            <ScoreCard />
            <IndexDashboard />
          </>
        )}
        {activeTab === "Explore" && <TrendingTweets />}
        {activeTab === "Watchlist" && <TrendingFeed />}
      </main>

      {/* Right Sidebar */}
      <TrendingSidebar />
    </div>
  );
}
