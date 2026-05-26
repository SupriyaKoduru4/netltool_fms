import { NavLink } from "react-router-dom";
import Blogs from "../../assets/Navbar/Blogs.svg";
import Calender from "../../assets/Navbar/Calender.svg";
import Hardware from "../../assets/Navbar/Hardware.svg";
import Home from "../../assets/Navbar/Home.svg";
import Projects from "../../assets/Navbar/Projects.svg";
import Setting from "../../assets/Navbar/Setting.svg";
import Task from "../../assets/Navbar/Task.svg";
import Transcript from "../../assets/Navbar/Transcript.svg";
import VideoRecorder from "../../assets/Navbar/Video-recorder.svg";
import Video from "../../assets/Navbar/Video.svg"

export interface NavItem {
  id: number;
  title: string;
  icon: string;
  path?: string;
  type?: "heading";
}

interface NavbarProps {
  title: string;
}

const options: NavItem[] = [
  {
    id: 1,
    title: "Dashboard",
    icon: Home,
    path: "/",
  },

  {
    id: 2,
    title: "Video Recorder",
    icon: VideoRecorder,
    path: "/video-recorder",
  },

  {
    id: 3,
    title: "Videos",
    icon: Video,
    path: "/videos",
  },

  {
    id: 4,
    title: "Transcripts",
    icon: Transcript,
    path: "/transcripts",
  },

  {
    id: 5,
    title: "Blogs / Notes",
    icon: Blogs,
    path: "/blogs",
  },

  // {
  //   id: 6,
  //   title: "Hardware Components",
  //   icon: Hardware,
  //   path: "/hardwarecomponents"
  // },
  {
    id: 7,
     title: "Projects",
        icon: Projects,
        path: "/projects",
  },
  
  // {
  //   id: 8,
  //   title: "Tasks",
  //       icon: Task,
  //       path: "/tasks",
  // },
  // {
  //   id: 9,
  //   title: "Calendar",
  //       icon: Calender,
  //       path: "/calendar",
  // },


//   {
//     id: 10,
//     title: "Setting",
//     icon: Setting,
//     path: "/settings",
  // },
];

const Navbar = ({
  title,
}: NavbarProps) => {
  return (
    <aside
      className="top-0 left-0 z-50 w-full h-screen  bg-[#0B0B0B] text-white overflow-y-auto " >
       
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#7A7676] flex items-center justify-center  text-white font-bold text-xl " >
            N
          </div>

          <div>
            <h1  className="font-bold text-[16px] leading-none  " >
              {title}
            </h1>

            <p className=" text-[12px] text-[#D1D1D6]  mt-1 " >
              Founder Management System
            </p>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 flex flex-col gap-3">
        {options.map((item) => (
          <div key={item.id}>
            {item.type === "heading" ? (
              <div  className="px-2 pt-2 pb-1 text-[12px] uppercase tracking-wider text-[#B0B0B0]  font-bold " >
                {item.title}
              </div>
            ) : (
              <NavLink
                to={item.path || ""}
                className={({ isActive }) =>
                  `
                  flex items-center gap-4 px-4 py-[8px] rounded-md transition-all duration-200 text-[15px] font-medium
                  ${
                    isActive
                      ? "bg-[#7A7676]"
                      : "bg-black hover:bg-[#1B1B1B]"
                  }
                `
                }
              >
                <img  src={item.icon} alt={item.title}  className="w-6 h-6"/>
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