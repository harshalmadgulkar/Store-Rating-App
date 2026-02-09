import React, {
	useState,
	useRef,
	useEffect,
	useId,
	useLayoutEffect,
} from "react";

export type OptionType = {
	label: string;
	value: string | number | boolean;
};

interface CustomSelectProps {
	label: string;
	options: OptionType[];
	value: OptionType | OptionType[] | null | "" | undefined;
	onChange: (value: OptionType | OptionType[] | null | "") => void;
	multiple?: boolean;
	isSearchable?: boolean;
	isReset?: boolean;
	bgPrimary?: string;
	error?: string | null;
	disabled?: boolean;
	required?: boolean;
}

export const getOptionFromValue = (
	input: string | number | boolean | (string | number | boolean)[] | null | undefined,
	options: OptionType[]
): OptionType | OptionType[] | null => {
	if (input === null || input === undefined || !options || options.length === 0) {
		return null;
	}

	if (Array.isArray(input)) {
		const selectedOptions: OptionType[] = [];
		input.forEach(item => {
			const foundOption = options.find(option =>
				option.value === item || option.label === item
			);
			if (foundOption) {
				selectedOptions.push(foundOption);
			}
		});
		return selectedOptions;
	} else {
		const foundOption = options.find(option =>
			option.value === input || option.label === input
		);
		return foundOption || null;
	}
};


const FloatingSelect: React.FC<CustomSelectProps> = ({
	label,
	options,
	value,
	onChange,
	multiple = false,
	isSearchable = false,
	isReset = false,
	bgPrimary = "#C4C4C4",
	error = "",
	disabled = false,
	required = false
}) => {
	const safeSelectedValue = multiple
		? Array.isArray(value) ? value : []
		: value ?? null;

	const selectedValue = safeSelectedValue;

	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");

	// REMOVED: dropdownPosition state
	const selectBoxRef = useRef<HTMLDivElement | null>(null);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const selectId = useId();

	const filteredOptions = options.filter((option) =>
		option?.label?.toLowerCase().includes(search.toLowerCase())
	);

	const handleSelectClick = () => { if (!disabled) setIsOpen((prev) => !prev); };

	const isSelected = (option: OptionType): boolean => {
		if (multiple) {
			return Array.isArray(selectedValue) && selectedValue.some(
				(item) => item.value === option.value
			);
		} else {
			return (selectedValue as OptionType | null)?.value === option.value;
		}
	};

	const handleOptionClick = (option: OptionType) => {
		if (multiple) {
			const current = Array.isArray(selectedValue) ? selectedValue : [];
			const exists = current.some((item) => item.value === option.value);

			const next = exists
				? current.filter((item) => item.value !== option.value)
				: [...current, option];

			onChange(next.length ? next : "");
		} else {
			onChange(
				isSelected(option)
					? null
					: option
			);
			setIsOpen(false);
			setSearch("");
		}
	};

	const handleRemoveOption = (option: OptionType) => {
		if (multiple) {
			const current = Array.isArray(selectedValue) ? selectedValue : [];
			const next = current.filter((item) => item.value !== option.value);
			onChange(next.length ? next : "");
		} else {
			onChange(null);
			setIsOpen(false);
		}
	};

	/* ------------- Outside click ------------ */
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				!selectBoxRef.current?.contains(event.target as Node) &&
				!dropdownRef.current?.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	/* ---------- Dropdown position ---------------- */
	useLayoutEffect(() => {
		if (isOpen && selectBoxRef.current && dropdownRef.current) {

			const rect = selectBoxRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			const dropdownHeight = Math.min(dropdownRef.current.offsetHeight, 200);

			if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
				dropdownRef.current.style.top = 'auto';
				dropdownRef.current.style.bottom = '100%';
			} else {
				dropdownRef.current.style.top = '100%';
				dropdownRef.current.style.bottom = 'auto';
			}

			dropdownRef.current.style.left = '0';
			dropdownRef.current.style.width = '100%';
		}
	}, [isOpen, selectedValue, filteredOptions]);

	return (
		<div className={`relative w-full ${disabled ? 'opacity-70' : ''}`}>
			<div ref={selectBoxRef} className={`relative w-full h-full scroll-mt-2 `} >
				<div
					onClick={handleSelectClick}
					className={`block px-3 pb-2 pt-3 w-full text-sm text-black bg-transparent rounded-lg border
                    ${isOpen ? "border-blue-600" : "border-gray-400"} appearance-none focus:outline-none
                    peer transition-all flex justify-between items-center ${error && "border-red-600"
						} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer '}`}>
					{multiple ? (
						Array.isArray(selectedValue) && selectedValue.length > 0 ? (
							<div className="flex flex-wrap gap-2 overflow-hidden max-w-[92%]">
								{(selectedValue as OptionType[]).map(
									(val, index) => (
										<div
											key={index}
											className="bg-blue-100 border border-gray-300 text-black rounded-md px-2 py-1 flex items-center max-w-full">
											<span className="max-w-[95%] text-xs text-start whitespace-pre-wrap break-words">
												{val.label}
											</span>
											<span
												onClick={(e) => {
													e.stopPropagation();
													handleRemoveOption(val);
												}}
												className="ml-2 cursor-pointer transform transition-all duration-200 scale-90 hover:scale-110">
												<svg
													width="11"
													height="11"
													viewBox="0 0 15 14"
													fill="none"
													xmlns="http://www.w3.org/2000/svg">
													<path
														d="M1.33716 13L13.3372 1M1.33716 1L13.3372 13"
														stroke="#6B7280"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</div>
									)
								)}
							</div>
						) : (
							<span className="invisible">empty</span>
						)
					) : selectedValue ? (
						<div className="flex items-center justify-between w-full ">
							<div className={`max-w-[92%] text-sm whitespace-pre-wrap break-words leading-tight text-start text-black`}>
								{(selectedValue as OptionType).label}
							</div>
							{isReset && (
								<span
									onClick={(e) => {
										e.stopPropagation();
										if (!disabled) { handleRemoveOption(selectedValue as OptionType); }
									}}
									className="transform transition-all duration-200 scale-100 hover:scale-125 hover:text-gray-900">
									<svg
										width="12"
										height="12"
										viewBox="0 0 15 14"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M1.33716 13L13.3372 1M1.33716 1L13.3372 13"
											stroke="#6B7280"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</span>
							)}
						</div>
					) : (
						<span className="invisible">empty</span>
					)}
					<span
						className={`select-none ml-2 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M19.5 8.25L12 15.75L4.5 8.25"
								stroke="#6B7280"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</span>
				</div>

				<label
					htmlFor={selectId}
					className={`select-none absolute text-sm duration-300 transform px-2 transition-all
                        pointer-events-none  whitespace-nowrap
                        ${isOpen || (multiple ? Array.isArray(selectedValue) && selectedValue.length > 0 : selectedValue)
							? "-top-2.5 left-1 text-blue-600 bg-gray-50"
							: "top-1/2 -translate-y-1/2 left-1 text-gray-500"
						}
                        ${!isOpen && (multiple
							? (Array.isArray(selectedValue) && selectedValue.length > 0) : selectedValue)
							? "scale-90 text-gray-500" : "scale-100 mx-1"
						}`}>

					{required && <span className="text-red-600">* </span>}{label}
				</label>

				{isOpen && (
					<div
						ref={dropdownRef}
						className="absolute left-0 z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-auto">
						{isSearchable && (
							<div className="p-2">
								<input
									type="text"
									value={search}
									onChange={(e) =>
										setSearch(e.target.value)
									}
									placeholder="Search..."
									className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-600"
								/>
							</div>
						)}
						<div
							className="max-h-60 overflow-y-auto"
							style={{
								scrollbarColor: `${bgPrimary} transparent`,
								scrollbarWidth: "thin",
							}}>
							{filteredOptions.length > 0 ? (
								filteredOptions.map((option, index) => (
									<div
										key={index}
										onClick={() => handleOptionClick(option)}
										className={`text-sm cursor-pointer px-4 py-2 transition-all whitespace-pre-wrap break-words
                                        ${multiple ? (selectedValue as OptionType[])?.some((item) => item.value === option.value)
												? "bg-blue-200" : "hover:bg-blue-100"
												: (selectedValue as OptionType)?.value === option.value ? "bg-blue-200" : "hover:bg-blue-100"}`}>
										{option.label}
									</div>
								))
							) : (
								<div className="px-4 py-2 text-gray-500">
									No options available
								</div>
							)}
						</div>
					</div>
				)}
			</div>
			{/* {error && <p className="mt-1 ms-1 text-xs text-red-500 errorClass absolute">{error}</p>} */}
			{error && <p className="ms-1 text-xs text-red-500 errorClass mt-1">{error}</p>}
		</div>
	);
};

export default FloatingSelect;