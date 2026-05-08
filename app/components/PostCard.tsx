"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { Post } from "@/lib/supabase";
import { driveDownloadUrl } from "@/lib/drive";
import { togglePosted } from "../actions";

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export default function PostCard({ post, number }: { post: Post; number: number }) {
  const [, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleToggleClick = () => {
    if (dismissing) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!confirming) {
      setConfirming(true);
      timerRef.current = setTimeout(() => {
        setConfirming(false);
        timerRef.current = null;
      }, 4000);
      return;
    }

    setDismissing(true);
    timerRef.current = setTimeout(() => {
      startTransition(async () => {
        await togglePosted(post.id, !post.posted);
      });
      timerRef.current = null;
    }, 450);
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(post.caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadUrl = driveDownloadUrl(post.video_url);
  const num = number.toString().padStart(3, "0");

  const restingClass = post.posted ? "btn-toggle-on" : "btn-toggle-off";
  const restingLabel = post.posted ? "Catalogued" : "Awaiting post";
  const confirmLabel = post.posted ? "Move to awaiting →" : "Mark as posted →";
  const ariaLabel = confirming
    ? post.posted ? "Confirm move to awaiting" : "Confirm mark as posted"
    : post.posted ? "Move to awaiting" : "Mark as posted";

  return (
    <article className={`entry ${post.posted ? "entry-posted" : ""} ${dismissing ? "entry-dismissing" : ""}`}>
      {post.posted && <span className="stamp" aria-hidden="true">Posted</span>}

      <div className="entry-header">
        <span className="entry-number">Entry №&nbsp;{num}</span>
        <span className="entry-rule" />
        <span className="entry-date">{formatDate(post.created_at)}</span>
      </div>

      <p className="entry-caption" title={post.caption}>{post.caption}</p>

      <div className="entry-actions">
        <button onClick={onCopy} className="btn">
          <span className="dot" />
          {copied ? "Copied" : "Copy caption"}
        </button>
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          Download video ↓
        </a>
        <a href={post.video_url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          Open in Drive ↗
        </a>
        <button
          onClick={handleToggleClick}
          disabled={dismissing}
          className={`btn-toggle ${confirming ? "btn-toggle-confirm" : restingClass}`}
          aria-label={ariaLabel}
        >
          <span className="pip" />
          {confirming ? confirmLabel : restingLabel}
        </button>
      </div>
    </article>
  );
}
