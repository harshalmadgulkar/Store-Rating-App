import { Suspense, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "@app/Sidebar";
import Menubar from "@app/Menubar";

const DashLayout = () => {

  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);

  const closeSidebar = () => {
    setIsOpenSidebar(false);
  };

  const openSidebar = () => {
    setIsOpenSidebar(true);
  };

  return (
    <div className="h-screen flex relative overflow-hidden">
      <Sidebar isOpenSidebar={isOpenSidebar} closeSidebar={closeSidebar} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-10 flex-shrink-0">
          <Menubar openSidebar={openSidebar} />
        </div>

        {/* Single scroll container */}
        <div className="flex-1 w-full overflow-y-auto px-4 md:px-10 py-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default DashLayout;