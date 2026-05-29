import { useState } from "react";

import OptionsContainer from "../components/UI/OptionsContainer";

import SettingsSidebar from "../components/Settings/settingssidebar";

import GeneralSettings from "../components/Settings/General";

import ProfileSettings from "../components/Settings/Profile";

function Settings() {

  const [activeTab, setActiveTab] = useState<string>("general");

  const renderContent = () => {

    switch (activeTab) {

      case "general":
        return <GeneralSettings />;

      case "profile":
        return <ProfileSettings />;

      default:
        return <GeneralSettings />;
    }
  };

  const renderTitle = () => {

    switch (activeTab) {

      case "general":
        return "Settings";

      case "profile":
        return "Profile";

      default:
        return "Settings";
    }
  };

  return (

    <OptionsContainer>

      <div className="p-5 bg-[#F2F2F7] min-h-screen">

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-black">
            {renderTitle()}
          </h1>

          <p className="text-gray-500 text-sm mt-1">

            {activeTab === "general" &&
              "Manage your account and application preferences."}

            {activeTab === "profile" &&
              "View and Update your personal information"}

          </p>

        </div>

        <div className=" border border-gray-200 rounded-md bg-white p-4 flex gap-3">

          <SettingsSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="flex-1">
            {renderContent()}
          </div>

        </div>

      </div>

    </OptionsContainer>
  );
}

export default Settings;