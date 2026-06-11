import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Link2,
  Share2,
  MessageCircle,
  Bookmark,
  Heart,
  Clock,
  Calendar,
  Eye,
  Circle,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useGetBlogByIdQuery } from "../services/api/blogSlice";
import { dateFromMatter } from "../utils/DateFomatter";

// ─── Branded navbar ───────────────────────────────────────────────────────────

function NetlToolNavbar() {
  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900">
          <Zap size={14} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-semibold tracking-tight text-gray-900">
          netl<span className="text-gray-400">tool</span>
        </span>
        <span className="hidden rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 sm:inline">
          Blog
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="hidden rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 sm:flex">
          Browse posts
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800">
          Sign in
        </button>
      </div>
    </nav>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function readingTime(html: string): number {
  const text = html?.replace(/<[^>]+>/g, "") ?? "";
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: React.ReactNode;
}
function IconBtn({ label, children, className = "", ...rest }: IconBtnProps) {
  return (
    <button
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-transparent text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

interface ActionBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
}
function ActionBtn({ icon, label, className = "", ...rest }: ActionBtnProps) {
  return (
    <button
      className={`flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 sm:px-4 sm:text-sm ${className}`}
      {...rest}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function BlogDetailsSkeleton() {
  return (
    <>
      <NetlToolNavbar />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 h-5 w-28 animate-pulse rounded bg-gray-200" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-5 sm:p-7">
                <div className="mb-4 flex gap-2">
                  {[60, 72, 56].map((w) => (
                    <div key={w} className="h-5 animate-pulse rounded-full bg-gray-100" style={{ width: w }} />
                  ))}
                </div>
                <div className="mb-3 h-7 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="space-y-3 p-5 sm:p-7">
                {[100, 90, 75, 95, 60, 85].map((w, i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-gray-100" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
            <div className="hidden w-56 shrink-0 space-y-4 lg:block">
              {[120, 160, 180].map((h, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white" style={{ height: h }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetBlogByIdQuery(id);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeToc, setActiveToc] = useState(0);
  const [tocOpen, setTocOpen] = useState(false); // mobile TOC accordion

  if (isLoading) return <BlogDetailsSkeleton />;

  const blog = data?.blog;

  if (!blog) {
    return (
      <>
        <NetlToolNavbar />
        <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-base font-medium text-gray-800">Post not found</p>
            <p className="mt-1 text-sm text-gray-400">
              This post may have been removed or doesn't exist.
            </p>
            <button
              onClick={() => navigate("/blogs")}
              className="mt-5 rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
            >
              Back to blogs
            </button>
          </div>
        </div>
      </>
    );
  }

  const authorName: string = blog?.user?.first_name
    ? `${blog.user.first_name} ${blog.user.last_name ?? ""}`.trim()
    : blog?.author_name ?? "Unknown author";
  const initials = getInitials(authorName);
  const mins = blog?.content ? readingTime(blog.content) : 0;
  const displayLikes = likeCount !== null ? likeCount : blog?.likes ?? 0;

  // Extract h2 headings for TOC
  const tocItems: string[] = [];
  if (blog?.content) {
    const matches = [...blog.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)];
    matches.forEach((m) => tocItems.push(m[1].replace(/<[^>]+>/g, "")));
  }

  // Tags — support both string "a,b,c" and array
  const tags: string[] = Array.isArray(blog?.tags)
    ? blog.tags
    : typeof blog?.tags === "string"
      ? blog.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : ["Article"];

  const handleLike = () => {
    const base = likeCount !== null ? likeCount : blog?.likes ?? 0;
    setLiked((prev) => !prev);
    setLikeCount(liked ? base - 1 : base + 1);
  };

  const handleSave = () => setSaved((prev) => !prev);

  return (
    <>
      <NetlToolNavbar />

      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">

          {/* Back button */}
          <button
            onClick={() => navigate("/blogs")}
            className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800"
          >
            <ArrowLeft size={14} />
            Back to blogs
          </button>

          {/* Mobile TOC accordion — shows only when tocItems exist */}
          {tocItems.length > 0 && (
            <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white lg:hidden">
              <button
                onClick={() => setTocOpen((p) => !p)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
              >
                In this post
                {tocOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {tocOpen && (
                <ul className="border-t border-gray-100 px-3 pb-3 pt-1 space-y-0.5">
                  {tocItems.map((item, i) => (
                    <li key={i}>
                      <button
                        onClick={() => { setActiveToc(i); setTocOpen(false); }}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition-colors ${activeToc === i
                            ? "bg-gray-100 font-medium text-gray-800"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          }`}
                      >
                        <Circle
                          size={5}
                          className={activeToc === i ? "fill-gray-800 text-gray-800" : "fill-gray-300 text-gray-300"}
                        />
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Main layout: article + sidebar */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">

            {/* ── Article card ── */}
            <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white">

              {/* Header */}
              <div className="border-b border-gray-100 px-5 pb-5 pt-6 sm:px-7">

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title + action buttons */}
                <div className="flex items-start justify-between gap-3">
                  <h1 className="flex-1 text-xl font-semibold leading-snug text-gray-900 sm:text-2xl">
                    {blog.title}
                  </h1>
                  <div className="flex shrink-0 gap-1.5 pt-0.5">
                    <IconBtn label="Edit post" onClick={() => navigate(`/blog-editor/${id}`)}>
                      <Edit size={14} />
                    </IconBtn>
                    <IconBtn label="Copy link">
                      <Link2 size={14} />
                    </IconBtn>
                    <IconBtn label="Share post">
                      <Share2 size={14} />
                    </IconBtn>
                  </div>
                </div>

                {blog.summary && (
                  <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Summary
                    </h3>

                    <p className="text-sm leading-relaxed text-gray-600">
                      {blog.summary}
                    </p>
                  </div>
                )}

                {/* Meta row */}
                <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{authorName}</span>
                  </div>

                  <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300" />

                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={11} />
                    {dateFromMatter(blog.created_at)}
                  </span>

                  <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300" />

                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} />
                    {mins} min read
                  </span>

                  {blog.views != null && (
                    <>
                      <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Eye size={11} />
                        {blog.views.toLocaleString()} views
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Content — overflow-wrap + word-break prevent paragraph blowout */}
              <div
                className="
                  prose prose-sm max-w-none px-5 py-6 sm:px-7
                  [overflow-wrap:break-word] [word-break:break-word]
                  text-gray-700
                  prose-headings:font-semibold prose-headings:text-gray-900
                  prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                  prose-p:leading-relaxed prose-p:text-gray-600
                  prose-strong:text-gray-800
                  prose-blockquote:not-italic
                  prose-blockquote:border-l-2 prose-blockquote:border-gray-300
                  prose-blockquote:bg-gray-50 prose-blockquote:px-4 prose-blockquote:py-2
                  prose-blockquote:text-gray-500 prose-blockquote:rounded-r-lg
                  prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5
                  prose-code:py-0.5 prose-code:text-xs prose-code:font-mono
                  prose-code:text-gray-700 prose-code:before:content-none prose-code:after:content-none
                  prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:bg-gray-900
                  prose-pre:p-4 prose-pre:text-gray-100
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:border prose-img:border-gray-100
                  prose-ul:text-gray-600 prose-ol:text-gray-600
                  prose-li:my-0.5
                  prose-table:w-full prose-table:text-sm
                  prose-th:bg-gray-50 prose-th:p-2 prose-th:text-left prose-th:font-medium
                  prose-td:p-2 prose-td:border-b prose-td:border-gray-100
                "
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-7">
                <div className="flex gap-2">
                  <ActionBtn icon={<MessageCircle size={14} />} label="Comment" />
                  <ActionBtn
                    icon={
                      <Bookmark
                        size={14}
                        className={saved ? "fill-gray-700 text-gray-700" : ""}
                      />
                    }
                    label={saved ? "Saved" : "Save"}
                    onClick={handleSave}
                    className={saved ? "border-gray-300 bg-gray-100 text-gray-700" : ""}
                  />
                </div>

                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${liked
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    }`}
                >
                  <Heart size={14} className={liked ? "fill-red-400 text-red-400" : ""} />
                  {displayLikes}
                </button>
              </div>
            </div>

            {/* ── Sidebar — hidden on mobile, visible lg+ ── */}
            <aside className="hidden w-56 shrink-0 space-y-4 lg:block">

              {/* Reading time */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Reading time
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={13} className="shrink-0 text-gray-400" />
                  {mins} min read
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-2/5 rounded-full bg-gray-800 transition-all" />
                </div>
              </div>

              {/* Table of contents */}
              {tocItems.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    In this post
                  </p>
                  <ul className="space-y-0.5">
                    {tocItems.map((item, i) => (
                      <li key={i}>
                        <button
                          onClick={() => setActiveToc(i)}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${activeToc === i
                              ? "bg-gray-100 font-medium text-gray-800"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                            }`}
                        >
                          <Circle
                            size={5}
                            className={activeToc === i ? "fill-gray-800 text-gray-800" : "fill-gray-300 text-gray-300"}
                          />
                          <span className="line-clamp-2">{item}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Components / hardware */}
              {blog?.components && (
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Components
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {blog.components.split(",").map((c: string) => (
                      <span
                        key={c}
                        className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-500 border border-gray-200"
                      >
                        {c.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related posts */}
              {blog?.related && blog.related.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    More from {blog.user?.first_name ?? "this author"}
                  </p>
                  <ul className="divide-y divide-gray-100">
                    {blog.related.map((post: { _id: string; title: string; created_at: string }) => (
                      <li key={post._id}>
                        <button
                          onClick={() => navigate(`/blog/${post._id}`)}
                          className="group w-full py-2.5 text-left"
                        >
                          <p className="line-clamp-2 text-xs font-medium leading-snug text-gray-800 group-hover:text-blue-600">
                            {post.title}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {dateFromMatter(post.created_at)}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Last updated */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Last updated
                </p>
                <p className="text-xs text-gray-500">
                  {dateFromMatter(blog.updatedAt ?? blog.created_at)}
                </p>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;