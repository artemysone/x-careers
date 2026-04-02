"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { grokChat, type GrokMessage } from "@/lib/api";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  openTo?: string; // e.g. "grok" to open directly to Grok chat
}

const existingChats = [
  { id: "grok", name: "Grok", handle: "@grok", time: "Now", preview: "Ask me anything about the career market...", logo: "https://www.google.com/s2/favicons?domain=grok.com&sz=128", verified: true },
  { id: "xai", name: "xAI Recruiting", handle: "@xaboratory", time: "2d", preview: "You: Interested in the Senior PM role...", logo: "https://www.google.com/s2/favicons?domain=x.ai&sz=128", verified: true },
  { id: "anthropic", name: "Anthropic Talent", handle: "@AnthropicAI", time: "1w", preview: "You: Following up on the Claude Platform...", logo: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128", verified: true },
  { id: "openai", name: "OpenAI Careers", handle: "@OpenAI", time: "3w", preview: "You: Would love to chat about the Head of...", logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=128", verified: true },
];

const xaiConversation = [
  {
    from: "them",
    name: "xAI Recruiting",
    time: "Mar 28",
    text: "Hi! Thanks for your interest in the Senior AI Product Manager role. We took a look at your X Careers profile — your composite index and AI/ML portfolio allocation are really impressive.",
  },
  {
    from: "them",
    name: "xAI Recruiting",
    time: "Mar 28",
    text: "Would you be open to a 30-minute call with our Head of Product this week? We think there could be a strong fit.",
  },
  {
    from: "me",
    time: "Mar 29",
    text: "Absolutely — I'd love to chat. I've been following Grok's progress closely and have some ideas on how to expand the consumer product surface. What times work?",
  },
  {
    from: "them",
    name: "xAI Recruiting",
    time: "Mar 29",
    text: "Great to hear! How about Thursday at 2pm PT? I'll send a calendar invite. Also, feel free to share any portfolio links or recent work you'd like us to review beforehand.",
  },
  {
    from: "me",
    time: "Mar 29",
    text: "Thursday at 2pm works perfectly. I'll send over my X Careers portfolio link — it has my full career breakdown, skill allocations, and some of my recent X threads on AI product strategy.",
  },
  {
    from: "them",
    name: "xAI Recruiting",
    time: "Mar 29",
    text: "Perfect. Calendar invite sent. Looking forward to it! 🚀",
  },
];

interface ChatMessage {
  from: "me" | "them";
  name?: string;
  time: string;
  text: string;
}

export default function ChatModal({ isOpen, onClose, openTo }: ChatModalProps) {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [grokMessages, setGrokMessages] = useState<ChatMessage[]>([]);
  const [grokHistory, setGrokHistory] = useState<GrokMessage[]>([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [grokMessages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && openTo) setActiveChat(openTo);
  }, [isOpen, openTo]);

  const sendGrokMessage = async () => {
    if (!inputValue.trim() || sending) return;
    const userText = inputValue.trim();
    setInputValue("");

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setGrokMessages((prev) => [...prev, { from: "me", time: now, text: userText }]);

    const newHistory: GrokMessage[] = [...grokHistory, { role: "user", content: userText }];
    setGrokHistory(newHistory);
    setSending(true);

    try {
      const reply = await grokChat(userText, grokHistory);
      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setGrokMessages((prev) => [...prev, { from: "them", name: "Grok", time: replyTime, text: reply }]);
      setGrokHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch {
      setGrokMessages((prev) => [
        ...prev,
        { from: "them", name: "Grok", time: now, text: "Grok API not configured. Add your XAI_API_KEY to .env.local to enable live chat." },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const activeConvo = activeChat === "grok" ? grokMessages : activeChat === "xai" ? xaiConversation : null;
  const activeChatData = existingChats.find((c) => c.id === activeChat);

  return (
    <div className="fixed bottom-0 right-6 w-[400px] h-[520px] bg-x-black border border-x-border rounded-t-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-x-border">
        <div className="flex items-center gap-3">
          {activeChat ? (
            <button
              onClick={() => setActiveChat(null)}
              className="w-8 h-8 rounded-full hover:bg-x-hover flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-x-text" fill="currentColor">
                <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
              </svg>
            </button>
          ) : null}
          {activeChat && activeChatData ? (
            <div className="flex items-center gap-2">
              <img src={activeChatData.logo} alt={activeChatData.name} className="w-6 h-6 rounded-full" />
              <span className="text-[15px] font-bold">{activeChatData.name}</span>
              <svg className="w-[16px] h-[16px] text-x-blue" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            </div>
          ) : (
            <>
              <h2 className="text-[17px] font-bold">Chat</h2>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-x-border text-[13px] text-x-text font-medium cursor-pointer">
                All
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] text-x-muted" fill="currentColor">
                  <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z" />
                </svg>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!activeChat && (
            <>
              <button className="w-8 h-8 rounded-full hover:bg-x-hover flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-x-text" fill="currentColor">
                  <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.04.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.25.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.59-2.54c.04-.2-.04-.41-.21-.53L1.75 13.46v-2.92l2.36-1.57c.17-.12.25-.33.21-.53l-.59-2.54 2.17-2.17 2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.46 2l-1.4 2.11c-.45.68-1.31 1-2.12.81l-2.27-.53-.72.72.53 2.27c.19.81-.13 1.67-.81 2.12L3.75 12l1.46.97c.68.45 1 1.31.81 2.12l-.53 2.27.72.72 2.27-.53c.81-.19 1.67.13 2.12.81L12 20.25l.97-1.46c.45-.68 1.31-1 2.12-.81l2.27.53.72-.72-.53-2.27c-.19-.81.13-1.67.81-2.12L20.25 12l-1.46-.97c-.68-.45-1-1.31-.81-2.12l.53-2.27-.72-.72-2.27.53c-.81.19-1.67-.13-2.12-.81L12 3.75zM12 10a2 2 0 100 4 2 2 0 000-4zm-3.75 2a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" />
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-x-hover flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-x-text" fill="currentColor">
                  <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 5.12 8-5.12V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 5.12-8-5.12V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z" />
                </svg>
              </button>
            </>
          )}
          <button className="w-8 h-8 rounded-full hover:bg-x-hover flex items-center justify-center transition-colors">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-x-text" fill="currentColor">
              <path d="M3 3h7v2H5v5H3V3zm11 0h7v7h-2V5h-5V3zM5 14v5h5v2H3v-7h2zm14 0v5h-5v2h7v-7h-2z" />
            </svg>
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-x-hover flex items-center justify-center transition-colors">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-x-text" fill="currentColor">
              <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z" />
            </svg>
          </button>
        </div>
      </div>

      {activeChat && activeConvo !== null ? (
        <>
          {/* Conversation view */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {activeChat === "grok" && activeConvo.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <img src="https://www.google.com/s2/favicons?domain=grok.com&sz=128" alt="Grok" className="w-12 h-12 mb-3" />
                <p className="text-[15px] font-semibold">Ask Grok anything</p>
                <p className="text-[13px] text-x-muted mt-1">Career market trends, salary benchmarks, job advice — powered by xAI.</p>
              </div>
            )}
            {activeConvo.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.from === "me" ? "order-1" : ""}`}>
                  {msg.from === "them" && (
                    <div className="flex items-center gap-2 mb-1">
                      <img src={activeChatData?.logo} alt="" className="w-5 h-5 rounded-full" />
                      <span className="text-[13px] font-bold">{msg.name}</span>
                      <span className="text-[11px] text-x-muted">{msg.time}</span>
                    </div>
                  )}
                  {msg.from === "me" && (
                    <div className="flex justify-end mb-1">
                      <span className="text-[11px] text-x-muted">{msg.time}</span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
                      msg.from === "me"
                        ? "bg-x-blue text-white rounded-2xl rounded-br-sm"
                        : "bg-x-dark text-x-text rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-x-dark rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-x-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-x-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-x-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="px-4 py-3 border-t border-x-border">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && activeChat === "grok") {
                      e.preventDefault();
                      sendGrokMessage();
                    }
                  }}
                  placeholder={activeChat === "grok" ? "Ask Grok..." : "Start a new message"}
                  className="w-full px-4 py-2.5 rounded-full bg-x-dark border border-x-border text-[14px] text-x-text placeholder-x-muted focus:outline-none focus:border-x-blue transition-colors"
                />
              </div>
              <button
                onClick={() => { if (activeChat === "grok") sendGrokMessage(); }}
                disabled={sending || !inputValue.trim()}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${inputValue.trim() && !sending ? "bg-x-blue text-white" : "text-x-muted"}`}
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
                  <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c.089 1.936.455 3.858.842 5.534L16.764 13H5.981zM5.981 11h10.783L7.823 5.466c-.487 1.676-.753 3.598-.842 5.534z" />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Search */}
          <div className="px-4 py-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-x-muted" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 rounded-full bg-x-dark border border-transparent text-[14px] text-x-text placeholder-x-muted focus:outline-none focus:border-x-blue focus:bg-x-black transition-colors"
              />
            </div>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto">
            {existingChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-x-hover/50 transition-colors cursor-pointer"
              >
                <img src={chat.logo} alt={chat.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[15px]">
                    <span className="font-bold truncate">{chat.name}</span>
                    {chat.verified && (
                      <svg className="w-[16px] h-[16px] text-x-blue flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                      </svg>
                    )}
                    <span className="text-x-muted text-[13px] flex-shrink-0">{chat.time}</span>
                  </div>
                  <div className="text-[13px] text-x-muted truncate">{chat.preview}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
