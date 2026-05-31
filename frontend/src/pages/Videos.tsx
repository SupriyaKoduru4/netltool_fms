import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OptionsContainer from "../components/UI/OptionsContainer";
import Button from "../components/UI/Button";
import {
  FiSearch,
  FiPlay,
  FiMoreVertical,
  FiTrash2,
  FiDownload,
  FiExternalLink,
  FiPlus,
  FiFileText,
  FiEdit,
  FiEdit2,
  FiShare2,
  FiStar,
  FiInfo
} from "react-icons/fi";
import Modal from "../components/UI/Modal";
import { RiMailLine, RiWhatsappLine, RiLink } from "react-icons/ri";

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  date: string;
  size: string;
  format: string;
  url: string;
  thumbnailUrl: string;
  transcript: string;
  blogDraft: string;
  description: string;
}

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Project Kickoff Meeting",
    duration: "30:00",
    date: "May 17, 2026 10:30 PM",
    size: "45.2 MB",
    format: "MP4 • 1080p",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "Welcome everyone to the Project Kickoff Meeting for the Founder Management System. Today, we are going to cover the project scope, timelines, and align on key milestones. Our objective is to build a premium, state-of-the-art dashboard that founders can use to manage their blogs, projects, videos, and tasks seamlessly. Let's review the milestones...",
    blogDraft: "<h1>Project Kickoff Meeting: Aligning Goals for the Founder Management System</h1><p>We officially kicked off the FMS project! In this post, we summarize the key milestones, tech stack, and goals discussed during our meeting.</p><h2>1. Project Vision</h2><p>Our goal is to build a premium, state-of-the-art dashboard that founders can use to manage their blogs, projects, videos, and tasks seamlessly.</p><h2>2. Next Steps</h2><p>We will start by building the core foundation and styling tokens, followed by page components.</p>",
    description: "Initial alignment meeting with stakeholders regarding design and backend setup."
  },
  {
    id: "v2",
    title: "Roadmap Planning",
    duration: "45:30",
    date: "May 18, 2026 4:00 PM",
    size: "45.2 MB",
    format: "MP4 • 1080p",
    url: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "In this session, we are planning the roadmap for the next two quarters. We will focus on scaling the video transcoding services and implementing automated AI transcriptions using Whisper models. Let's look at the timeline...",
    blogDraft: "<h1>FMS Roadmap: AI-Powered Transcriptions and Scaling</h1><p>Here is our roadmap for the next two quarters. We are focusing on two major themes: AI-powered transcripts and video transcoding scaling.</p><h2>Key Milestones</h2><ul><li>Q1: Whisper Integration for Transcripts</li><li>Q2: Auto Blog Generation Engine</li></ul>",
    description: "Detailed walkthrough of timelines and product roadmap for the upcoming quarters."
  },
  {
    id: "v3",
    title: "Product Strategy Discussion",
    duration: "25:45",
    date: "May 19, 2026 9:30 AM",
    size: "45.2 MB",
    format: "MP4 • 1080p",
    url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "We are meeting to define the long-term product strategy. FMS needs to stand out by providing frictionless content creation flows. Founders should be able to go from raw video recording to a polished blog post in one click. That is our core value proposition.",
    blogDraft: "<h1>Product Strategy: One-Click Content Creation for Founders</h1><p>Content creation is hard. FMS makes it easy. Our strategy is simple: let founders record raw videos, and we will handle the rest—from transcripts to published blog posts.</p>",
    description: "Brainstorming core differentiators and value proposition for content generation."
  },
  {
    id: "v4",
    title: "Weekly Sync & Status Report",
    duration: "15:20",
    date: "May 20, 2026 2:15 PM",
    size: "22.8 MB",
    format: "MP4 • 720p",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "Hello team. In this weekly sync, we are going to go over the sprint progress, blockages, and plan for the next sprint. The UI designs are mostly ready. We are starting on the backend integration next week...",
    blogDraft: "<h1>Weekly Sync & Sprint Planning</h1><p>Our weekly status update covering sprint deliverables, blockers, and timelines.</p>",
    description: "Regular status update regarding UI milestones and backend planning."
  },
  {
    id: "v5",
    title: "Design System Walkthrough",
    duration: "12:10",
    date: "May 21, 2026 11:00 AM",
    size: "18.4 MB",
    format: "MP4 • 1080p",
    url: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "Today we are reviewing the FMS design system tokens. We've established a clean dark sidebar theme, consistent typography using Inter, and standard padding values. Let's look at the component hierarchy...",
    blogDraft: "<h1>FMS Design System and Branding Guidelines</h1><p>A complete walkthrough of FMS typography, colors, layout structures, and styling guidelines.</p>",
    description: "Overview of user interface guidelines and component styles."
  },
  {
    id: "v6",
    title: "Vite Optimization Session",
    duration: "18:45",
    date: "May 22, 2026 3:30 PM",
    size: "30.1 MB",
    format: "MP4 • 1080p",
    url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "We are profiling the Vite build times. We need to optimize chunk division so that modules like react-quill are dynamically imported. This will drop initial bundle sizes below the warning threshold...",
    blogDraft: "<h1>Optimizing Vite Builds for FMS Dashboard</h1><p>A deep dive into bundler performance, chunk splitting, and speed optimization techniques.</p>",
    description: "Engineering session on improving bundle loading times."
  }
];

const Videos: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Custom modal states
  const [deletingVideo, setDeletingVideo] = useState<VideoItem | null>(null);
  const [sharingVideo, setSharingVideo] = useState<VideoItem | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [renamingVideo, setRenamingVideo] = useState<VideoItem | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [detailingVideo, setDetailingVideo] = useState<VideoItem | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // set to 2 so pagination is immediately visible and testable

  // Load videos from localStorage or load defaults
  useEffect(() => {
    const saved = localStorage.getItem("fms_videos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length < DEFAULT_VIDEOS.length) {
          setVideos(DEFAULT_VIDEOS);
          localStorage.setItem("fms_videos", JSON.stringify(DEFAULT_VIDEOS));
        } else {
          setVideos(parsed);
        }
      } catch (e) {
        setVideos(DEFAULT_VIDEOS);
        localStorage.setItem("fms_videos", JSON.stringify(DEFAULT_VIDEOS));
      }
    } else {
      setVideos(DEFAULT_VIDEOS);
      localStorage.setItem("fms_videos", JSON.stringify(DEFAULT_VIDEOS));
    }
  }, []);

  // Handle outside clicks to close action dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Filtered videos
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalItems = filteredVideos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Safeguard currentPage boundaries
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePlayVideo = (video: VideoItem) => {
    setPlayingVideo(video);
    setActiveDropdown(null);
  };

  const handleDeleteVideo = (video: VideoItem) => {
    setDeletingVideo(video);
    setActiveDropdown(null);
  };

  const confirmDeleteVideo = () => {
    if (deletingVideo) {
      const updated = videos.filter((v) => v.id !== deletingVideo.id);
      setVideos(updated);
      localStorage.setItem("fms_videos", JSON.stringify(updated));
      setDeletingVideo(null);
    }
  };

  const handleDownloadVideo = (video: VideoItem) => {
    // Open video in a new tab or force download
    const link = document.createElement("a");
    link.href = video.url;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setActiveDropdown(null);
  };

  const handleNavigateToDetails = (id: string) => {
    navigate(`/videos/${id}`);
  };

  const handleViewDetails = (video: VideoItem) => {
    setDetailingVideo(video);
    setActiveDropdown(null);
  };

  const handleRenameVideo = (video: VideoItem) => {
    setRenamingVideo(video);
    setRenameTitle(video.title);
    setActiveDropdown(null);
  };

  const confirmRenameVideo = () => {
    if (renamingVideo && renameTitle.trim()) {
      const updated = videos.map((v) => (v.id === renamingVideo.id ? { ...v, title: renameTitle.trim() } : v));
      setVideos(updated);
      localStorage.setItem("fms_videos", JSON.stringify(updated));
      setRenamingVideo(null);
    }
  };

  const handleShareVideo = (video: VideoItem) => {
    setSharingVideo(video);
    setCopiedText(false);
    setActiveDropdown(null);
  };

  const copyShareLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleToggleFavorite = (video: VideoItem) => {
    alert(`"${video.title}" added to favorites!`);
    setActiveDropdown(null);
  };

  const handleGenerateTranscript = (video: VideoItem) => {
    navigate(`/videos/${video.id}`, { state: { initialView: "transcript" } });
    setActiveDropdown(null);
  };

  const handleCreateBlog = (video: VideoItem) => {
    navigate(`/videos/${video.id}`, { state: { initialView: "blog" } });
    setActiveDropdown(null);
  };

  return (
    <OptionsContainer>
      <div className="p-6 flex flex-col bg-[#F2F2F7] w-full min-h-[calc(100vh-60px)] gap-2 ">
        
        {/* Header Section */}
        <div className="flex flex-col gap-1 border-b border-gray-200 pb-6">
          {/* <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
            Library
          </p> */}
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Videos
          </h1>
          <p className="text-sm text-gray-500">
            All your recorded videos
          </p>
        </div>

        {/* Filter and Action Controls */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-80 shadow-sm focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
            <FiSearch className="text-gray-400 w-4 h-4 shrink-0" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 text-xs font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* New Recording Button */}
          <button
            onClick={() => navigate("/video-recorder")}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-sm active:scale-[0.98]"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Recording</span>
          </button>
        </div>

        {/* Videos Table Container */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 w-32">
                    Thumbnail
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    Title
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 w-32">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 w-48">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 w-24 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredVideos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <svg
                          className="w-12 h-12 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10l4.553-2.069A1 1 0 0121 8.88v6.24a1 1 0 01-1.447.889L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                          />
                        </svg>
                        <p className="text-sm font-semibold text-gray-600">No videos found</p>
                        <p className="text-xs">Try adjusting your search query or record a new video.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedVideos.map((video) => (
                    <tr
                      key={video.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      {/* Thumbnail Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          onClick={() => handleNavigateToDetails(video.id)}
                          className="relative w-24 aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer group-hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails, replace with dynamic gradient placeholder
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-xs font-bold text-gray-400">
                            FMS
                          </div>
                          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
                            <FiPlay className="w-5 h-5 text-white drop-shadow-sm" />
                          </div>
                        </div>
                      </td>

                      {/* Title & Format Column */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span
                            onClick={() => handleNavigateToDetails(video.id)}
                            className="font-semibold text-gray-900 hover:text-black hover:underline cursor-pointer transition-all text-sm leading-snug"
                          >
                            {video.title}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            {video.format} • {video.size}
                          </span>
                        </div>
                      </td>

                      {/* Duration Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {video.duration}
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {video.date}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-center relative">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handlePlayVideo(video)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            title="Play Video"
                          >
                            <FiPlay className="w-4.5 h-4.5" />
                          </button>
                          
                          {/* More dropdown */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === video.id ? null : video.id);
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                              <FiMoreVertical className="w-4.5 h-4.5" />
                            </button>

                            {activeDropdown === video.id && (
                              <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-200/80 rounded-xl shadow-lg py-1.5 z-30 font-medium text-gray-700 animate-in fade-in slide-in-from-top-1 duration-100"
                              >
                                <button
                                  onClick={() => handlePlayVideo(video)}
                                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <FiPlay className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span>Play Video</span>
                                </button>
                                <button
                                  onClick={() => handleGenerateTranscript(video)}
                                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <FiFileText className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span>Generate Transcript</span>
                                </button>
                                <button
                                  onClick={() => handleCreateBlog(video)}
                                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <FiEdit className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span>Create Blog / Notes</span>
                                </button>
                                <button
                                  onClick={() => handleDownloadVideo(video)}
                                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <FiDownload className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span>Download Video</span>
                                </button>
                                <button
                                  onClick={() => handleRenameVideo(video)}
                                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <FiEdit2 className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span>Rename Video</span>
                                </button>
                                <button
                                  onClick={() => handleShareVideo(video)}
                                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <FiShare2 className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span>Share Video</span>
                                </button>
                                <button
                                  onClick={() => handleToggleFavorite(video)}
                                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <FiStar className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span>Add To Favorites</span>
                                </button>
                                <div className="h-px bg-gray-100 my-1" />
                                <button
                                  onClick={() => handleDeleteVideo(video)}
                                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-red-50 text-red-600 flex items-center gap-3 font-semibold transition-colors animate-all shrink-0"
                                >
                                  <FiTrash2 className="w-4 h-4 shrink-0" />
                                  <span>Delete Video</span>
                                </button>
                                <button
                                  onClick={() => handleViewDetails(video)}
                                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <FiInfo className="w-4 h-4 text-gray-500 shrink-0" />
                                  <span>View Details</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredVideos.length > 0 && (
            <div className="bg-white border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
              <div className="text-xs text-gray-500 font-medium">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-700">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{" "}
                of <span className="font-semibold text-gray-700">{totalItems}</span> entries
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                      currentPage === page
                        ? "bg-black text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Video Modal */}
      {deletingVideo && (
        <Modal
          isOpen={!!deletingVideo}
          onClose={() => setDeletingVideo(null)}
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
                onClick={() => setDeletingVideo(null)}
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

      {/* Share Video Modal */}
      {sharingVideo && (
        <Modal
          isOpen={!!sharingVideo}
          onClose={() => setSharingVideo(null)}
          title="Share Video"
          size="md"
        >
          <div className="flex flex-col gap-4 p-1 select-none text-left">
            <p className="text-gray-500 text-xs font-medium">
              Anyone with this link can view the video.
            </p>

            {/* Link Input and Copy Button */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://netitool-fms.com/video/${sharingVideo.id}`}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 outline-none truncate"
              />
              <button
                onClick={() => copyShareLink(`https://netitool-fms.com/video/${sharingVideo.id}`)}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-xs font-bold text-white rounded-lg transition-all select-none shrink-0"
              >
                {copiedText ? "Copied!" : "Copy Link"}
              </button>
            </div>

            {/* Social Sharing Section */}
            <div className="flex flex-col gap-2.5 mt-1 border-t border-gray-50 pt-4">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Or share via :</span>
              <div className="flex items-center gap-6">
                <a
                  href={`mailto:?subject=FMS Video - ${sharingVideo.title}&body=Check out this video: https://netitool-fms.com/video/${sharingVideo.id}`}
                  className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition-colors"
                >
                  <RiMailLine className="w-4 h-4 text-gray-500" />
                  <span>Email</span>
                </a>
                
                <a
                  href={`https://api.whatsapp.com/send?text=Check out this video: https://netitool-fms.com/video/${sharingVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition-colors"
                >
                  <RiWhatsappLine className="w-4 h-4 text-green-500" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => copyShareLink(`https://netitool-fms.com/video/${sharingVideo.id}`)}
                  className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition-colors"
                >
                  <RiLink className="w-4 h-4 text-gray-500" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Rename Video Modal */}
      {renamingVideo && (
        <Modal
          isOpen={!!renamingVideo}
          onClose={() => setRenamingVideo(null)}
          title="Rename Video"
          size="sm"
        >
          <div className="flex flex-col gap-4 p-1 select-none text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-900">Video Title</label>
              <input
                type="text"
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-900 outline-none font-medium"
              />
            </div>

            <div className="flex justify-end items-center gap-3 mt-2">
              <button
                onClick={() => setRenamingVideo(null)}
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

      {/* Video Details Modal */}
      {detailingVideo && (
        <Modal
          isOpen={!!detailingVideo}
          onClose={() => setDetailingVideo(null)}
          title="Video Details"
          size="md"
        >
          <div className="flex flex-col gap-4 p-1 select-none text-left font-medium text-xs text-gray-800">
            <div className="grid grid-cols-[100px_10px_1fr] gap-y-3.5 items-center">
              <span>File Name</span>
              <span>:</span>
              <span className="text-gray-900 font-bold truncate">
                {detailingVideo.title.replace(/\s+/g, "")}.mp4
              </span>

              <span>Duration</span>
              <span>:</span>
              <span className="text-gray-900 font-bold">{detailingVideo.duration}</span>

              <span>Resolution</span>
              <span>:</span>
              <span className="text-gray-900 font-bold">1080p</span>

              <span>Created Date</span>
              <span>:</span>
              <span className="text-gray-900 font-bold">{detailingVideo.date}</span>

              <span>File Size</span>
              <span>:</span>
              <span className="text-gray-900 font-bold">{detailingVideo.size}</span>

              <span>Tags</span>
              <span>:</span>
              <span className="text-gray-900 font-bold">Project</span>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setDetailingVideo(null)}
                className="px-5 py-2 bg-black hover:bg-gray-800 text-xs font-bold text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Video Playback Modal */}
      {playingVideo && (
        <Modal
          isOpen={!!playingVideo}
          onClose={() => setPlayingVideo(null)}
          title={playingVideo.title}
          size="lg"
        >
          <div className="flex flex-col gap-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-200">
              <video
                src={playingVideo.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-1.5 px-1 pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
                  {playingVideo.format} • {playingVideo.size}
                </span>
                <span className="text-xs text-gray-500 font-semibold">{playingVideo.date}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {playingVideo.description || "No description provided."}
              </p>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  text="Close"
                  onClick={() => setPlayingVideo(null)}
                />
                <Button
                  variant="primary"
                  text="Go to AI Blog Post"
                  onClick={() => {
                    navigate(`/videos/${playingVideo.id}`);
                    setPlayingVideo(null);
                  }}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </OptionsContainer>
  );
};

export default Videos;
