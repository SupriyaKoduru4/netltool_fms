import Button from "../UI/Button";

interface Props {

  activeTab: string;

  setActiveTab: (
    tab: string
  ) => void;
}

function SettingsSidebar({
  activeTab,
  setActiveTab,
}: Props) {

  return (
    <div className=" w-[200px] border border-gray-200 rounded-md p-4 flex flex-col " >

      <h3 className="font-bold text-xl text-black mb-5">
        Setting
      </h3>

      <div className="flex flex-col gap-3">

        <button
          onClick={() =>
            setActiveTab("general")
          }
          className={` border border-gray-400 py-1 rounded-md text-lg transition-all
            ${
              activeTab === "general"
                ? "bg-black text-white"
                : "bg-[#ffff]"
            }
          `}
        >
          General
        </button>

        <button
          onClick={() =>
            setActiveTab("profile")
          }
          className={` border border-gray-400 py-1 rounded-md text-lg transition-all
            ${
              activeTab === "profile"
                ? "bg-black text-white"
                : "bg-[#ffff]"
            }
          `}
        >
          Profile
        </button>

      </div>

      <div className="mt-auto pt-6">

        <Button
          text="Logout"
          variant="primary"
          wide
        />

      </div>

    </div>
  );
}

export default SettingsSidebar;