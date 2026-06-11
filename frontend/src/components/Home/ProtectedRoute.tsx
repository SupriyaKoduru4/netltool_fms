import { Navigate, Outlet } from "react-router-dom";
import { useAppData } from "../../context/AppDate";

function AppLoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
          N
        </div>
        <div>
          <h1 className="font-bold text-lg text-black leading-tight">Netltool_FMS</h1>
          <p className="text-xs text-gray-400 font-medium">Founder Management System</p>
        </div>
      </div>

      {/* Animated bar */}
      <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-black rounded-full animate-loading-bar" />
      </div>

      {/* Message */}
      <p className="text-sm font-medium text-gray-800 tracking-wide">
        Getting your dashboard ready
      </p>
      <p className="text-xs text-gray-400 mt-1">Just a moment…</p>

      {/* Inline keyframe style */}
      <style>{`
        @keyframes loading-bar {
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function ProtectedRoute() {
  const { isLoggedIn, appLoading } = useAppData();

  console.log('ProtectedRoute - isLoggedIn:', isLoggedIn, 'appLoading:', appLoading);

  if (appLoading) {
    return <AppLoadingScreen />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;