import React from "react";
import Modal from "../UI/Modal";

interface DeleteVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteVideoModal: React.FC<DeleteVideoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-[#FF5A5F] hover:bg-[#FF4449] rounded-lg text-xs font-bold text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteVideoModal;
