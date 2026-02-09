import { FileX } from "lucide-react";

type TableAction = "view" | "edit" | "delete";

interface CustomTableProps<T extends Record<string, any>> {
	loading?: boolean;
	skeletonRows?: number;
	maxHeight?: string;
	headers: string[];
	headersBg?: string;
	keys: string[];
	data: T[];
	actionTypes?: TableAction[];
	onActionClick?: (action: TableAction, rowData: T) => void;
	columnRenderers?: {
		[key: string]: (val: any, row: T) => React.ReactNode;
	};
	columnStyles?: {
		[key: string]: string; // Tailwind classes or custom styles per key
	};
	currentPage?: number;
	docsPerPage?: number;
}

const getValueFromPath = (obj: any, path: string): any => {
	if (!path.includes(".")) {
		const matches: string[] = [];
		const traverse = (o: any): void => {
			for (const key in o) {
				if (key === path) matches.push(o[key]);
				if (typeof o[key] === "object" && o[key] !== null)
					traverse(o[key]);
			}
		};
		traverse(obj);

		if (matches.length === 1) return matches[0];
		if (matches.length > 1)
			console.warn(`Key "${path}" is ambiguous, please use a more precise key like "report.${path}".`);
		return matches[0];
	}

	return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const Table = <T extends Record<string, any>>({
	loading = false,
	skeletonRows = 10,
	maxHeight = "63vh",
	headers,
	headersBg = "bg-gray-50",
	keys,
	data,
	actionTypes = [],
	onActionClick,
	columnRenderers = {},
	columnStyles = {},
	currentPage = 1,
	docsPerPage = 50,
}: CustomTableProps<T>) => {
	const handleClick = (e: React.MouseEvent<HTMLTableElement>) => {
		const action = (e.target as HTMLElement)
			.closest("[data-action]")
			?.getAttribute("data-action") as TableAction;
		const index = (e.target as HTMLElement)
			.closest("[data-index]")
			?.getAttribute("data-index");

		if (action && index !== null && index !== undefined) {
			const rowData = data[+index];
			onActionClick?.(action, rowData);
		}
	};

	return (
		<div className={`customTable relative overflow-auto`} style={{ maxHeight }}> { /* Removed max-h-63vh class from here, as prop behaviour with tailwind height class */}
			<table
				className="min-w-max border-collapse text-sm"
				onClick={handleClick}>
				<thead>
					<tr>
						<th className={`sticky top-0 left-0 z-20  shadow-md px-4 py-2 text-left ${headersBg}`}>
							Sr.
						</th>
						{headers.map((header, i) => (
							<th
								key={i}
								className={`sticky top-0 z-10 shadow-md px-4 py-2 text-left whitespace-nowrap ${headersBg}`}>
								{header}
							</th>
						))}
						{actionTypes.length > 0 && (
							<th className={`sticky top-0 z-10  shadow-md px-4 py-2 text-left ${headersBg}`}>
								Actions
							</th>
						)}
					</tr>
				</thead>

				<tbody>
					{/* Conditional rendering for loading, no data, or actual data */}
					{loading ? (
						// --- Show Skeleton Loader ---
						[...Array(skeletonRows)].map((_, rowIndex) => (
							<tr key={rowIndex}>
								{/* Sr. No cell */}
								<td className="px-2 py-2 whitespace-nowrap">
									<div className="w-6 h-4 bg-gray-300 rounded animate-pulse" />
								</td>

								{/* Data cells */}
								{[...Array(headers.length)].map(
									(_, colIndex) => (
										<td
											key={colIndex}
											className="px-2 py-2 whitespace-nowrap">
											<div className="w-28 h-4 bg-gray-300 rounded animate-pulse" />
										</td>
									)
								)}

								{/* Action buttons */}
								{actionTypes.length > 0 && (
									<td className="px-2 py-2 whitespace-nowrap">
										<div className="flex gap-3">
											{actionTypes.map((_, i) => (
												<div
													key={i}
													className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"
												/>
											))}
										</div>
									</td>
								)}
							</tr>
						))
					) : data?.length === 0 ? (
						// --- Show "No Data Found" ---
						<tr>
							{/* Span across all columns + Sr.No + Actions */}
							<td
								colSpan={
									headers.length +
									(actionTypes.length > 0 ? 2 : 1)
								}
								className="text-center py-10">
								<div className="text-center my-10 text-2xl text-gray-600 flex items-center justify-center flex-col gap-2">
									<FileX size={40} strokeWidth={1.5} />
									<h2 className="text-2xl">No Data Found</h2>
								</div>
							</td>
						</tr>
					) : (
						// --- Show Actual Data ---
						data?.map((row, rowIndex) => (
							<tr key={rowIndex}>
								<td className={`sticky left-0 z-10 px-4 py-2 font-semibold text-black shadow-md ${headersBg}`}>
									{(currentPage - 1) * docsPerPage +
										rowIndex +
										1}
								</td>
								{keys?.map((key, colIndex) => {
									const cellValue = getValueFromPath(row, key);
									const renderer = columnRenderers[key];
									return (
										<td
											key={colIndex}
											className={`px-4 py-2 text-gray-600 ${columnStyles[key] ??
												"whitespace-nowrap"
												}`}>
											{renderer
												? renderer(cellValue, row)
												: cellValue !== undefined &&
													cellValue !== null &&
													cellValue !== ""
													? cellValue
													: "-"}
										</td>
									);
								})}
								{actionTypes.length > 0 && (
									<td
										className="px-4 py-2 whitespace-nowrap"
										data-index={rowIndex}>
										<div className="flex gap-3">
											{actionTypes.includes("view") && (
												<button
													data-action="view"
													className="duration-200 scale-100 hover:scale-125 hover:cursor-pointer ease-in-out">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="#44BCFF"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="lucide lucide-eye-icon lucide-eye">
														<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
														<circle
															cx="12"
															cy="12"
															r="3"
														/>
													</svg>
												</button>
											)}
											{actionTypes.includes("edit") && (
												<button
													data-action="edit"
													className="duration-200 scale-100 hover:scale-125 hover:cursor-pointer ease-in-out">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="21"
														height="21"
														viewBox="0 0 24 24"
														fill="none"
														stroke="#f0b101"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="lucide lucide-square-pen-icon lucide-square-pen">
														<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
														<path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
													</svg>
												</button>
											)}
											{actionTypes.includes("delete") && (
												<button
													data-action="delete"
													className="duration-200 scale-100 hover:scale-125 hover:cursor-pointer ease-in-out">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="21"
														height="21"
														viewBox="0 0 24 24"
														fill="none"
														stroke="#fb2c36"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="lucide lucide-trash2-icon lucide-trash-2">
														<path d="M3 6h18" />
														<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
														<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
														<line
															x1="10"
															x2="10"
															y1="11"
															y2="17"
														/>
														<line
															x1="14"
															x2="14"
															y1="11"
															y2="17"
														/>
													</svg>
												</button>
											)}
										</div>
									</td>
								)}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
