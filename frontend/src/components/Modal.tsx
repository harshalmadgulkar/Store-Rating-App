import React, { useEffect, useState, ReactNode } from "react";

// 1. Define a type for the props

type ModalProps = {
  titleIcon?: React.ReactNode;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xlg" | "full"; // size is optional
};

// 2. Add props type in component
const Modal: React.FC<ModalProps> = ({ titleIcon, title, children, onClose, size }) => {

  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setIsVisible(true);

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // after fade-out
  };

  const getSizeClass = (): string => {
    switch (size) {
      case "sm":
        return "w-[40vw] max-w-[90vw]";
      case "md":
        return "w-[60vw] max-w-[95vw]";
      case "lg":
        return "w-[75vw] max-w-[95vw]";
      case "xlg":
        return "w-[90vw] max-w-[95vw]";
      case "full":
        // return "w-auto max-w-full";
        return "w-auto min-w-full";
      default:
        return "w-[60vw] max-w-[95vw]";
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[0.5px] z-50
          transition-opacity duration-300  ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className={`bg-white rounded-lg shadow-lg w-100 relative transform transition-all duration-300 
            ${getSizeClass()} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="flex justify-between items-center px-6 py-4">
          <span className="flex items-center gap-1">
            {titleIcon && <span className="text-xl">{titleIcon}</span>}
            <h6 className="text-xl font-semibold mb-0">{title}</h6>
          </span>
            
          <button
            className="text-gray-600 cursor-pointer hover:text-black duration-300 scale-100 hover:scale-125"
            onClick={handleClose}>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.219668 1.28033C-0.0732225 0.987438 -0.0732225 0.512558 0.219668 0.219668C0.512558 -0.0732225 0.987438 -0.0732225 1.28033 0.219668L5.999 4.9384L10.7176 0.219798C11.0105 -0.0730923 11.4854 -0.0730923 11.7782 0.219798C12.0711 0.512688 12.0711 0.987568 11.7782 1.28046L7.0597 5.999L11.7782 10.7176C12.0711 11.0105 12.0711 11.4854 11.7782 11.7782C11.4854 12.0711 11.0105 12.0711 10.7176 11.7782L5.999 7.0597L1.28033 11.7784C0.987438 12.0713 0.512558 12.0713 0.219668 11.7784C-0.0732225 11.4855 -0.0732225 11.0106 0.219668 10.7177L4.9384 5.999L0.219668 1.28033Z" fill="#3E3E3E" />
            </svg>

          </button>
        </div>

        <div className="px-7 py-2 mb-7">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
