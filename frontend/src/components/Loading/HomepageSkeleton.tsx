function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className ?? ""}`}
      style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
    />
  );
}

function HomepageSkeleton() {
  return (
    <div className="p-8 flex flex-col bg-[#F2F2F7] w-full h-full gap-8">

      {/* Header skeleton */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-8">
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-7 w-56 mt-1" />
        <SkeletonBox className="h-3 w-72 mt-1" />
      </div>

      {/* Stats skeleton */}
      <div className="flex flex-col gap-3">
        <SkeletonBox className="h-3 w-16" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-3 bg-[#E5E5EA] border border-gray-200 rounded-xl p-5 w-full shadow-sm"
            >
              <SkeletonBox className="h-3 w-24" />
              <SkeletonBox className="h-9 w-16 mt-1" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { opacity: 1; }
          50%  { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default HomepageSkeleton;