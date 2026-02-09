import React, { useState, useEffect } from "react";
import { LucideIcon, Store, User, Star } from "lucide-react";
import useApiCall from "@/hooks/useApiCall";
import { apiPool } from "@/utils/apiPool";
import DotsLoader from "@/components/DotsLoader";
import { useAppSelector } from "@/app/hooks";
import Table from "@/components/Table";
import { toast } from "sonner";

const Dashboard = () => {
	const { apiCall } = useApiCall();
	const { adminApi, ownerApi, ratingApi } = apiPool;

	const { user } = useAppSelector((state) => state.auth);
	const isAdmin = user?.user?.role === "ADMIN";
	const isStoreOwner = user?.user?.role === "STORE_OWNER";

	const [loader, setLoader] = useState<boolean>(false);

	interface DashboardStats {
		totalUsers: number;
		totalStores: number;
		totalRatings: number;
		averageRating: number;
	}

	const [totalCounts, setTotalCounts] = useState<DashboardStats>({
		totalUsers: 0,
		totalStores: 0,
		totalRatings: 0,
		averageRating: 0
	});

	useEffect(() => {
		getTotalCounts();
	}, []);

	const getTotalCounts = async () => {
		setLoader(true);
		try {
			if (isAdmin) {
				const response = await apiCall({
					endpoint: adminApi?.getDashboard?.path,
					method: adminApi?.getDashboard?.method,
				});
				setTotalCounts(response);
			} else if (isStoreOwner) {
				const response = await apiCall({
					endpoint: ownerApi?.getOwnerDashboard?.path,
					method: ownerApi?.getOwnerDashboard?.method,
				});
				setTotalCounts(response);
			}
		} catch (Err) {
			console.log("Err while getting dashboard total counts", Err);
		} finally {
			setLoader(false);
		}
	};

	interface StatCardProps {
		title: string;
		value: number;
		icon: LucideIcon; // Use LucideIcon type for the icon component
		description: string;
		gradientClass: string;
	}

	const StatCard: React.FC<StatCardProps> = ({
		title,
		value,
		icon: Icon,
		description,
		gradientClass,
	}) => (
		<div className={`relative p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 overflow-hidden ${gradientClass} text-white flex flex-col justify-between cursor-pointer`}>

			<div className="absolute inset-0 bg-black opacity-10 rounded-xl"></div>

			<div className="absolute top-4 right-4 bg-white/20 p-3 rounded-full">
				<Icon size={20} strokeWidth={1.8} />
			</div>

			<div className="relative z-10 flex flex-col">
				<h3 className="text-xl font-bold mb-2 leading-tight">
					{title}
				</h3>
				{loader ? (
					<span className="my-4">
						<DotsLoader size="md" />
					</span>
				) : (
					<p className="text-3xl font-extrabold mb-2">{value}</p>
				)}
				<p className="text-sm opacity-80">{description}</p>
			</div>
		</div>
	);


	return (
		<div>
			<div className="mx-auto">
				<h1 className="text-3xl font-extrabold text-gray-900 mb-8 ">
					Dashboard
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{isStoreOwner && (
						<StatCard
							title="Average rating store"
							value={totalCounts?.averageRating}
							icon={Star}
							description="Across all regions"
							gradientClass="bg-gradient-to-br from-blue-500 to-blue-700"
						/>
					)}

					{isAdmin && (
						<StatCard
							title="Total number of users"
							value={totalCounts?.totalUsers}
							icon={User}
							description="Including Admin & Store Owner"
							gradientClass="bg-gradient-to-br from-green-500 to-green-700"
						/>
					)}

					{isAdmin && (
						<StatCard
							title="Total number of stores"
							value={totalCounts?.totalStores}
							icon={Store}
							description=""
							gradientClass="bg-gradient-to-br from-red-500 to-red-700"
						/>
					)}

					{isAdmin && (
						<StatCard
							title="Total number of submitted ratings"
							value={totalCounts?.totalRatings}
							icon={Star}
							description=""
							gradientClass="bg-gradient-to-br from-yellow-500 to-yellow-700"
						/>
					)}

				</div>

				{isStoreOwner && (
					<div className="mt-12 bg-white rounded-xl shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-800 mb-1">
							All Submitted ratings
						</h2>
						<Table
							loading={loader}
							skeletonRows={10}
							// maxHeight="40vh"
							headers={[
								"Name",
								"Rating",
							]}
							headersBg="bg-white"
							keys={[
								"user.name",
								"rating"
							]}
							data={totalCounts?.ratings}
							columnStyles={{
								name: "break-words max-w-[400px]",
							}}
							columnRenderers={{}}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
