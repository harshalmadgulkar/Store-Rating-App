import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  name: string;
  url?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
};

interface AccordionMenuProps {
  items: NavItem[];
}

const AccordionMenu: React.FC<AccordionMenuProps> = ({ items }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isExact = (url?: string) => url === path;
  const isChildActive = (children?: NavItem[]) =>
    children?.some((child) => isExact(child.url));

  const handleParentClick = (
    index: number,
    hasChildren: boolean,
    url?: string
  ) => {
    if (hasChildren) {
      setOpenIndex(openIndex === index ? null : index);
    } else {
      navigate(url!);
      setOpenIndex(null);
    }
  };

  return (
    <div className="w-full space-y-1 rounded-md p-1 relative">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const hasChildren = !!item.children;
        const isActiveParentNoChildren = isExact(item.url) && !hasChildren;
        const isAnyChildActive = isChildActive(item.children);

        const showBlueBg = isOpen || isAnyChildActive;

        return (
          <div key={item.name} className="relative overflow-hidden rounded-md">
            {/* Active animated highlight only for parent without children */}
            {isActiveParentNoChildren && (
              <motion.div
                layoutId="activeBg"
                className="absolute inset-0 bg-blue-600 rounded-md z-0 will-change-transform"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  mass: 0.5,
                }}
              />
            )}

            {hasChildren ? (
              <motion.div
                layout
                onClick={() => handleParentClick(index, hasChildren, item.url)}
                className={`relative cursor-pointer w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium z-10 transition-colors duration-200
                ${isActiveParentNoChildren ? "text-white" : "text-gray-800"}
                ${!isActiveParentNoChildren && showBlueBg ? "bg-blue-100" : ""}
              `}
              >
                <span className="flex items-center gap-1">
                  {item.icon}
                  {item.name}
                </span>

                <motion.svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <path
                    d="M19.5 8.25L12 15.75L4.5 8.25"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </motion.div>
            ) : (
              <motion.button
                layout
                onClick={() => handleParentClick(index, hasChildren, item.url)}
                className={`relative cursor-pointer w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium z-10 transition-colors duration-200
                ${isActiveParentNoChildren ? "text-white" : "text-gray-800"}
                ${!isActiveParentNoChildren && showBlueBg ? "bg-blue-100" : ""}
              `}
              >
                <span className="flex items-center gap-1">
                  {item.icon}
                  {item.name}
                </span>
              </motion.button>
            )}

            {/* Accordion Children */}
            <AnimatePresence initial={false}>
              {hasChildren && isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                  className="pl-5 pr-2 py-1 space-y-1 bg-blue-100 "
                >
                  {item.children?.map((child) => {
                    const isChildExact = isExact(child.url);

                    return (
                      <div
                        key={child.url}
                        className="relative rounded-md overflow-hidden"
                      >
                        {isChildExact && (
                          <motion.div
                            layoutId="activeBg"
                            className="absolute inset-0 bg-blue-600 rounded-md z-0"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            }}
                          />
                        )}
                        <button
                          onClick={() => navigate(child.url!)}
                          className={`flex cursor-pointer items-center gap-1 relative w-full px-3 py-1 rounded-md text-sm z-10 text-left transition-colors duration-200 ${isChildExact
                            ? "text-white"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          {child.icon}
                          {child.name}
                        </button>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default AccordionMenu;
