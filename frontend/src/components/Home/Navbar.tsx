import { NavLink } from "react-router-dom";
// @ts-ignore
import Blogs from "../../assets/Navbar/Blogs.svg";
// @ts-ignore
import Hardware from "../../assets/Navbar/Hardware.svg";
// @ts-ignore
import Home from "../../assets/Navbar/Home.svg";
// @ts-ignore
import Projects from "../../assets/Navbar/Projects.svg";
// @ts-ignore
import Setting from "../../assets/Navbar/Setting.svg";
// @ts-ignore
import Transcript from "../../assets/Navbar/Transcript.svg";
import { useGetPermissionQuery } from "../../services/api/rolePermissionSlice";
import { useAppData } from "../../context/AppDate";

export interface NavItem {
  id: number;
  title: string;
  icon: string;
  path?: string;
  type?: "heading";
  requiredPermission?: {
    id: number;         // matches permission id from API
    name: string;       // matches permission name from API (e.g. "blogs:view")
  };
}

interface NavbarProps {
  title: string;
}

/**
 * Permission reference (from API):
 * id:1  blogs:create
 * id:2  blogs:view
 * id:3  projects:create
 * id:4  projects:update
 * id:5  projects:delete
 * id:6  streamlab:access
 * id:7  users:create
 * id:8  users:delete
 */
const options: NavItem[] = [
  {
    id: 1,
    title: "Dashboard",
    icon: Home,
    path: "/",
    // No permission required — always visible
  },
  {
    id: 5,
    title: "Blogs / Notes",
    icon: Blogs,
    path: "/blogs",
    requiredPermission: { id: 2, name: "blogs:view" },
  },
  {
    id: 6,
    title: "Hardware Components",
    icon: Hardware,
    path: "/hardwarecomponents",
    requiredPermission: { id: 6, name: "streamlab:access" },
  },
  {
    id: 7,
    title: "MANAGEMENT",
    icon: "",
    type: "heading",
  },
  {
    id: 8,
    title: "Projects",
    icon: Projects,
    path: "/projects",
    requiredPermission: { id: 3, name: "projects:create" },
  },
  {
    id: 11,
    title: "Manage Users",
    icon: Transcript,
    path: "/manage-users",
    requiredPermission: { id: 7, name: "users:create" },
  },
  {
    id: 12,
    title: "Manage Roles",
    icon: Blogs,
    path: "/manage-roles",
    requiredPermission: { id: 7, name: "users:create" },
  },
  {
    id: 13,
    title: "Settings",
    icon: Setting,
    path: "/settings",
    // No permission required — always visible
  },
];

const Navbar = ({ title }: NavbarProps) => {
  const { data, isLoading } = useGetPermissionQuery("permission");

  const {permissions , appLoading}  = useAppData()
  console.log("this is app loading from navbar" , permissions)

  // Build both a Set of allowed IDs and names for dual matching
  const allowedPermissionIds = new Set<number>(
    permissions?.map((p: { id: number }) => p.id) ?? []
  );
  const allowedPermissionNames = new Set<string>(
    permissions?.map((p: { name: string }) => p.name) ?? []
  );

  const hasPermission = (required?: NavItem["requiredPermission"]): boolean => {
    if (!required) return true; // No restriction → always visible
    // Match by BOTH id and name — both must be present in the user's permissions
    return (
      allowedPermissionIds.has(required.id) &&
      allowedPermissionNames.has(required.name)
    );
  };

  // Filter items + strip orphaned headings
  const visibleOptions = options.reduce<NavItem[]>((acc, item, idx) => {
    if (item.type === "heading") {
      const hasVisibleChildren = options
        .slice(idx + 1)
        .some(
          (next) =>
            next.type !== "heading" && hasPermission(next.requiredPermission)
        );
      if (hasVisibleChildren) acc.push(item);
      return acc;
    }

    if (hasPermission(item.requiredPermission)) acc.push(item);
    return acc;
  }, []);

  if (isLoading) {
    return (
      <aside className="top-0 left-0 z-50 w-full h-screen bg-[#0B0B0B] text-white overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#7A7676] flex items-center justify-center text-white font-bold text-xl">
              N
            </div>
            <div>
              <h1 className="font-bold text-[16px] leading-none">{title}</h1>
              <p className="text-[12px] text-[#D1D1D6] mt-1">Founder Management System</p>
            </div>
          </div>
        </div>
        <div className="px-3 pb-3 flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-[#1B1B1B] animate-pulse" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="top-0 left-0 z-50 w-full h-screen bg-[#0B0B0B] text-white overflow-y-auto">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#7A7676] flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <div>
            <h1 className="font-bold text-[16px] leading-none">{title}</h1>
            <p className="text-[12px] text-[#D1D1D6] mt-1">Founder Management System</p>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 flex flex-col gap-3">
        {visibleOptions.map((item) => (
          <div key={item.id}>
            {item.type === "heading" ? (
              <div className="px-2 pt-2 pb-1 text-[12px] uppercase tracking-wider text-[#B0B0B0] font-bold">
                {item.title}
              </div>
            ) : (
              <NavLink
                to={item.path || ""}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-[8px] rounded-md transition-all duration-200 text-[15px] font-medium
                  ${isActive ? "bg-[#7A7676]" : "bg-black hover:bg-[#1B1B1B]"}`
                }
              >
                <img src={item.icon} alt={item.title} className="w-6 h-6" />
                <span>{item.title}</span>
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Navbar;