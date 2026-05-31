import React from "react";
import OptionsContainer from "../components/UI/OptionsContainer";

interface ComingSoonProps {
  title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <OptionsContainer>
      <div className="p-8 flex flex-col items-center justify-center bg-[#F2F2F7] w-full h-[calc(100vh-60px)] gap-4">
        <div className="text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm max-w-md w-full">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <svg
              className="w-8 h-8 text-gray-400 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{title} Page</h1>
          <p className="text-sm text-gray-500 mb-6">
            This module is currently under development. Check back soon for updates!
          </p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full w-2/3 animate-infinite" />
          </div>
        </div>
      </div>
    </OptionsContainer>
  );
};

export default ComingSoon;
