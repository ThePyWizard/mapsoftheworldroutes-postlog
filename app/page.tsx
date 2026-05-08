import Link from "next/link";
import { supabase, type Post } from "@/lib/supabase";
import { logout } from "./actions";
import PostCard from "./components/PostCard";

export const dynamic = "force-dynamic";

type View = "awaiting" | "catalogued";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: viewParam } = await searchParams;
  const view: View = viewParam === "catalogued" ? "catalogued" : "awaiting";

  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .order("created_at", { ascending: false });

  const all: Post[] = (data ?? []) as Post[];
  const total = all.length;
  const numbered = all.map((post, i) => ({ post, number: total - i }));
  const pending = numbered.filter(({ post }) => !post.posted);
  const posted = numbered.filter(({ post }) => post.posted);
  const pendingCount = pending.length;
  const cataloguedCount = total - pendingCount;
  const visible = view === "catalogued" ? posted : pending;

  return (
    <main className="container">
      <header className="masthead">
        <div className="masthead-eyebrow">
          <span>✦</span>
          <span>Maps of the World Routes</span>
          <span>·</span>
          <span>Private Logbook</span>
        </div>
        <h1 className="masthead-title">
          The Posting <span className="amp">&amp;</span> Travel Log
        </h1>
        <div className="masthead-meta">
          <span><strong>{pendingCount.toString().padStart(2, "0")}</strong> awaiting</span>
          <span className="masthead-meta-dot" />
          <span><strong>{cataloguedCount.toString().padStart(2, "0")}</strong> catalogued</span>
          <span className="masthead-meta-dot" />
          <span>est. mmxxiv</span>
          <form action={logout} className="masthead-actions">
            <button type="submit" className="btn-link">Sign off ↗</button>
          </form>
        </div>
      </header>

      <div className="route-divider" aria-hidden="true" />

      {error && <div className="error">{error.message}</div>}

      {!error && total > 0 && (
        <nav className="view-toggle" aria-label="Switch between awaiting and catalogued entries">
          <Link
            href="/?view=awaiting"
            scroll={false}
            replace
            className={`view-toggle-tab ${view === "awaiting" ? "is-active" : ""}`}
            aria-current={view === "awaiting" ? "page" : undefined}
          >
            <span className="view-toggle-label">Awaiting</span>
            <span className="view-toggle-count">{pendingCount.toString().padStart(2, "0")}</span>
          </Link>
          <Link
            href="/?view=catalogued"
            scroll={false}
            replace
            className={`view-toggle-tab ${view === "catalogued" ? "is-active" : ""}`}
            aria-current={view === "catalogued" ? "page" : undefined}
          >
            <span className="view-toggle-label">Catalogued</span>
            <span className="view-toggle-count">{cataloguedCount.toString().padStart(2, "0")}</span>
          </Link>
        </nav>
      )}

      {!error && total === 0 && (
        <div className="empty">
          The logbook is empty. Add a row to <code>contents</code> in Supabase and a new entry will appear here.
        </div>
      )}

      {!error && total > 0 && view === "awaiting" && pendingCount === 0 && (
        <div className="empty">
          ✦&nbsp;&nbsp;All caught up. Every entry catalogued.
        </div>
      )}

      {!error && total > 0 && view === "catalogued" && cataloguedCount === 0 && (
        <div className="empty">
          ✦&nbsp;&nbsp;Nothing catalogued yet. Posted entries will appear here.
        </div>
      )}

      <section className="entries">
        {visible.map(({ post, number }) => (
          <PostCard key={post.id} post={post} number={number} />
        ))}
      </section>
    </main>
  );
}
