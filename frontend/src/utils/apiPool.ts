export const apiPool = {
	userApi: {
		login: { path: "/auth/login", method: "POST" },
		signup: { path: '/auth/signup', method: "POST" }
	},
	storeApi: {
		getAllStores: { path: "/stores", method: "GET" },
		getStore: { path: "/stores/:id", method: "GET" },
		addStore: { path: "/stores/", method: "POST" },
		deleteStore: { path: "/stores/delete", method: "DELETE" },
	},
	ratingApi: {
		getRatingsForStore: { path: "/ratings/store/:storeId", method: "GET" },
		addRating: { path: "/ratings/store/:storeId", method: "POST" },
		deleteRating: { path: "/ratings/:id", method: "DELETE" },
	},
	adminApi: {
		getDashboard: { path: "/admin/dashboard", method: "GET" },
		createUser: { path: "/admin/users", method: "POST" },
		getAllUsers: { path: "/admin/users", method: "GET" },
		getUserDetail: { path: "/admin/users/:id", method: "GET" },
		createStore: { path: "/admin/stores", method: "POST" },
		getAllStoresAdmin: { path: "/admin/stores", method: "GET" },
	},
	ownerApi: {
		getOwnerDashboard: { path: "/owner/dashboard", method: "GET" },
	}

} as const;
