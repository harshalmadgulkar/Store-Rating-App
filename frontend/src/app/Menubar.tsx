import { useNavigate } from "react-router";
import Breadcrumb from "./Breadcrumb";
import { useAppSelector } from "./hooks";
import Profile from "@assets/profile.svg";
import { Menu } from "lucide-react";
import roxiller_logo from "../assets/roxiller_logo.webp";
const Menubar = ({ openSidebar }: { openSidebar: () => void; }) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state?.auth);
  const profile = user?.user;

  return (
    <div className="px-6 py-2.5 flex justify-between items-center right-0 left-0 lg:left-[18vw]  shadow-gray-300/50 shadow-md bg-transparent">
      <span className='hidden lg:block'>
        <Breadcrumb />
      </span>
      <span className='flex lg:hidden items-center gap-2'>
        <img src={roxiller_logo} alt="roxiller_logo" width={30} />

        <span >
          <p className='text-[10px] font-bold text-blue-800'>STORE RATING APP</p>
          <p className='text-[10px]'>Roxiller Systems</p>
        </span>
      </span>

      <div className="flex gap-1 max-lg:w-full max-lg:justify-end">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("profile")}
        >
          <img src={Profile} alt="Profile" width={28} />
          <div className="hidden lg:block">

            <span>
              <h6 className="font-bold text-xs text-black group-hover:text-blue-600">
                {profile.name}
              </h6>
              <h6 className="font-regular text-gray-600 text-xs">
                {profile?.role}
              </h6>
            </span>
          </div>
        </div>
        <button
          className="lg:hidden p-1 rounded-md border border-transparent hover:border-gray-100 text-gray-600 cursor-pointer"
          onClick={openSidebar}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
  );
};

export default Menubar;
