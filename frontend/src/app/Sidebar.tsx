import { useNavigate } from "react-router";
import roxiller_logo from "@assets/roxiller_logo.webp";
import AccordionMenu from "@components/AccordionMenu";
import {
  LayoutDashboard,
  LogOut,
  Store,
  User,
  X,
} from "lucide-react";
import { logout } from "@features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { UserRole } from "./RouteProtector";

import { useEffect, useRef } from "react";

interface MenuItem {
  name: string;
  url?: string;
  icon: React.ReactNode;
  children?: MenuItem[];
  allowedRoles?: UserRole[];
}

const Sidebar = ({
  isOpenSidebar,
  closeSidebar,
}: {
  isOpenSidebar: boolean;
  closeSidebar: () => void;
}) => {
  const { user } = useAppSelector((state) => state?.auth);
  const currentUserRole: UserRole | undefined = user?.user
    ?.role as UserRole;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarParentRef = useRef<HTMLElement>(null);

  const menu: MenuItem[] = [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard size={15} />,
      allowedRoles: [
        "ADMIN",
        "STORE_OWNER",
      ],
    },
    {
      name: "Users",
      url: "/dashboard/users",
      icon: <User size={15} />,
      allowedRoles: ["ADMIN"],
    },
    {
      name: "Stores",
      url: "/dashboard/stores",
      icon: <Store size={15} />,
      allowedRoles: ["ADMIN", "USER"],
    },

  ];

  const filterMenuItems = (
    items: MenuItem[],
    role: UserRole | undefined
  ): MenuItem[] => {
    if (!role) return [];

    return items.filter((item) => {
      const isAllowed = !item.allowedRoles || item.allowedRoles.includes(role);

      if (item.children) {
        item.children = filterMenuItems(item.children, role);
        return isAllowed && (item.children.length > 0 || !!item.url);
      }
      return isAllowed;
    });
  };

  const filteredMenu = filterMenuItems(menu, currentUserRole);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const resizeListener = () => {
      const curWidth = window.innerWidth;

      if (curWidth >= 1024) {
        closeSidebar();
      }
    };

    const handleClickSidebarParent = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const curWidth = window.innerWidth;

      if (sidebarRef.current && sidebarRef.current.contains(target)) {
        if (!target.closest("button")) {
          return;
        }
      }

      if (curWidth <= 1024) {
        closeSidebar();
      }
    };

    if (sidebarParentRef.current) {
      sidebarParentRef.current.addEventListener(
        "click",
        handleClickSidebarParent
      );
    }

    window.addEventListener("resize", resizeListener);

    return () => {
      if (sidebarParentRef.current) {
        sidebarParentRef.current.removeEventListener(
          "click",
          handleClickSidebarParent
        );
      }

      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <>
      <section
        ref={sidebarParentRef}
        className={`fixed lg:static z-50 w-0 lg:w-2xs h-screen overflow-hidden  bg-transparent ${isOpenSidebar ? "w-full !bg-black/50" : ""
          } transition-all `}
      >
        <div
          ref={sidebarRef}
          className={`py-2 flex flex-col w-2xs lg:w-full h-full transform transition-transform duration-300 ease-in-out ${isOpenSidebar ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 bg-white`}
        >
          <div className="lg:hidden flex justify-end px-4 mb-2">
            <button
              className="cursor-pointer border p-1 rounded-md border-transparent hover:border-gray-100 text-gray-600"
              onClick={closeSidebar}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <header className="flex justify-center items-center gap-2 mx-auto h-16">
            <img src={roxiller_logo} width={42} height={42} />
            <span>
              <h1 className="font-bold text-xs">
                STORE RATING APP
              </h1>
              <p className="text-[10px] text-gray-600">
                Roxiller Systems
              </p>
            </span>
          </header>

          <div className="flex-1 flex flex-col items-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 px-8 mt-5">
            <AccordionMenu items={filteredMenu} />
          </div>

          <button
            className=" border border-gray-50 p-3 py-2 flex mb-4 text-black rounded-md cursor-pointer m-auto items-center gap-1 duration-300 hover:-translate-x-2"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
