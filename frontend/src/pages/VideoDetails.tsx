import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import OptionsContainer from "../components/UI/OptionsContainer";
import Backbutton from "../assets/Backbutton.svg";
import { FiCopy, FiEdit, FiDownload, FiTrash2, FiFileText, FiCheck, FiSearch } from "react-icons/fi";
import { VideoItem } from "./Videos";
import Modal from "../components/UI/Modal";

const VideoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [video, setVideo] = useState<VideoItem | null>(null);
  
  // Custom Flow view: "info" (Page 1), "transcript" (Page 2), "blog" (Page 3)
  const [viewMode, setViewMode] = useState<"info" | "transcript" | "blog">("info");
  
  // Search state for transcript
  const [transcriptSearchQuery, setTranscriptSearchQuery] = useState("");
  
  // Modals state
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameTitleText, setRenameTitleText] = useState("");
  
  // Action Feedback states
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [copiedBlog, setCopiedBlog] = useState(false);

  // Load the video from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fms_videos");
    if (saved) {
      try {
        const list: VideoItem[] = JSON.parse(saved);
        const item = list.find((v) => v.id === id);
        if (item) {
          setVideo(item);
          setRenameTitleText(item.title);
          
          // Check location state for initial view
          if (location.state && (location.state as any).initialView) {
            setViewMode((location.state as any).initialView);
          }
        } else {
          navigate("/videos");
        }
      } catch (e) {
        navigate("/videos");
      }
    } else {
      navigate("/videos");
    }
  }, [id, navigate, location]);

  if (!video) {
    return (
      <OptionsContainer>
        <div className="p-8 flex items-center justify-center min-h-[calc(100vh-60px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </OptionsContainer>
    );
  }

  const handleBackNavigation = () => {
    if (viewMode === "info") {
      navigate("/videos");
    } else {
      setViewMode("info");
    }
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(video.transcript || "");
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handleCopyBlog = () => {
    // Strip HTML if it is v1, or copy direct HTML otherwise
    if (video.id === "v1") {
      const textContent = `
1. Introduction
In this meeting, we discussed the kickoff of the new project. The team gathered to align on goals, timeline, and responsibilities.

2. Project Goals
The main goal is to build a scalable and user-friendly platform that solves real user problems.

3. Plan & Timeline
The project will be executed in phases. The first phase includes research and planning.

4. Team & Roles
Each team member shared their roles and responsibilities for the project.

5. Conclusion
We will have weekly check-ins to track progress and ensure smooth execution.
      `.trim();
      navigator.clipboard.writeText(textContent);
    } else {
      const tempEl = document.createElement("div");
      tempEl.innerHTML = video.blogDraft || "";
      const textContent = tempEl.textContent || tempEl.innerText || "";
      navigator.clipboard.writeText(textContent);
    }
    setCopiedBlog(true);
    setTimeout(() => setCopiedBlog(false), 2000);
  };

  const handleRenameVideo = () => {
    setIsRenaming(true);
    setRenameTitleText(video.title);
  };

  const confirmRenameVideo = () => {
    if (renameTitleText.trim()) {
      const saved = localStorage.getItem("fms_videos");
      if (saved) {
        try {
          const list: VideoItem[] = JSON.parse(saved);
          const updatedList = list.map((v) => (v.id === video.id ? { ...v, title: renameTitleText.trim() } : v));
          localStorage.setItem("fms_videos", JSON.stringify(updatedList));
          setVideo({ ...video, title: renameTitleText.trim() });
          setIsRenaming(false);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const handleDeleteVideo = () => {
    setIsDeleting(true);
  };

  const confirmDeleteVideo = () => {
    const saved = localStorage.getItem("fms_videos");
    if (saved) {
      try {
        const list: VideoItem[] = JSON.parse(saved);
        const updatedList = list.filter((v) => v.id !== video.id);
        localStorage.setItem("fms_videos", JSON.stringify(updatedList));
        setIsDeleting(false);
        navigate("/videos");
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Helper to split transcript into timestamped sentences
  const getTranscriptLines = (text: string) => {
    if (!text) return [];
    // Split text by sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let time = 0;
    return sentences.map((sentence) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      const timestamp = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      // Increment time based on word count (approx. 150 words per minute -> 2.5 words per second)
      const wordCount = sentence.split(/\s+/).filter(Boolean).length;
      time += Math.max(4, Math.round(wordCount * 0.5));
      return { timestamp, text: sentence.trim() };
    });
  };

  const transcriptLines = getTranscriptLines(video.transcript || "");
  const filteredTranscriptLines = transcriptLines.filter((line) =>
    line.text.toLowerCase().includes(transcriptSearchQuery.toLowerCase())
  );

  return (
    <OptionsContainer>
      <div className="flex flex-col min-h-[calc(100vh-60px)] bg-[#F2F2F7]">
        
        {/* Back navigation header */}
        <div className="bg-[#F2F2F7] px-8 pt-6 pb-2 shrink-0">
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black transition-colors"
          >
            <img src={Backbutton} alt="Back" className="w-3 h-3" />
            <span>{viewMode === "info" ? "Back to videos" : "Back to Videos"}</span>
          </button>
        </div>

        {/* Content Workspace */}
        <div className="p-8 pt-2 flex-grow overflow-y-auto">
          
          {/* View 1: Info (Page 1) */}
          {viewMode === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Player & Info Table */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                    {video.title}
                  </h1>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      {video.date}
                    </span>
                    <span>•</span>
                    <span>{video.duration}</span>
                    <span>•</span>
                    <span>{video.size}</span>
                  </div>
                </div>

                {/* Player container */}
                <div className="bg-black aspect-video rounded-2xl overflow-hidden shadow-sm border border-gray-200/80 relative">
                  <video
                    src={video.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Video Information Card */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wider">Video Information</h3>
                  <div className="grid grid-cols-4 border border-gray-200 rounded-xl divide-x divide-gray-200 overflow-hidden text-left bg-gray-50/50">
                    <div className="p-4 flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Format</span>
                      <span className="text-xs font-bold text-gray-800">{video.format || "MP4"}</span>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Resolution</span>
                      <span className="text-xs font-bold text-gray-800">1080p</span>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                      <span className="text-xs font-bold text-gray-800">{video.duration}</span>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">File Size</span>
                      <span className="text-xs font-bold text-gray-800">{video.size}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions & Quick Links */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Actions Panel */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</h3>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleRenameVideo}
                      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition"
                    >
                      <FiEdit className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Edit Title</span>
                    </button>
                    <a href={video.url} download={`${video.title}.mp4`} className="w-full">
                      <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition">
                        <FiDownload className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Download</span>
                      </button>
                    </a>
                    <button
                      onClick={handleDeleteVideo}
                      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:bg-red-50 rounded-xl text-xs font-bold text-[#FF5A5F] hover:border-red-200 transition"
                    >
                      <FiTrash2 className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Quick Links Panel */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Links</h3>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setViewMode("transcript")}
                      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition"
                    >
                      <FiFileText className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Generate Transcript</span>
                    </button>
                    <button
                      onClick={() => setViewMode("blog")}
                      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition"
                    >
                      <FiEdit className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Create Blog / Notes</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* View 2 & 3: Tabbed views (Transcript or Blog) */}
          {(viewMode === "transcript" || viewMode === "blog") && (
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              
              {/* Tab Navigation headers */}
              <div className="flex border-b border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => setViewMode("transcript")}
                  className={`flex-1 py-4.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center justify-center gap-2 ${
                    viewMode === "transcript"
                      ? "border-black text-black bg-white"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span>Transcript</span>
                </button>
                
                <button
                  onClick={() => setViewMode("blog")}
                  className={`flex-1 py-4.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center justify-center gap-2 ${
                    viewMode === "blog"
                      ? "border-black text-black bg-white"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span>Blogs / Notes</span>
                </button>
              </div>

              {/* View 2 Content: Transcript (Page 2) */}
              {viewMode === "transcript" && (
                <div className="flex flex-col gap-5 p-8 text-left">
                  {/* Header row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Transcript</h2>
                      <p className="text-xs text-gray-400 font-bold mt-1.5">{video.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleCopyTranscript}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 transition"
                      >
                        {copiedTranscript ? <FiCheck className="text-green-500" /> : <FiCopy />}
                        <span>{copiedTranscript ? "Copied" : "Copy Transcript"}</span>
                      </button>
                      <button
                        onClick={() => {
                          const element = document.createElement("a");
                          const file = new Blob([video.transcript || ""], { type: 'text/plain' });
                          element.href = URL.createObjectURL(file);
                          element.download = `${video.title}-transcript.txt`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 transition"
                      >
                        <FiDownload />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Search input bar */}
                  <div className="relative mt-2">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search in transcript..."
                      value={transcriptSearchQuery}
                      onChange={(e) => setTranscriptSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-4 py-2.5 text-xs text-gray-800 outline-none"
                    />
                  </div>

                  {/* Transcript Content List */}
                  <div className="flex flex-col gap-4.5 border border-gray-100 bg-white rounded-xl p-6 mt-2 max-h-[500px] overflow-y-auto">
                    {filteredTranscriptLines.length > 0 ? (
                      filteredTranscriptLines.map((line, idx) => (
                        <div key={idx} className="flex gap-6 text-xs leading-relaxed">
                          <span className="text-gray-400 font-mono font-bold shrink-0">{line.timestamp}</span>
                          <span className="text-gray-700 font-medium">{line.text}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 text-center py-8">No matching transcript lines found.</p>
                    )}
                  </div>
                </div>
              )}

              {/* View 3 Content: Blogs / Notes (Page 3) */}
              {viewMode === "blog" && (
                <div className="flex flex-col gap-5 p-8 text-left">
                  {/* Header row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Blog Generated from Video</h2>
                      <p className="text-xs text-gray-400 font-bold mt-1.5">{video.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleCopyBlog}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 transition"
                      >
                        {copiedBlog ? <FiCheck className="text-green-500" /> : <FiCopy />}
                        <span>{copiedBlog ? "Copied" : "Copy Blog"}</span>
                      </button>
                      <button
                        onClick={() => {
                          const element = document.createElement("a");
                          const file = new Blob([video.blogDraft || ""], { type: 'text/plain' });
                          element.href = URL.createObjectURL(file);
                          element.download = `${video.title}-blog.html`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 transition"
                      >
                        <FiDownload />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Blog Preview Box */}
                  <div className="border border-gray-200 bg-white rounded-xl p-8 mt-2 max-h-[500px] overflow-y-auto">
                    {video.id === "v1" ? (
                      <div className="flex flex-col gap-6 text-xs text-gray-700 leading-relaxed font-medium">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1.5 text-sm">1. Introduction</h4>
                          <p>In this meeting, we discussed the kickoff of the new project. The team gathered to align on goals, timeline, and responsibilities.</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1.5 text-sm">2. Project Goals</h4>
                          <p>The main goal is to build a scalable and user-friendly platform that solves real user problems.</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1.5 text-sm">3. Plan & Timeline</h4>
                          <p>The project will be executed in phases. The first phase includes research and planning.</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1.5 text-sm">4. Team & Roles</h4>
                          <p>Each team member shared their roles and responsibilities for the project.</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1.5 text-sm">5. Conclusion</h4>
                          <p>We will have weekly check-ins to track progress and ensure smooth execution.</p>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="prose prose-sm prose-slate max-w-none text-xs" 
                        dangerouslySetInnerHTML={{ __html: video.blogDraft || "" }} 
                      />
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Rename Video Modal */}
      {isRenaming && (
        <Modal
          isOpen={isRenaming}
          onClose={() => setIsRenaming(false)}
          title="Rename Video"
          size="sm"
        >
          <div className="flex flex-col gap-4 p-1 select-none text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-900">Video Title</label>
              <input
                type="text"
                value={renameTitleText}
                onChange={(e) => setRenameTitleText(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-900 outline-none font-medium"
              />
            </div>

            <div className="flex justify-end items-center gap-3 mt-2">
              <button
                onClick={() => setIsRenaming(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRenameVideo}
                className="px-5 py-2 bg-black hover:bg-gray-800 text-xs font-bold text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Video Modal */}
      {isDeleting && (
        <Modal
          isOpen={isDeleting}
          onClose={() => setIsDeleting(false)}
          title="Delete Video"
          size="sm"
        >
          <div className="flex flex-col items-center text-center p-2 select-none">
            {/* Warning Icon */}
            <div className="mb-4 text-[#FF5A5F]">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <p className="text-gray-900 font-semibold text-sm leading-relaxed mb-1">
              Are you sure you want to delete this video?
            </p>
            <p className="text-gray-500 text-xs mb-6">
              This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteVideo}
                className="flex-1 px-4 py-2 bg-[#FF5A5F] hover:bg-[#FF4449] rounded-lg text-xs font-bold text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

    </OptionsContainer>
  );
};

export default VideoDetails;

