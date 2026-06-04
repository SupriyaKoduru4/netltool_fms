import React from "react";
import Modal from "../UI/Modal";

interface RenameVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  renameTitle: string;
  setRenameTitle: (title: string) => void;
  onConfirm: () => void;
}

const RenameVideoModal: React.FC<RenameVideoModalProps> = ({
  isOpen,
  onClose,
  renameTitle,
  setRenameTitle,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-black hover:bg-gray-800 text-xs font-bold text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RenameVideoModal;
