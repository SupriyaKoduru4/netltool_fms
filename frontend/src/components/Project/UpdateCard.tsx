import React from 'react';

export interface Update {
  id: string;
  message: string;
  description?: string;
  timestamp: string;
  tag?: 'feature' | 'fix' | 'update' | 'milestone';
  author?: string;
}

const tagStyles: Record<string, string> = {
  feature:   'bg-blue-50 text-blue-600 border-blue-200',
  fix:       'bg-red-50 text-red-600 border-red-200',
  update:    'bg-amber-50 text-amber-600 border-amber-200',
  milestone: 'bg-green-50 text-green-700 border-green-200',
};

function UpdateCard({ update, isLast }: { update: Update; isLast?: boolean }) {
  return (
    <div className="flex gap-4 group">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-black border-2 border-white ring-2 ring-black mt-1 shrink-0 group-hover:scale-125 transition-transform duration-200" />
        {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1" />}
      </div>

      {/* Card */}
      <div className="flex-1 mb-8 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {update.tag && (
              <span className={`text-[10px] font-semibold tracking-widest uppercase border rounded px-2 py-0.5 ${tagStyles[update.tag]}`}>
                {update.tag}
              </span>
            )}
            <p className="text-sm font-semibold text-gray-900">{update.message}</p>
          </div>
          <span className="text-[11px] text-gray-400 font-mono whitespace-nowrap">{update.timestamp}</span>
        </div>

        {update.description && (
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">{update.description}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-[9px] text-white font-bold uppercase">
                {update.author ? update.author[0] : 'U'}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">{update.author ?? 'Unknown'}</span>
          </div>
          <span className="font-mono text-[10px] text-gray-300 select-all">#{update.id.slice(0, 7)}</span>
        </div>
      </div>
    </div>
  );
}

export default UpdateCard;