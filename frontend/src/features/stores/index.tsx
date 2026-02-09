import FloatingInput from "@components/FloatingInput";
import { useEffect, useState } from "react";
import useApiCall from "@hooks/useApiCall.tsx";
import { apiPool } from "@utils/apiPool";
import Modal from "@components/Modal";
import { toast } from "sonner";
import Table from "@components/Table";
import { Send, Star, Store } from "lucide-react";
import useDebounce from "@hooks/useDebounce";
import { useAppSelector } from "@/app/hooks";
import FloatingSelect, { getOptionFromValue, OptionType } from "@/components/FloatingSelect";
import DotsLoader from "@/components/DotsLoader";
import StarRating from "@/components/StarRating";

const Stores = () => {
	const profile = useAppSelector(state => state?.auth?.user?.user);
	const isAdmin = profile?.role === 'ADMIN';
	const { apiCall } = useApiCall();
	const { storeApi, adminApi, ratingApi } = apiPool;

	const [loader, setLoader] = useState<boolean>(false);
	const [submitLoader, setSubmitLoader] = useState(false);

	const [apiData, setApiData] = useState([]);
	console.log(apiData);

	const [selectedStore, setSelectedStore] = useState();
	const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
	const [ratingValue, setRatingValue] = useState<number>(0);

	const [storeOwnerList, setStoreOwnerList] = useState<OptionType[]>([]);
	const [storeName, setStoreName] = useState<string>();
	const debouncedSearchTerm = useDebounce(storeName, 800);

	const initialFormData: Record<string, any> = {
		storeName: "",
		storeEmail: "",
		storeAddress: "",
		ownerId: ""
	};

	const [showAddStore, setShowAddStore] = useState<boolean>(false);
	const [formData, setFormData] = useState<Record<string, any>>(initialFormData);
	const [error, setError] = useState<Record<string, string | null>>({});

	useEffect(() => {
		fetchData();
	}, [debouncedSearchTerm]);

	useEffect(() => {
		if (isAdmin) {
			getStoreOwnerList();
		}
	}, []);

	const fetchData = async () => {
		setLoader(true);

		const payload = {
			name: storeName,
		};
		const response = await apiCall({
			endpoint: storeApi.getAllStores.path,
			method: storeApi.getAllStores.method,
			payload,
		});
		setApiData(response);
		setLoader(false);
	};

	const getStoreOwnerList = async () => {
		try {
			const response = await apiCall({
				endpoint: adminApi.getAllUsers.path,
				method: adminApi.getAllUsers.method,
				queryParams: { role: 'STORE_OWNER' }
			});
			const formatted = response.map((item: any) => ({
				label: item.name,
				value: item._id,
			}));
			setStoreOwnerList(formatted);

		} catch (error) {
			console.log("User fetch error:", error);
		}
	};

	const closeRatingModal = () => {
		setShowRatingModal(false);
	};

	const closeAddStore = () => {
		setShowAddStore(false);
	};

	const handleChange = (key: keyof typeof formData, value: any) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const validateForm = () => {
		const errors: Record<string, string> = {};

		if (!formData.storeName.trim()) {
			errors.storeName = "Name is required";
		}

		if (!formData.storeEmail) {
			errors.storeEmail = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.storeEmail)) {
			errors.storeEmail = "Invalid email format";
		}

		if (!formData.storeAddress.trim()) {
			errors.storeAddress = "Address is required";
		}
		if (formData.storeAddress && formData.storeAddress.length > 400) {
			errors.storeAddress = "Address cannot exceed 400 characters";
		}

		if (!formData.ownerId) {
			errors.ownerId = "Owner is required";
		}

		setError(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmitStore = async () => {
		if (!validateForm()) return;

		setSubmitLoader(true);

		try {
			await apiCall({
				endpoint: adminApi?.createStore?.path,
				method: adminApi?.createStore?.method,
				payload: {
					name: formData?.storeName,
					email: formData?.storeEmail,
					address: formData?.storeAddress,
					ownerId: formData?.ownerId
				},
			});
			toast.success('Store added for selected owner.');
			closeAddStore();
		} catch (error) {
			console.error('Error:', error);
			toast.error('Something went wrong !');
		}
		finally {
			setSubmitLoader(false);
		}
	};

	const handleSubmitRating = async () => {

		setSubmitLoader(true);

		try {
			await apiCall({
				endpoint: ratingApi?.addRating?.path,
				method: ratingApi?.addRating?.method,
				payload: { rating: ratingValue },
				routeParams: { storeId: selectedStore?._id }
			});
			toast.success('Rating submitted for selected store.');
			closeRatingModal();
			fetchData();
		} catch (error) {
			console.error('Error:', error);
			toast.error('Something went wrong !');
		}
		finally {
			setSubmitLoader(false);
		}
	};

	const handleActionClick = (
		action: string,
		rowData: Record<string, any>
	) => {
		if (action == "edit") {
			setSelectedStore(rowData);
			setShowRatingModal(true);
		}
	};

	return (
		<div>
			<div className="flex flex-row justify-between items-center flex-wrap">
				<h1 className="OutletTitle mb-2">Store Details </h1>
				{profile.role === "ADMIN" ?
					<button className="btn-primary"
						onClick={() => setShowAddStore(true)}>
						<span className="flex gap-1 items-center">
							<Store size={15} />
							Add Store
						</span>
					</button>
					: null
				}
			</div>

			<div className="flex justify-between items-center my-4 flex-col md:flex-row ">
				<div className="flex flex-col md:flex-row gap-6 items-center md:w-2/5 w-full">
					<div className="w-full md:w-1/2">
						<FloatingInput
							label="Store Name"
							type="text"
							value={storeName}
							onChange={(val) => setStoreName(val)}
						/>
					</div>
				</div>
			</div>

			<div>
				<Table
					loading={loader}
					skeletonRows={10}
					headers={[
						"Store Name",
						"Store Email",
						"Avg Rating",
						"Store Address",
						"Owner Name",
						"Owner Email",
						...(!isAdmin ? ["My Rating"] : []),
					]}
					keys={[
						"name",
						"email",
						"overallRating",
						"address",
						"owner.name",
						"owner.email",
						...(!isAdmin ? ["myRating"] : [])
					]}
					data={apiData}
					actionTypes={
						profile.role === "USER"
							? ["edit"]
							: []
					}
					onActionClick={handleActionClick}
					columnStyles={{
						name: "break-words max-w-[400px]",
					}}
					columnRenderers={{
						myRating: (val) => (
							<div>
								{val ? (<p className="flex items-center gap-1">{val}<Star size={15} /></p>)
									:
									"-"}
							</div>
						)
					}}
				/>
			</div>

			{showRatingModal && (
				<Modal
					titleIcon={<Store size={18} strokeWidth={2.3} />}
					title="Submit Rating"
					size="sm"
					onClose={closeRatingModal}>

					<div>
						<div className='flex flex-wrap items-center gap-4 w-full mt-5'>
							Store Name: <span className="font-bold">{selectedStore?.name}</span>
						</div>
						<div className='flex flex-wrap items-center gap-4 w-full mt-5'>
							<StarRating
								value={ratingValue}
								onChange={(val) => setRatingValue(val)}
							/>
						</div>

						<div className="flex justify-end mt-6 ">
							{submitLoader ?
								<button className="btn-primary">
									<DotsLoader size="sm" />
								</button>
								:
								<button className="btn-primary" onClick={handleSubmitRating}>
									<Send size={14} />Submit
								</button>
							}
						</div>
					</div>
				</Modal>
			)}

			{showAddStore && (
				<Modal
					titleIcon={<Store size={18} strokeWidth={2.3} />}
					title="Add New Store"
					size="sm"
					onClose={closeAddStore}>

					<div>
						<div className='flex flex-wrap items-center gap-4 w-full mt-5'>
							<div className="w-full">
								<FloatingInput
									label="Store Name"
									type="text"
									value={formData.storeName}
									required
									onChange={(val) => handleChange("storeName", val)}
									error={error.storeName}
								/>
							</div>
							<div className="w-full">
								<FloatingInput
									label="Store Email"
									type="email"
									value={formData.storeEmail}
									required
									onChange={(val) => handleChange("storeEmail", val)}
									error={error.storeEmail}
								/>
							</div>
							<div className="w-full">
								<FloatingInput
									label="Store Address"
									type="text"
									value={formData.storeAddress}
									required
									onChange={(val) => handleChange("storeAddress", val)}
									error={error.storeAddress}
								/>
							</div>
							<div className="w-full">
								<FloatingSelect
									label="Select Owner"
									value={getOptionFromValue(formData.ownerId, storeOwnerList)}
									options={storeOwnerList}
									required
									onChange={(val) => handleChange("ownerId", val?.value)}
									error={error.ownerId}
								/>
							</div>
						</div>

						<div className="flex justify-end mt-6 ">
							{submitLoader ?
								<button className="btn-primary">
									<DotsLoader size="sm" />
								</button>
								:
								<button className="btn-primary" onClick={handleSubmitStore}>
									<Send size={14} />Submit
								</button>
							}
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default Stores;
