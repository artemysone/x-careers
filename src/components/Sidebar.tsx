"use client";

import { useState } from "react";
import { useSession } from "@/lib/use-session";

const navItems = [
  {
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h5.571c.511 0 .929-.41.929-.913v-7.075h3.143v7.075c0 .502.418.913.929.913h5.571c.511 0 .929-.41.929-.913V7.903c0-.301-.149-.584-.409-.757z" />
      </svg>
    ),
  },
  {
    label: "Explore",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
      </svg>
    ),
  },
  {
    label: "Notifications",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.858 16H5.134z" />
      </svg>
    ),
  },
  {
    label: "Chat",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 5.12 8-5.12V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 5.12-8-5.12V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z" />
      </svg>
    ),
  },
  {
    label: "Talent",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h4v4H7V7zm6 0h4v2h-4V7zm0 4h4v2h-4v-2zm-6 4h10v2H7v-2z" />
      </svg>
    ),
    active: true,
  },
  {
    label: "SuperGrok",
    icon: (
      <img src="https://www.google.com/s2/favicons?domain=grok.com&sz=128" alt="Grok" className="w-[26px] h-[26px] rounded-full" />
    ),
  },
  {
    label: "Premium+",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
      </svg>
    ),
  },
  {
    label: "Bookmarks",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z" />
      </svg>
    ),
  },
  {
    label: "More",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M3.75 12c0-4.56 3.69-8.25 8.25-8.25s8.25 3.69 8.25 8.25-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12zM12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zM8.25 12a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zm5.5 0a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zm3.75 1.75a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  onPost?: () => void;
}

export default function Sidebar({ onPost }: SidebarProps) {
  const [active, setActive] = useState("Talent");
  const { authenticated, user, loading, signIn, signOut } = useSession();

  return (
    <aside className="w-[260px] border-r border-x-border px-3 flex flex-col h-screen sticky top-0">
      {/* X Logo */}
      <div className="px-3 py-4 mb-1">
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-x-text" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActive(item.label);
            }}
            className={`flex items-center gap-5 px-3 py-3 rounded-full transition-colors hover:bg-x-hover ${
              active === item.label ? "font-bold" : "font-normal text-x-text"
            }`}
          >
            {item.icon}
            <span className="text-[20px]">{item.label}</span>
          </a>
        ))}
      </nav>

      <button
        onClick={onPost}
        className="mt-4 w-full py-3.5 rounded-full bg-x-text text-x-black font-bold text-[17px] hover:bg-x-text/90 transition-colors"
      >
        Post
      </button>

      {/* Profile / Sign in at bottom */}
      <div className="mt-auto py-3">
        {loading ? (
          <div className="p-3 text-center text-[13px] text-x-muted animate-pulse">Loading...</div>
        ) : authenticated && user ? (
          <div className="group relative">
            <div className="flex items-center gap-3 p-3 rounded-full hover:bg-x-hover cursor-pointer transition-colors">
              {user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={user.name} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-x-blue flex items-center justify-center text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold truncate">{user.name}</div>
                <div className="text-[13px] text-x-muted truncate">@{user.username}</div>
              </div>
              <span className="text-x-muted">···</span>
            </div>
            {/* Dropdown on hover */}
            <div className="absolute bottom-full left-0 right-0 mb-1 hidden group-hover:block">
              <button
                onClick={signOut}
                className="w-full px-4 py-3 bg-x-black border border-x-border rounded-2xl text-[15px] font-bold text-x-text hover:bg-x-hover transition-colors shadow-lg"
              >
                Sign out @{user.username}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={signIn}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-full border border-x-border hover:bg-x-hover transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-x-text" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-[15px] font-bold text-x-text">Sign in with X</span>
          </button>
        )}
      </div>
    </aside>
  );
}
