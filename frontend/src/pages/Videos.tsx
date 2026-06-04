import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OptionsContainer from "../components/UI/OptionsContainer";
import { FiSearch, FiPlus } from "react-icons/fi";

import { VideoItem, DEFAULT_VIDEOS } from "../components/Video/types";
import DeleteVideoModal from "../components/Video/DeleteVideoModal";
import ShareVideoModal from "../components/Video/ShareVideoModal";
import RenameVideoModal from "../components/Video/RenameVideoModal";
import VideoDetailsModal from "../components/Video/VideoDetailsModal";
import VideoPlaybackModal from "../components/Video/VideoPlaybackModal";
import VideoTable from "../components/Video/VideoTable";

export type { VideoItem };

const Videos: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

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
  };

  const handleDeleteVideo = (video: VideoItem) => {
    setDeletingVideo(video);
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
    const link = document.createElement("a");
    link.href = video.url;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNavigateToDetails = (id: string) => {
    navigate(`/videos/${id}`);
  };

  const handleViewDetails = (video: VideoItem) => {
    setDetailingVideo(video);
  };

  const handleRenameVideo = (video: VideoItem) => {
    setRenamingVideo(video);
    setRenameTitle(video.title);
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
  };

  const copyShareLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleToggleFavorite = (video: VideoItem) => {
    alert(`"${video.title}" added to favorites!`);
  };

  const handleGenerateTranscript = (video: VideoItem) => {
    navigate(`/videos/${video.id}`, { state: { initialView: "transcript" } });
  };

  const handleCreateBlog = (video: VideoItem) => {
    navigate(`/videos/${video.id}`, { state: { initialView: "blog" } });
  };

  return (
    <OptionsContainer>
      <div className="p-6 flex flex-col bg-[#F2F2F7] w-full min-h-[calc(100vh-60px)] gap-2 ">
        
        {/* Header Section */}
        <div className="flex flex-col gap-1 border-b border-gray-200 pb-6">
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
        <VideoTable
          videos={filteredVideos}
          paginatedVideos={paginatedVideos}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPlayVideo={handlePlayVideo}
          onGenerateTranscript={handleGenerateTranscript}
          onCreateBlog={handleCreateBlog}
          onDownloadVideo={handleDownloadVideo}
          onRenameVideo={handleRenameVideo}
          onShareVideo={handleShareVideo}
          onToggleFavorite={handleToggleFavorite}
          onDeleteVideo={handleDeleteVideo}
          onViewDetails={handleViewDetails}
          onNavigateToDetails={handleNavigateToDetails}
        />
      </div>

      {/* Delete Video Modal */}
      {deletingVideo && (
        <DeleteVideoModal
          isOpen={!!deletingVideo}
          onClose={() => setDeletingVideo(null)}
          onConfirm={confirmDeleteVideo}
        />
      )}

      {/* Share Video Modal */}
      {sharingVideo && (
        <ShareVideoModal
          isOpen={!!sharingVideo}
          onClose={() => setSharingVideo(null)}
          video={sharingVideo}
          copiedText={copiedText}
          onCopyLink={copyShareLink}
        />
      )}

      {/* Rename Video Modal */}
      {renamingVideo && (
        <RenameVideoModal
          isOpen={!!renamingVideo}
          onClose={() => setRenamingVideo(null)}
          renameTitle={renameTitle}
          setRenameTitle={setRenameTitle}
          onConfirm={confirmRenameVideo}
        />
      )}

      {/* Video Details Modal */}
      {detailingVideo && (
        <VideoDetailsModal
          isOpen={!!detailingVideo}
          onClose={() => setDetailingVideo(null)}
          video={detailingVideo}
        />
      )}

      {/* Video Playback Modal */}
      {playingVideo && (
        <VideoPlaybackModal
          isOpen={!!playingVideo}
          onClose={() => setPlayingVideo(null)}
          video={playingVideo}
        />
      )}
    </OptionsContainer>
  );
};

export default Videos;
