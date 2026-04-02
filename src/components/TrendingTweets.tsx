"use client";

import { useState, useEffect, useCallback } from "react";
import { getFeed } from "@/lib/api";
import type { FeedTweet } from "@/lib/api";

interface Tweet {
  id: number | string;
  name: string;
  handle: string;
  avatarUrl: string;
  verified: boolean;
  time: string;
  content: string;
  likes: number;
  reposts: number;
  views: number;
}

const mockTweets: Tweet[] = [
  {
    id: 1,
    name: "Elon Musk",
    handle: "@elonmusk",
    avatarUrl: "https://www.google.com/s2/favicons?domain=x.ai&sz=128",
    verified: true,
    time: "8m",
    content: "xAI is hiring exceptional engineers and product leaders. If you want to work on the most advanced AI in the world, DM @xaboratory or apply at x.ai/careers. We're moving fast.",
    likes: 42300,
    reposts: 8900,
    views: 12400000,
  },
  {
    id: 2,
    name: "Dario Amodei",
    handle: "@DarioAmodei",
    avatarUrl: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
    verified: true,
    time: "45m",
    content: "We're scaling our team significantly this quarter. Anthropic is hiring across research, engineering, product, and policy. If you care deeply about AI safety and want to work on Claude — we want to talk to you.\n\nanthropic.com/careers",
    likes: 8200,
    reposts: 2100,
    views: 3800000,
  },
  {
    id: 3,
    name: "Sam Altman",
    handle: "@sama",
    avatarUrl: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    verified: true,
    time: "1h",
    content: "we are hiring a LOT of engineers right now. if you're great at systems programming, ML infra, or distributed systems — reach out. the next 12 months at openai are going to be wild.",
    likes: 31400,
    reposts: 6200,
    views: 9100000,
  },
  {
    id: 4,
    name: "Tobi Lutke",
    handle: "@toaboratory",
    avatarUrl: "https://www.google.com/s2/favicons?domain=shopify.com&sz=128",
    verified: true,
    time: "2h",
    content: "Hot take: every company will need an AI product manager within 18 months. Not someone who \"knows about AI\" — someone who can ship AI-native products.\n\nWe're hiring 3 of them at Shopify right now. Best role in tech if you ask me.",
    likes: 14600,
    reposts: 3400,
    views: 5200000,
  },
  {
    id: 5,
    name: "Jensen Huang",
    handle: "@nvidia",
    avatarUrl: "https://www.google.com/s2/favicons?domain=nvidia.com&sz=128",
    verified: true,
    time: "3h",
    content: "NVIDIA is building the infrastructure for the AI era. We need thousands more engineers — GPU architects, CUDA developers, ML systems engineers. The demand for accelerated computing talent has never been higher.\n\nJoin us: nvidia.com/careers",
    likes: 22100,
    reposts: 4800,
    views: 7600000,
  },
  {
    id: 6,
    name: "Patrick Collison",
    handle: "@patrickc",
    avatarUrl: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
    verified: true,
    time: "4h",
    content: "We just opened 40+ new engineering roles at Stripe, many focused on AI/ML for fraud detection and revenue optimization. The intersection of finance and AI is one of the most impactful areas to work in right now.",
    likes: 9800,
    reposts: 2300,
    views: 4100000,
  },
  {
    id: 7,
    name: "Satya Nadella",
    handle: "@sataboratoryanadella",
    avatarUrl: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
    verified: true,
    time: "5h",
    content: "The AI platform shift is the biggest since cloud and mobile combined. Microsoft is hiring across Azure AI, Copilot, and our research labs. We need people who want to build AI that empowers every person and organization on the planet.",
    likes: 18700,
    reposts: 3900,
    views: 6300000,
  },
];

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const POLL_INTERVAL = 2 * 60 * 1000; // 2 minutes

export default function TrendingTweets() {
  const [tweets, setTweets] = useState<Tweet[]>(mockTweets);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchFeed = useCallback(async (signal?: AbortSignal) => {
    try {
      const feed = await getFeed();
      if (signal?.aborted) return;
      if (feed?.tweets?.length) {
        const mapped: Tweet[] = feed.tweets.map((t: FeedTweet) => ({
          id: t.id,
          name: t.authorName,
          handle: `@${t.authorUsername}`,
          avatarUrl: t.authorAvatar,
          verified: t.verified,
          time: t.createdAt ? timeAgo(t.createdAt) : "",
          content: t.text,
          likes: t.likes,
          reposts: t.retweets,
          views: t.views,
        }));
        setTweets(mapped);
        setIsLive(feed.isLive);
        setLastUpdated(feed.lastUpdated);
      }
    } catch {
      // API not configured — keep mock data
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchFeed(controller.signal).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    const interval = setInterval(() => fetchFeed(controller.signal), POLL_INTERVAL);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [fetchFeed]);

  return (
    <div>
      {(isLive || loading) && (
        <div className="px-5 py-2 border-b border-x-border flex items-center gap-2">
          {isLive && <span className="px-2 py-0.5 rounded-full bg-x-green/15 text-x-green text-[11px] font-semibold">LIVE</span>}
          {loading && <span className="text-[12px] text-x-muted animate-pulse">Searching X...</span>}
          <span className="text-[12px] text-x-muted">Real-time hiring posts from X</span>
          {lastUpdated && !loading && (
            <span className="text-[11px] text-x-muted ml-auto">Updated {timeAgo(lastUpdated)} ago</span>
          )}
        </div>
      )}
      {tweets.map((tweet) => (
        <div
          key={tweet.id}
          className="px-5 py-4 border-b border-x-border hover:bg-x-hover/50 transition-colors cursor-pointer flex gap-3"
        >
          {/* Avatar */}
          <img
            src={tweet.avatarUrl}
            alt={tweet.name}
            className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
          />

          {/* Body */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-1.5 text-[15px]">
              <span className="font-bold">{tweet.name}</span>
              {tweet.verified && (
                <svg className="w-[18px] h-[18px] text-x-blue" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                </svg>
              )}
              <span className="text-x-muted">{tweet.handle}</span>
              <span className="text-x-muted">·</span>
              <span className="text-x-muted">{tweet.time}</span>
            </div>

            {/* Content */}
            <p className="text-[15px] leading-relaxed mt-1 whitespace-pre-line">
              {tweet.content}
            </p>

            {/* Engagement */}
            <div className="flex gap-10 mt-3 text-[13px] text-x-muted">
              <button className="flex items-center gap-1.5 hover:text-x-blue transition-colors">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <button className="flex items-center gap-1.5 hover:text-x-green transition-colors">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
                {formatNumber(tweet.reposts)}
              </button>
              <button className="flex items-center gap-1.5 hover:text-x-red transition-colors">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {formatNumber(tweet.likes)}
              </button>
              <button className="flex items-center gap-1.5 hover:text-x-blue transition-colors">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3v18h18" /><path d="M7 17l4-8 4 4 4-6" />
                </svg>
                {formatNumber(tweet.views)}
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
