import React from "react";
import Modal from "../UI/Modal";
import { VideoItem } from "./types";
import { RiMailLine, RiWhatsappLine, RiLink } from "react-icons/ri";

interface ShareVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoItem;
  copiedText: boolean;
  onCopyLink: (url: string) => void;
}

const ShareVideoModal: React.FC<ShareVideoModalProps> = ({
  isOpen,
  onClose,
  video,
  copiedText,
  onCopyLink,
}) => {
  const shareUrl = `https://netitool-fms.com/video/${video.id}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            value={shareUrl}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 outline-none truncate"
          />
          <button
            onClick={() => onCopyLink(shareUrl)}
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
              href={`mailto:?subject=FMS Video - ${video.title}&body=Check out this video: ${shareUrl}`}
              className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition-colors"
            >
              <RiMailLine className="w-4 h-4 text-gray-500" />
              <span>Email</span>
            </a>
            
            <a
              href={`https://api.whatsapp.com/send?text=Check out this video: ${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition-colors"
            >
              <RiWhatsappLine className="w-4 h-4 text-green-500" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => onCopyLink(shareUrl)}
              className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition-colors"
            >
              <RiLink className="w-4 h-4 text-gray-500" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareVideoModal;
