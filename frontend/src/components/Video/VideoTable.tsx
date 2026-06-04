import React, { useState, useEffect, useRef } from "react";
import { VideoItem } from "./types";
import {
  FiPlay,
  FiMoreVertical,
  FiTrash2,
  FiDownload,
  FiFileText,
  FiEdit,
  FiEdit2,
  FiShare2,
  FiStar,
  FiInfo
} from "react-icons/fi";

interface VideoTableProps {
  videos: VideoItem[];
  paginatedVideos: VideoItem[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPlayVideo: (video: VideoItem) => void;
  onGenerateTranscript: (video: VideoItem) => void;
  onCreateBlog: (video: VideoItem) => void;
  onDownloadVideo: (video: VideoItem) => void;
  onRenameVideo: (video: VideoItem) => void;
  onShareVideo: (video: VideoItem) => void;
  onToggleFavorite: (video: VideoItem) => void;
  onDeleteVideo: (video: VideoItem) => void;
  onViewDetails: (video: VideoItem) => void;
  onNavigateToDetails: (id: string) => void;
}

const VideoTable: React.FC<VideoTableProps> = ({
  videos,
  paginatedVideos,
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPlayVideo,
  onGenerateTranscript,
  onCreateBlog,
  onDownloadVideo,
  onRenameVideo,
  onShareVideo,
  onToggleFavorite,
  onDeleteVideo,
  onViewDetails,
  onNavigateToDetails,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleAction = (callback: () => void) => {
    callback();
    setActiveDropdown(null);
  };

  return (
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
            {videos.length === 0 ? (
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
                      onClick={() => onNavigateToDetails(video.id)}
                      className="relative w-24 aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer group-hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
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
                        onClick={() => onNavigateToDetails(video.id)}
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
                        onClick={() => onPlayVideo(video)}
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
                              onClick={() => handleAction(() => onPlayVideo(video))}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <FiPlay className="w-4 h-4 text-gray-500 shrink-0" />
                              <span>Play Video</span>
                            </button>
                            <button
                              onClick={() => handleAction(() => onGenerateTranscript(video))}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <FiFileText className="w-4 h-4 text-gray-500 shrink-0" />
                              <span>Generate Transcript</span>
                            </button>
                            <button
                              onClick={() => handleAction(() => onCreateBlog(video))}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <FiEdit className="w-4 h-4 text-gray-500 shrink-0" />
                              <span>Create Blog / Notes</span>
                            </button>
                            <button
                              onClick={() => handleAction(() => onDownloadVideo(video))}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <FiDownload className="w-4 h-4 text-gray-500 shrink-0" />
                              <span>Download Video</span>
                            </button>
                            <button
                              onClick={() => handleAction(() => onRenameVideo(video))}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <FiEdit2 className="w-4 h-4 text-gray-500 shrink-0" />
                              <span>Rename Video</span>
                            </button>
                            <button
                              onClick={() => handleAction(() => onShareVideo(video))}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <FiShare2 className="w-4 h-4 text-gray-500 shrink-0" />
                              <span>Share Video</span>
                            </button>
                            <button
                              onClick={() => handleAction(() => onToggleFavorite(video))}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <FiStar className="w-4 h-4 text-gray-500 shrink-0" />
                              <span>Add To Favorites</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button
                              onClick={() => handleAction(() => onDeleteVideo(video))}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-red-50 text-red-600 flex items-center gap-3 font-semibold transition-colors animate-all shrink-0"
                            >
                              <FiTrash2 className="w-4 h-4 shrink-0" />
                              <span>Delete Video</span>
                            </button>
                            <button
                              onClick={() => handleAction(() => onViewDetails(video))}
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
      {videos.length > 0 && (
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
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTable;
