import CustomInput from "../Login/CustomInput"
import IconButton from "../UI/IconButton"
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";

const LoginBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="px-6 py-3 flex flex-row items-center justify-between bg-[#E5E5EA] border-b border-gray-100">

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
               onClick={() => navigate("/notifications")}
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
      <ProfileDropdown/>

      </div>
    </div>
  );
};

export default LoginBar;