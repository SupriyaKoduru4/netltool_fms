import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { VideoItem } from "./types";

interface VideoPlaybackModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoItem;
}

const VideoPlaybackModal: React.FC<VideoPlaybackModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={video.title}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-200">
          <video
            src={video.url}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col gap-1.5 px-1 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
              {video.format} • {video.size}
            </span>
            <span className="text-xs text-gray-500 font-semibold">{video.date}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {video.description || "No description provided."}
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              text="Close"
              onClick={onClose}
            />
            <Button
              variant="primary"
              text="Go to AI Blog Post"
              onClick={() => {
                navigate(`/videos/${video.id}`);
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VideoPlaybackModal;
