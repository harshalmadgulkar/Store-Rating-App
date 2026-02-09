import FloatingInput from "@components/FloatingInput";
import { useEffect, useState } from "react";
import useApiCall from "@hooks/useApiCall.tsx";
import { apiPool } from "@utils/apiPool";
import Modal from "@components/Modal";
import { toast } from "sonner";
import Table from "@components/Table";
import { Loader, Send, UserPlus } from "lucide-react";
import useDebounce from "@hooks/useDebounce";
import { useAppSelector } from "@/app/hooks";
import FloatingSelect, { getOptionFromValue, OptionType } from "@/components/FloatingSelect";
import DotsLoader from "@/components/DotsLoader";

// types/user.ts  (recommended to put in a shared types folder)
export interface User {
	_id: string;
	name: string;
	email: string;
	address?: string;
	role: 'ADMIN' | 'USER' | 'STORE_OWNER';
	createdAt?: string;
	updatedAt?: string;
	// optional: if backend returns it for store owners
	storeRating?: number | string;
}

const Users = () => {
	const profile = useAppSelector(state => state?.auth?.user?.user);
	const { apiCall } = useApiCall();
	const { adminApi } = apiPool;

	const [loader, setLoader] = useState<boolean>(false);
	const [submitLoader, setSubmitLoader] = useState(false);

	const [users, setUsers] = useState<User[]>([]);
	const [storeName, setStoreName] = useState<string>();
	const debouncedSearchTerm = useDebounce(storeName, 800);

	const initialFormData: Record<string, any> = {
		name: "",
		email: "",
		password: "",
		address: "",
		role: ""
	};

	const [showAddStore, setShowAddStore] = useState<boolean>(false);
	const [formData, setFormData] = useState<Record<string, any>>(initialFormData);
	const [error, setError] = useState<Record<string, string | null>>({});

	useEffect(() => {
		fetchUsers();
	}, [debouncedSearchTerm]);

	const RoleList: OptionType[] = [
		{ label: "Admin", value: "ADMIN" },
		{ label: "User", value: "USER" },
		{ label: "Store Owner", value: "STORE_OWNER" },
	];

	const fetchUsers = async () => {
		setLoader(true);
		try {
			const res = await apiCall({
				endpoint: adminApi.getAllUsers.path,
				method: adminApi.getAllUsers.method,
			});

			if (res) {
				setUsers(res || []);
			} else {
				toast.error(res?.message || "Failed to load users");
			}
		} catch (err: any) {
			toast.error(err.message || "Network error");
		} finally {
			setLoader(false);
		}
	};

	const closeAddUser = () => {
		setShowAddStore(false);
	};

	const handleChange = (key: keyof typeof formData, value: any) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const validateForm = () => {
		const errors: Record<string, string> = {};

		if (!formData.name.trim()) {
			errors.name = "Name is required";
		} else if (formData.name.length < 20 || formData.name.length > 60) {
			errors.name = "Name must be 20–60 characters";
		}

		if (!formData.email) {
			errors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = "Invalid email format";
		}

		if (!formData.password) {
			errors.password = "Password is required";
		} else if (formData.password.length < 8 || formData.password.length > 16) {
			errors.password = "Password must be 8–16 characters";
		} else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
			errors.password = "Must contain uppercase & special character";
		}

		if (!formData.address.trim()) {
			errors.address = "Address is required";
		}
		if (formData.address && formData.address.length > 400) {
			errors.address = "Address cannot exceed 400 characters";
		}

		if (!formData.role) {
			errors.role = "Role is required";
		}

		setError(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmitUser = async () => {
		if (!validateForm()) return;

		setSubmitLoader(true);

		try {
			await apiCall({
				endpoint: adminApi?.createUser?.path,
				method: adminApi?.createUser?.method,
				payload: formData,
			});
			toast.success('User added successfully.');
			closeAddUser();
			fetchUsers();
		} catch (error) {
			console.error('Error', error);
			toast.error("Something went wrong !");
		}
		finally {
			setSubmitLoader(false);
		}
	};

	return (
		<div>
			<div className="flex flex-row justify-between items-center flex-wrap">
				<h1 className="OutletTitle mb-2">User Details </h1>
				{profile.role === "ADMIN" ?
					<button className="btn-primary"
						onClick={() => setShowAddStore(true)}>
						<span className="flex gap-1 items-center">
							<UserPlus size={15} />
							Add User
						</span>
					</button>
					: null
				}
			</div>

			<div className="flex justify-between items-center my-4 flex-col md:flex-row ">
				<div className="flex flex-col md:flex-row gap-6 items-center md:w-2/5 w-full">
					<div className="w-full md:w-1/2">
						<FloatingInput
							label="User Name"
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
						"Name",
						"Email",
						"Address",
						"Role",
					]}
					keys={[
						"name",
						"email",
						"address",
						"role",
					]}
					data={users}
					// actionTypes={
					// 	profile.role === "ADMIN"
					// 		? ["view", "edit"]
					// 		: ["view", "edit", "delete"]
					// }
					// onActionClick={handleActionClick}
					columnStyles={{
						name: "break-words max-w-[400px]",
					}}
					columnRenderers={{
						role: (val) => (
							<div>
								{val === "USER" ? 'User'
									: val === "STORE_OWNER" ? 'Store Owner'
										: val === "ADMIN" ? 'Admin' : null}
							</div>)
					}}
				/>
			</div>

			{
				showAddStore && (
					<Modal
						titleIcon={<UserPlus size={18} strokeWidth={2.3} />}
						title="Add New User"
						size="sm"
						onClose={closeAddUser}>

						<div>
							<div className='flex flex-wrap items-center gap-4 w-full mt-5'>
								<div className="w-full">
									<FloatingInput
										label="Name"
										type="text"
										required
										value={formData.name}
										onChange={(val) => handleChange("name", val)}
										error={error.name}
									/>
								</div>
								<div className="w-full">
									<FloatingInput
										label="Email"
										type="email"
										required
										value={formData.email}
										onChange={(val) => handleChange("email", val)}
										error={error.email}
									/>
								</div>
								<div className="w-full">
									<FloatingInput
										label="Password"
										type="password"
										required
										value={formData.password}
										onChange={(val) => handleChange("password", val)}
										error={error.password}
									/>
								</div>
								<div className="w-full">
									<FloatingInput
										label="Address"
										type="text"
										required
										value={formData.address}
										onChange={(val) => handleChange("address", val)}
										error={error.address}
									/>
								</div>
								<div className="w-full">
									<FloatingSelect
										label="Role"
										required
										value={getOptionFromValue(formData.role, RoleList)}
										options={RoleList}
										onChange={(val) => handleChange("role", val?.value)}
										error={error.role}
									/>
								</div>
							</div>

							<div className="flex justify-end mt-6 ">
								{submitLoader ?
									<button className="btn-primary">
										<DotsLoader size="sm" />
									</button>
									:
									<button className="btn-primary" onClick={handleSubmitUser}>
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

export default Users;
