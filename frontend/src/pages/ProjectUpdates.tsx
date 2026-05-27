import React, { useState } from 'react';
import UpdateCard, { Update } from '../components/Project/UpdateCard';
import {useNavigate} from 'react-router-dom'

const MOCK_UPDATES: Update[] = [
  {
    id: 'a1b2c3d4e5f6',
    message: 'Authentication System Added',
    description: 'Added login, register and forgot password functionality.',
    timestamp: '12 May 2026 · 10:30 PM',
    tag: 'feature',
    author: 'Yashwanth',
  },
  {
    id: 'f7e6d5c4b3a2',
    message: 'Dashboard UI Updated',
    description: 'Added charts and analytics widgets.',
    timestamp: '13 May 2026 · 04:15 PM',
    tag: 'update',
    author: 'Yashwanth',
  },
  {
    id: 'c9d8e7f6a5b4',
    message: 'Fixed session expiry bug',
    description: 'Resolved an issue where sessions were expiring prematurely on mobile clients.',
    timestamp: '25 May 2026 · 11:05 AM',
    tag: 'fix',
    author: 'Yashwanth',
  },
];

const TAG_OPTIONS = ['all', 'feature', 'fix', 'update', 'milestone'] as const;
type TagFilter = typeof TAG_OPTIONS[number];

function ProjectUpdates() {
  const [updates, setUpdates] = useState<Update[]>(MOCK_UPDATES);
  const [filter, setFilter] = useState<TagFilter>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    message: '',
    description: '',
    tag: 'update' as Update['tag'],
    author: '',
  });

  const progress = 65;

  const handleAdd = () => {
    if (!form.message.trim()) return;
    const newUpdate: Update = {
      id: Math.random().toString(36).slice(2, 10),
      message: form.message,
      description: form.description,
      tag: form.tag,
      author: form.author || 'Anonymous',
      timestamp: new Date().toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
    };
    setUpdates([newUpdate, ...updates]);
    setForm({ message: '', description: '', tag: 'update', author: '' });
    setShowForm(false);
  };

  const filtered = filter === 'all' ? updates : updates.filter((u) => u.tag === filter);

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 font-normal text-black">

      {/* Back nav */}
      <div className="bg-white border-b border-gray-200 px-5 py-3">
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors" onClick={()=>navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Projects
        </button>
      </div>

      <div className="p-40  py-6 space-y-4">

        {/* Project info card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex gap-4 items-center">
            {/* Thumbnail */}
            <div className="w-40 h-40 rounded-lg bg-gray-200 overflow-hidden shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                <span className="text-2xl font-black text-white">P</span>
              </div>
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant R1 V1</h1>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-24 shrink-0">Created At</span>
                  <span className="text-gray-400">:</span>
                  <span>17 May 2026, 10:30 PM</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-24 shrink-0">Created By</span>
                  <span className="text-gray-400">:</span>
                  <span>John Doe</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-24 shrink-0">Progress</span>
                  <span className="text-gray-400">:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-semibold text-gray-800">{progress}%</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">Summary</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Restaurant R1 V1 is the first version of our restaurant management system.
            It includes dashboard, menu management, order processing, customer management and basic reports.
          </p>
        </div>

        {/* Create Update button row */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-semibold tracking-widest uppercase rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create Update
          </button>
        </div>

        {/* Add update form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs tracking-widest uppercase font-semibold text-gray-400 mb-4">New Update</p>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-black transition font-mono"
              placeholder="Update message *"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-black transition resize-none font-mono"
              placeholder="Description (optional)"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="flex gap-3 flex-wrap mb-4">
              <input
                className="flex-1 min-w-[140px] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black transition font-mono"
                placeholder="Your name"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black transition bg-white font-mono"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value as Update['tag'] })}
              >
                <option value="update">Update</option>
                <option value="feature">Feature</option>
                <option value="fix">Fix</option>
                <option value="milestone">Milestone</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs tracking-widest uppercase text-gray-400 hover:text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-5 py-2 bg-black text-white text-xs font-semibold tracking-widest uppercase rounded-lg hover:bg-gray-800 transition-colors"
              >
                Push Update
              </button>
            </div>
          </div>
        )}

        {/* Project Updates section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800">Project Updates</p>

            {/* Filter pills */}
            <div className="flex gap-1.5 flex-wrap">
              {TAG_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-2.5 py-0.5 text-[10px] tracking-widest uppercase rounded-full border transition-colors ${
                    filter === t
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          {filtered.length > 0 ? (
            <div>
              {filtered.map((update, i) => (
                <UpdateCard key={update.id} update={update} isLast={i === filtered.length - 1} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl bg-white">
              <p className="text-sm text-gray-400">No updates for this filter.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProjectUpdates;