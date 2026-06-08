import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppData } from "../../context/AppDate";
import {useNavigate} from "react-router-dom";

export function ProfileDropdown() {
  
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {user , logout} = useAppData();

  const navigate = useNavigate();

  console.log('ProfileDropdown - user:', user);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex flex-row items-center gap-3 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors duration-150 group"
      >
        <div className="relative flex-shrink-0">
          <img
            src={`${(import.meta as any).env.VITE_BASE_URL}${user?.avatar_url}`}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.first_name} {user?.last_name}</p>
          <p className="text-[11px] text-gray-400 uppercase tracking-wide leading-tight mt-1">{user?.role?.name}</p>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 mt-1.5 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="px-3.5 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left" onClick={()=>navigate("/settings")}>
              <UserIcon />
              View profile
            </button>
            
          </div>

          {/* Logout */}
          <div className="p-1.5 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
            >
              <LogOutIcon />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}