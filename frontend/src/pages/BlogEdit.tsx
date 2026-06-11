import Button from "../components/UI/Button";
import { useState, useEffect } from "react";
import IconButton from "../components/UI/IconButton";
import { RiResetLeftFill } from "react-icons/ri";
import Editor from "../components/Blog/Editor";
import CustomInput from "../components/Login/CustomInput";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import {
  useCreateBlogMutation,
  useGetBlogByIdQuery,
  useUpdateBlogMutation, // add this to your blogSlice if not already present
} from "../services/api/blogSlice";

const DRAFT_KEY = "blog_draft";

const BlogEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // ── Determine mode ─────────────────────────────────────────────────────────
  // If there's an `id` param, we're editing an existing blog.
  const isEditMode = !!id;

  // ── Fetch existing blog when editing ───────────────────────────────────────
  const {
    data,
    isLoading: blogLoading,
  } = useGetBlogByIdQuery(id, {
    skip: !isEditMode, // don't fetch when creating a new blog
  });

  // ── Local state ────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");
  const [components, setComponents] = useState("");

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false); // tracks if we've seeded fields

  // ── Seed fields once blog data arrives (edit mode) ─────────────────────────
  useEffect(() => {
    if (isEditMode && data?.blog && !hydrated) {
      const blog = data.blog;
      setTitle(blog.title ?? "");
      setContent(blog.content ?? "");
      setTags(blog.tags ?? "");
      setSummary(blog.summary ?? "");
      setComponents(blog.components ?? "");
      setHydrated(true);
    }
  }, [data, isEditMode, hydrated]);

  // ── Seed fields from draft on mount (create mode only) ────────────────────
  useEffect(() => {
    if (isEditMode) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        setTitle(draft.title ?? "");
        setContent(draft.content ?? "");
        setTags(draft.tags ?? "");
        setSummary(draft.summary ?? "");
        setComponents(draft.components ?? "");
        setLastSaved(draft.lastSaved ? new Date(draft.lastSaved) : null);
        setDraftRestored(true);
      }
    } catch {
      // corrupt localStorage — ignore
    }
  }, []); // runs once on mount

  // ── Auto-save every 5 s (create mode only) ────────────────────────────────
  useEffect(() => {
    if (isEditMode) return;
    const interval = setInterval(saveDraftToStorage, 5000);
    return () => clearInterval(interval);
  }, [title, content, tags, summary, components, isEditMode]);

  // ── API mutations ──────────────────────────────────────────────────────────
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  // Uncomment when you add useUpdateBlogMutation to your slice:
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const isPublishing = isCreating; // || isUpdating

  // ── Helpers ────────────────────────────────────────────────────────────────
  function saveDraftToStorage() {
    setIsSaving(true);
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, content, tags, summary, components, lastSaved: Date.now() })
      );
      setLastSaved(new Date());
    } catch {
      console.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  }

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(saveDraftToStorage, 200);
  };

  const handleDiscard = () => {
    localStorage.removeItem(DRAFT_KEY);
    setTitle("");
    setContent("");
    setTags("");
    setSummary("");
    setComponents("");
    setLastSaved(null);
    setDraftRestored(false);
  };

  const handleReset = () => {
    if (!isEditMode) {
      handleDiscard();
      return;
    }
    // In edit mode, reset back to the fetched data
    if (data?.blog) {
      const blog = data.blog;
      setTitle(blog.title ?? "");
      setContent(blog.content ?? "");
      setTags(blog.tags ?? "");
      setSummary(blog.summary ?? "");
      setComponents(blog.components ?? "");
      toast("Reset to saved version", { icon: "↩️" });
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ── Publish / Update ───────────────────────────────────────────────────────
  async function handlePublish() {
    if (!title.trim()) {
      toast.error("Please add a title before publishing.");
      return;
    }
    if (!content.trim()) {
      toast.error("Please add some content before publishing.");
      return;
    }

    const payload = { title, content, tags, summary, components };

    try {
      if (isEditMode) {
        await updateBlog({ id, body:payload }).unwrap();  
        // ↑ Uncomment when useUpdateBlogMutation is in your slice.
        // For now, this logs so you can wire it up:
        console.log("UPDATE blog", id, payload);
        toast.success("Blog updated successfully!");
      } else {
        await createBlog(payload).unwrap();
        handleDiscard();
        toast.success("Blog published successfully!");
      }
      navigate("/blogs");
    } catch (err) {
      console.error("Error publishing blog:", err);
      toast.error("Something went wrong. Please try again.");
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isEditMode && blogLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* Header skeleton */}
        <div className="border-b border-gray-200 bg-white px-10 py-6">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
        </div>
        {/* Body skeleton */}
        <div className="flex-grow bg-white px-10 py-6 space-y-4">
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
          <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col">
      {/* Back button */}
      <div className="bg-white pl-8 pt-4">
        <button
          onClick={() => navigate("/blogs")}
          className="ml-2 mt-1 flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft size={15} />
          Back to Blogs
        </button>
      </div>

      {/* Draft-restored banner (create mode only) */}
      {draftRestored && !isEditMode && (
        <div className="mx-10 mt-3 flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
          <span className="text-xs text-gray-500">
            📄 Draft restored from your last session
            {lastSaved && (
              <span className="text-gray-400"> · saved at {formatTime(lastSaved)}</span>
            )}
          </span>
          <button
            onClick={handleDiscard}
            className="whitespace-nowrap text-xs font-medium text-red-500 underline-offset-2 transition-colors hover:text-red-700 hover:underline"
          >
            Discard draft
          </button>
        </div>
      )}

      {/* Top bar */}
      <div className="flex flex-row items-center justify-between border-b border-gray-200 bg-white px-10 py-5">
        {/* Left: title + autosave indicator */}
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            {isEditMode ? "Edit Blog Post" : "New Blog Post"}
          </h1>

          <div className="flex min-h-[18px] items-center gap-1.5">
            {isEditMode ? (
              <span className="text-xs text-gray-400">
                Editing · {data?.blog?.title ?? ""}
              </span>
            ) : isSaving ? (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-300" />
                Saving…
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-500" />
                Draft saved · {formatTime(lastSaved)}
              </span>
            ) : (
              <span className="text-xs text-gray-300">Unsaved draft</span>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <IconButton
            icon={<RiResetLeftFill className="h-4 w-4 text-gray-500" />}
            onClick={handleReset}
            className="rounded-lg border border-gray-200 bg-transparent p-2 text-gray-500 transition-all hover:border-gray-400 hover:text-gray-700"
          />

          <span className="mx-1 h-7 w-px shrink-0 bg-gray-200" />

          {!isEditMode && (
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-xs font-medium tracking-wide text-gray-700 transition-all hover:border-gray-400 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              <Save size={13} />
              {isSaving ? "Saving…" : "Save Draft"}
            </button>
          )}

          <Button
            variant="long"
            text={isEditMode ? "Update" : "Publish"}
            onClick={handlePublish}
            isLoading={isUpdating}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>

      {/* Editor body */}
      <div className="flex flex-grow flex-col gap-4 bg-white px-10 py-6">
        {/* Title */}
        <CustomInput
          label="Blog Title"
          placeholder="Enter your blog title here…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Summary */}
        <CustomInput
          label="Summary"
          placeholder="A short one-line description of this post…"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        {/* Tags */}
        <CustomInput
          label="Tags"
          placeholder="e.g. React, TypeScript, Tutorial (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {/* Components (optional — only show if field exists in your data) */}
        <CustomInput
          label="Components / Hardware"
          placeholder="e.g. STM32F407VG, Breadboard, USB Cable"
          value={components}
          onChange={(e) => setComponents(e.target.value)}
        />

        {/* Rich text editor */}
        <Editor value={content} onChange={setContent} />
      </div>
    </div>
  );
};

export default BlogEdit;