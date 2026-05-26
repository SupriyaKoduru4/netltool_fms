import CustomInput from "../Login/CustomInput"
import IconButton from "../UI/IconButton"
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSettings } from "react-icons/ci";

const LoginBar: React.FC = () => {
  return (
    <div className="px-6 py-3 flex flex-row items-center justify-between bg-white border-b border-gray-100">

      {/* Search */}
      <div className="w-80">
        <CustomInput
          type="search"
          placeholder="Search anything..."
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">

        {/* Notification */}
        <div className="relative">
          <IconButton
            icon={<IoIosNotificationsOutline size={20} />}
            onClick={() => {}}
          />
          {/* Badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gray-800 rounded-full ring-2 ring-white" />
        </div>

        {/* Settings */}
        <IconButton
          icon={<CiSettings size={20} />}
          onClick={() => {}}
        />

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-3" />

        {/* Profile */}
        <button className="flex flex-row items-center gap-3 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors duration-150 group">
          <div className="relative flex-shrink-0">
            <img
              src="/profile.png"
              alt="profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-700 rounded-full ring-2 ring-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">John Doe</p>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide leading-tight">Admin</p>
          </div>
          <svg
            className="w-3.5 h-3.5 text-gray-400 ml-1 group-hover:text-gray-600 transition-colors"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

      </div>
    </div>
  );
};

export default LoginBar;