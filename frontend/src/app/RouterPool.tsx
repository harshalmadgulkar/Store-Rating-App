import { createBrowserRouter } from "react-router";

import DashLayout from "@app/DashLayout";
import Dashboard from "@/features/dashboard/index";
import Login from "@/features/auth";
import ErrorBoundry from "./ErrorBoundry";
import RouteProtector from "./RouteProtector";
import Signup from "@/features/auth/Signup";

import Profile from "@app/Profile";
import Store from "@features/stores";
import Users from "@/features/users";

const RouterPool = createBrowserRouter([
	{
		index: true,
		path: "/",
		element: (
			<>
				<Login />
			</>
		),
		errorElement: <ErrorBoundry />,
	},
	{
		path: "/signup",
		element: (
			<>
				<Signup />
			</>
		),
	},
	{
		path: "/dashboard",
		element: (
			<RouteProtector requireRole={[
				"ADMIN",
				"STORE_OWNER",
				"USER",
			]}>
				<DashLayout />
			</RouteProtector>
		),
		children: [
			{
				index: true,
				element: (
					<RouteProtector
						requireRole={[
							"ADMIN",
							"STORE_OWNER",
							"USER",
						]}>
						<Dashboard />
					</RouteProtector>
				),
			},
			{
				path: "profile",
				element: (
					<RouteProtector
						requireRole={[
							"ADMIN",
							"STORE_OWNER",
							"USER",
						]}>
						<Profile />
					</RouteProtector>
				),
			},
			{
				path: "stores",
				children: [
					{
						index: true,
						element: (
							<RouteProtector requireRole={["ADMIN", "STORE_OWNER", "USER"]}>
								<Store />
							</RouteProtector>
						)
					},
				]
			},
			{
				path: "users",
				children: [
					{
						index: true,
						element: (
							<RouteProtector requireRole={["ADMIN", "STORE_OWNER"]}>
								<Users />
							</RouteProtector>
						)
					},
				]
			},
		],
	},

]);

export default RouterPool;
