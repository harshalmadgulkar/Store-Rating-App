import React from "react";
 
interface PaginationProps {
    count?: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onDocsPerPage: (value: number) => void;
    docsPerPage: number;
}
 
const Pagination: React.FC<PaginationProps> = ({
    count = 0,
    currentPage,
    totalPages,
    onPageChange,
    onDocsPerPage,
    docsPerPage,
}) => {
    const pageNumbers: (number | string)[] = [];
    const maxPageButtons = 3;
 
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
 
    if (endPage - startPage + 1 < maxPageButtons) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, maxPageButtons);
        } else {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }
    }
 
    if (startPage > 1) {
        pageNumbers.push(1);
    }
 
    if (startPage > 2) {
        pageNumbers.push("...");
    }
 
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
 
    if (endPage < totalPages - 1) {
        pageNumbers.push("...");
    }
 
    if (endPage < totalPages) {
        pageNumbers.push(totalPages);
    }
 
    return (
        <div className="my-3 mx-4 md:mx-0 max-sm:text-xs">
            <div className="flex justify-between w-full md:flex-row flex-col p-2 items-center gap-1">
 
                {count > 0 && (
                    <p className="flex justify-start items-center font-semibold text-slate-700 max-md:place-self-start">
                        Total - {count}
                    </p>
                )}
 
                <div className="flex md:flex-row justify-end flex-wrap gap-1 sm:gap-2">
                    <div className="flex " style={{ width: "max-content" }}>
                        {/* Render previous page button */}
                        <button
                            className={`text-sm px-4 py-2 flex items-center justify-center rounded-md ${currentPage === 1
                                ? "cursor-not-allowed text-gray-500"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                        >
 
                            <span className="block md:hidden ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-5 max-sm:size-3"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 19.5 8.25 12l7.5-7.5"
                                    />
                                </svg>
 
                            </span>
 
                            {/* <span className="block md:hidden"></span> */}
                            <span className="hidden md:flex items-center">Prev</span>
                        </button>
 
                        {/* Render individual page numbers */}
                        {pageNumbers.map((pageNumber, index) => (
                            <React.Fragment key={index}>
                                {pageNumber === "..." ? (
                                    <span className="px-3 text-sm py-2 text-gray-600">...</span>
                                ) : (
                                    <button
                                        className={`px-3 text-sm  ${pageNumber === currentPage
                                            ? "bg-gray-200 rounded-md text-gray-800 font-semibold"
                                            : "text-gray-600 hover:font-bold cursor-pointer"
                                            }`}
                                        onClick={() => onPageChange(pageNumber as number)}
                                    >
                                        {pageNumber}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}
 
                        {/* Render next page button */}
                        <button
                            className={`text-sm px-4 py-2 flex items-center justify-center rounded-md ${currentPage === totalPages
                                ? "cursor-not-allowed text-gray-500"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                        >
 
                            <span className="block md:hidden">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-5 max-sm:size-3"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                    />
                                </svg>
                            </span>
                            {/* <span className="block md:hidden"></span> */}
                            <span className="hidden md:flex items-center">Next</span>
                        </button>
                    </div>
 
                    <div className="">
                        <select
                            value={docsPerPage}
                            onChange={(e) => onDocsPerPage(Number(e.target.value))}
                            className="text-sm p-2 text-gray-600"
                        >
                            <option value="50">50/Page</option>
                            <option value="100">100/Page</option>
                            <option value="200">200/Page</option>
                            <option value="500">500/Page</option>
                            <option value="1000">1000/Page</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default Pagination;
 
 