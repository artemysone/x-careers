"use client";

import { useState } from "react";
import { postTweet } from "@/lib/api";

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComposeModal({ isOpen, onClose }: ComposeModalProps) {
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const charCount = text.length;
  const overLimit = charCount > 280;

  const handlePost = async () => {
    if (!text.trim() || overLimit || posting) return;
    setPosting(true);
    setResult(null);
    try {
      await postTweet(text);
      setResult({ success: true, message: "Posted to X!" });
      setText("");
      setTimeout(() => { setResult(null); onClose(); }, 1500);
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : "Failed to post",
      });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-[580px] bg-x-black border border-x-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => { setText(""); setResult(null); onClose(); }}
            className="w-9 h-9 rounded-full hover:bg-x-hover flex items-center justify-center transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-x-text" fill="currentColor">
              <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z" />
            </svg>
          </button>
          <button
            onClick={handlePost}
            disabled={!text.trim() || overLimit || posting}
            className={`px-5 py-2 rounded-full text-[15px] font-bold transition-colors ${
              text.trim() && !overLimit && !posting
                ? "bg-x-blue text-white hover:bg-x-blue/90"
                : "bg-x-blue/50 text-white/50 cursor-not-allowed"
            }`}
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Compose area */}
        <div className="px-4 pb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening in the talent market?"
            rows={5}
            className="w-full bg-transparent text-[18px] text-x-text placeholder-x-muted resize-none focus:outline-none leading-relaxed"
            autoFocus
          />

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-x-border pt-3 mt-2">
            <div className="text-[13px] text-x-muted">
              Posts to X as your authenticated account
            </div>
            <div className={`text-[13px] font-medium ${overLimit ? "text-x-red" : charCount > 250 ? "text-yellow-500" : "text-x-muted"}`}>
              {charCount}/280
            </div>
          </div>

          {/* Result feedback */}
          {result && (
            <div className={`mt-3 px-4 py-2 rounded-xl text-[14px] ${
              result.success ? "bg-x-green/15 text-x-green" : "bg-x-red/15 text-x-red"
            }`}>
              {result.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
