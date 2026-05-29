import Navbar, { NavItem } from "../components/Home/Navbar";
import CountCard from "../components/UI/CountCard";
import OptionsContainer from "../components/UI/OptionsContainer";

const Homepage = () => {
  return (
    <OptionsContainer>
      <div className="p-8 flex flex-col bg-[#F2F2F7] w-full h-full gap-8">

        {/* Header */}
        <div className="flex flex-col gap-1 border-b border-gray-100 pb-8">
          <p className="text-xs font-medium text-gray-400 tracking-widest uppercase">
            Dashboard
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Hey Udai!
          </h1>
          <p className="text-sm text-gray-400">
            Welcome to the Founder Management System
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400 tracking-wide uppercase">
            Overview
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CountCard title="Total Blogs" count={5} />
            <CountCard title="Total Project Updates"    count={3} />
            <CountCard title="Total Videos"  count={10} />
          </div>
        </div>

      </div>
    </OptionsContainer>
  );
};

export default Homepage;