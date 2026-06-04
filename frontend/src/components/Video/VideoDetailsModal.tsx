import React from "react";
import Modal from "../UI/Modal";
import { VideoItem } from "./types";

interface VideoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoItem;
}

const VideoDetailsModal: React.FC<VideoDetailsModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Video Details"
      size="md"
    >
      <div className="flex flex-col gap-4 p-1 select-none text-left font-medium text-xs text-gray-800">
        <div className="grid grid-cols-[100px_10px_1fr] gap-y-3.5 items-center">
          <span>File Name</span>
          <span>:</span>
          <span className="text-gray-900 font-bold truncate">
            {video.title.replace(/\s+/g, "")}.mp4
          </span>

          <span>Duration</span>
          <span>:</span>
          <span className="text-gray-900 font-bold">{video.duration}</span>

          <span>Resolution</span>
          <span>:</span>
          <span className="text-gray-900 font-bold">1080p</span>

          <span>Created Date</span>
          <span>:</span>
          <span className="text-gray-900 font-bold">{video.date}</span>

          <span>File Size</span>
          <span>:</span>
          <span className="text-gray-900 font-bold">{video.size}</span>

          <span>Tags</span>
          <span>:</span>
          <span className="text-gray-900 font-bold">Project</span>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-gray-800 text-xs font-bold text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VideoDetailsModal;
