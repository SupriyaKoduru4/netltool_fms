import Button from "../components/UI/Button";
import { useState, useEffect } from "react";
import IconButton from "../components/UI/IconButton";
import { RiResetLeftFill } from "react-icons/ri";
import Editor from "../components/Blog/Editor";
import CustomInput from "../components/Login/CustomInput";
import { useNavigate, useLocation } from "react-router-dom";
import {toast} from 'react-hot-toast'
//@ts-ignore
import Backbutton from "../assets/Backbutton.svg";
import { useCreateBlogMutation } from "../services/api/blogSlice";

const DRAFT_KEY = "blog_draft";

const BlogEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedTitle = location.state?.title || "";
  const passedContent = location.state?.content || "";
  const isEditMode = !!location.state?.title; // true when editing an existing blog

  // ── Initialise from localStorage draft if this is a new blog ──────────────
  const getInitialState = () => {
    if (isEditMode) {
      // Editing an existing post — always use passed data, never the draft
      return { title: passedTitle, content: passedContent };
    }
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        return { title: draft.title || "", content: draft.content || "" };
      }
    } catch {
      // Corrupt data — ignore
    }
    return { title: "", content: "" };
  };

  //redux api slice
  const [createBlog , {isLoading , isError , error}] = useCreateBlogMutation()
 
  const initial = getInitialState();
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [lastSaved, setLastSaved] = useState<Date | null>(() => {
    // Show last saved time from the draft if we loaded one
    if (!isEditMode) {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          const draft = JSON.parse(raw);
          return draft.lastSaved ? new Date(draft.lastSaved) : null;
        }
      } catch {}
    }
    return null;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [draftRestored, setDraftRestored] = useState(() => {
    // Show the "draft restored" banner only when we actually loaded from localStorage
    if (isEditMode) return false;
    try {
      return !!localStorage.getItem(DRAFT_KEY);
    } catch {
      return false;
    }
  });

  // ── Auto-save every 5 seconds (new blogs only) ────────────────────────────
  useEffect(() => {
    if (isEditMode) return; // Don't auto-save when editing an existing post

    const interval = setInterval(() => {
      saveDraftToStorage();
    }, 5000);

    return () => clearInterval(interval);
  }, [title, content]); // re-register when content changes so we save latest values

  function saveDraftToStorage() {
    setIsSaving(true);
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, content, lastSaved: Date.now() })
      );
      setLastSaved(new Date());
    } catch {
      console.error("Failed to save draft to localStorage");
    } finally {
      setIsSaving(false);
    }
  }

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveDraftToStorage();
    }, 200);
  };

  const handleDiscard = () => {
    localStorage.removeItem(DRAFT_KEY);
    setTitle("");
    setContent("");
    setLastSaved(null);
    setDraftRestored(false);
  };

  const handleBackToBlogs = () => navigate("/blogs");

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  async function handlePublishBlog(){
    if(!title || !content){
      toast.error(`Pleae fill the ${title?"content":"title"}`)
      return ;
    }
    try{
      const payload = {
        title , 
        content
      }

      await createBlog(payload).unwrap();
      toast.success("Publised blog successfully!")
      handleDiscard();
      handleBackToBlogs();
    }catch(err){
      console.log("Error while publish blog" , err)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Back button */}
      <div className="bg-white pl-4 pt-2">
        <button
          onClick={handleBackToBlogs}
          className="flex items-center gap-2 text-xl font-medium text-gray-900 hover:text-black ml-4 mt-3 transition-colors"
        >
          <img src={Backbutton} alt="Back" className="w-4 h-4" />
          <span className="text-m font-medium text-gray-700">Back to Blogs</span>
        </button>
      </div>

      {/* Draft restored banner */}
      {draftRestored && (
        <div className="mx-10 mt-3 flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              📄 Draft restored from your last session
              {lastSaved && (
                <span className="text-gray-400"> · saved at {formatTime(lastSaved)}</span>
              )}
            </span>
          </div>
          <button
            onClick={handleDiscard}
            className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline underline-offset-2 transition-colors whitespace-nowrap"
          >
            Discard draft
          </button>
        </div>
      )}

      {/* Top bar */}
      <div
        className="px-10 py-6 flex flex-row justify-between items-center"
        style={{
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        }}
      >
        {/* Left: Title + timestamp */}
        <div className="flex flex-col gap-1">
          <h1
            style={{
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#111111",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "18px" }}>
            {isSaving ? (
              <span style={{ fontSize: "0.72rem", color: "#9ca3af", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "#d1d5db", animation: "pulse 0.8s ease-in-out infinite" }} />
                Saving...
              </span>
            ) : lastSaved ? (
              <span style={{ fontSize: "0.72rem", color: "#9ca3af", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "#6b7280" }} />
                Draft saved · {formatTime(lastSaved)}
              </span>
            ) : (
              <span style={{ fontSize: "0.72rem", color: "#d1d5db", letterSpacing: "0.04em" }}>
                Unsaved draft
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-row gap-2 items-center">
          <IconButton
            icon={<RiResetLeftFill className="w-4 h-4 text-gray-500" />}
            className="p-2 rounded-lg border border-gray-200 bg-transparent text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all duration-150"
          />
          <span className="w-px h-7 bg-gray-200 mx-1 shrink-0" />
          <button
            onClick={handleSaveDraft}
            disabled={isSaving || isEditMode}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wide rounded-lg border border-gray-300 text-gray-700 bg-transparent hover:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-150"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <Button variant="long" text="Publish" onClick={handlePublishBlog} isLoading={isLoading} />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      {/* Editor */}
      <div className="px-10 py-6 flex flex-col flex-grow" style={{ background: "#ffffff" }}>
        <CustomInput
          label="Blog Title"
          placeholder="Enter your blog title here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Editor value={content} onChange={setContent} />
      </div>
    </div>
  );
};

export default BlogEditor;