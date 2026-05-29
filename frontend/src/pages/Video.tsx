import Button from "../components/UI/Button";
import OptionsContainer from "../components/UI/OptionsContainer";
import VideoRecorder from "../components/Video/VideoRecorder";

function Video() {
  return (
    <OptionsContainer>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gray-400 font-medium mb-1">
              Studio
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Video Management
            </h1>
            <p className="text-sm text-gray-500">
              Record, edit, and manage your videos.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button
              variant="primary"
              size="md"
              text="Upload Video"
              onClick={() => alert('This will allow us to upload the video.')}
            />
          </div>
        </div>

        {/* Recorder Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400">
              Recorder
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <VideoRecorder />
          </div>
        </div>

        {/* Video Library Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400">
              Library
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Empty state */}
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.88v6.24a1 1 0 01-1.447.889L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No videos yet</p>
            <p className="text-xs text-gray-400">
              Record or upload a video to get started.
            </p>
          </div>
        </div>

      </div>
    </OptionsContainer>
  );
}

export default Video;