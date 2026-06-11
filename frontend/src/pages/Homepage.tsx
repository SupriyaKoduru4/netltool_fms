import OptionsContainer from "../components/UI/OptionsContainer";
import CountCard from "../components/UI/CountCard";
import HomepageSkeleton from "../components/Loading/HomepageSkeleton";
import { useAppData } from "../context/AppDate";
import { useGetStatsQuery } from "../services/api/blogSlice";

const Homepage = () => {
  const { user } = useAppData();
  const { data, isLoading, isError } = useGetStatsQuery("stats");

  return (
    <OptionsContainer>
      {isLoading ? (
        <HomepageSkeleton />
      ) : (
        <div className="p-8 flex flex-col bg-[#F2F2F7] w-full h-full gap-8">

          {/* Header */}
          <div className="flex flex-col gap-1 border-b border-gray-100 pb-8">
            <p className="text-xs font-medium text-gray-400 tracking-widest uppercase">
              Dashboard
            </p>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Hey {user?.first_name} {user?.last_name}!
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
              {isError && (
                <p className="text-xs text-red-400 col-span-3">Failed to load stats.</p>
              )}
              {data && <CountCard title="Total Blogs" count={data?.blog_count} />}
            </div>
          </div>

        </div>
      )}
    </OptionsContainer>
  );
};

export default Homepage;