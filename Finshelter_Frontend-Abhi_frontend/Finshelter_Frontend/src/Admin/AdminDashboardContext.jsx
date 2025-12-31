// import React, { createContext, useState, useEffect, useMemo } from "react";
// import axios from "./utils/axiosConfig";
// import { useNavigate } from "react-router-dom";
// import ClipLoader from "react-spinners/ClipLoader";
// import { useNotification } from "../NotificationContext";
// import { useRef } from "react";
// const AdminDashboardContext = createContext();

// const AdminDashboardProvider = ({ children }) => {
// 	const [servicesCount, setServicesCount] = useState(0);
// 	const [usersCount, setUsersCount] = useState(0);
// 	const [managersCount, setManagersCount] = useState(0);
// 	const [employeesCount, setEmployeesCount] = useState(0);
// 	const [customersCount, setCustomersCount] = useState(0);
// 	const [userGrowthData, setUserGrowthData] = useState([]);
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState(null);
// 	const [services, setServices] = useState([]);
// 	const [users, setUsers] = useState([]);
// 	const [messages, setMessages] = useState([]);
// 	const [orders, setOrders] = useState([]);
// 	const [leads, setLeads] = useState([]);
// 	// const [loading, setLoading] = useState(false);

// 	const [assignOrder, setAssignOrder] = useState({
// 		orderId: "",
// 		employeeId: "",
// 	});
// 	const [showAssignOrderForm, setShowAssignOrderForm] = useState(false);

// 	const { showNotification, setCurrentPage } = useNotification();
// 	const formatDate = (dateStr) => {
// 		const date = new Date(dateStr);
// 		const options = { day: "2-digit", month: "short", year: "numeric" };
// 		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
// 	};

// 	useEffect(() => {
// 		setCurrentPage("admin");
// 	}, [setCurrentPage]);
	
// 	//login
// 	const [isAuthenticated, setIsAuthenticated] = useState(false);
// 	const [selectedOrderPosition, setSelectedOrderPosition] = useState(null);

// 	// Check for existing token on mount
// 	useEffect(() => {
// 		const token = localStorage.getItem("adminToken");
// 		if (token) {
// 			setIsAuthenticated(true);
// 		}
// 	}, []);

// 	const [newService, setNewService] = useState({
// 		category: "",
// 		name: "",
// 		description: "",
// 		hsncode: "",
// 		currency: "INR",
// 		packages: [],
// 		requiredDocuments: [],
// 	});

// 	const [newEmployee, setNewEmployee] = useState({
// 		name: "",
// 		email: "",
// 		services: [],
// 		username: "",
// 		password: "",
// 		Lminus1code: "",
// 		L1EmpCode: "",
// 		designation: "",
// 	});
// 	const [newManager, setNewManager] = useState({
// 		name: "",
// 		email: "",
// 		role: "",
// 		serviceId: "",
// 		username: "",
// 		password: "",
// 	});
// 	const [newUser, setNewUser] = useState({
// 		role: "",
// 		name: "",
// 		email: "",
// 		serviceId: "",
// 		username: "",
// 		password: "",
// 	});
// 	const [assignCustomer, setAssignCustomer] = useState({
// 		customerId: "",
// 		employeeId: "",
// 	});
// 	//assign employee
// 	const [assignEmployee, setAssignEmployee] = useState({
// 		employeeId: "",
// 		managerId: "",
// 	});
// 	const [assignService, setAssignService] = useState({
// 		customerId: "",
// 		serviceId: "",
// 		employeeId: "",
// 	});
// 	const [showUserForm, setShowUserForm] = useState(false);
// 	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
// 	// const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);
// 	// Fetch Dashboard Data
// 	const isInitialLoad = useRef(true);

// 	useEffect(() => {
// 		console.log("Fetching dashboard data...");
// 		fetchDashboardData();
// 		fetchAllOrders();
// 	}, []);

// 	// Function to process user growth data based on creation dates
// 	const processUserGrowthData = (users) => {
// 		// Get the current date and go back 6 months
// 		const now = new Date();
// 		const months = [];
// 		const monthData = {};
		
// 		// Get the last 6 months (including current)
// 		for (let i = 0; i < 6; i++) {
// 			const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
// 			const monthName = monthDate.toLocaleString('default', { month: 'short' });
// 			const monthKey = `${monthName} ${monthDate.getFullYear()}`;
// 			months.unshift({ monthKey, monthDate });
// 			monthData[monthKey] = 0;
// 		}
		
// 		// Sort users by creation date
// 		const sortedUsers = [...users].sort((a, b) => 
// 			new Date(a.createdAt) - new Date(b.createdAt)
// 		);
		
// 		// Initialize with total users at the beginning of the period
// 		let runningTotal = sortedUsers.filter(user => 
// 			new Date(user.createdAt) < months[0].monthDate
// 		).length;
		
// 		// For each month, count users created in that month
// 		months.forEach(({ monthKey, monthDate }, index) => {
// 			const nextMonthDate = index < months.length - 1 
// 				? months[index + 1].monthDate 
// 				: new Date(now.getFullYear(), now.getMonth() + 1, 1);
			
// 			const newUsers = sortedUsers.filter(user => {
// 				const userDate = new Date(user.createdAt);
// 				return userDate >= monthDate && userDate < nextMonthDate;
// 			}).length;
			
// 			runningTotal += newUsers;
// 			monthData[monthKey] = runningTotal;
// 		});
		
// 		// Transform to array for the chart
// 		return months.map(({ monthKey }) => ({
// 			month: monthKey.split(' ')[0], // Only show month name in the chart
// 			users: monthData[monthKey]
// 		}));
// 	};

// 	const fetchDashboardData = async () => {
// 		try {
// 			const { data } = await axios.get(
// 				"http://localhost:8000/api/admin/dashboard"
// 			);
// 			// setLoading(true);
// 			console.log("admin data", data);
// 			const { services, users } = data;
// 			setServices(services);
// 			setUsers(users);

// 			setServicesCount(services.length);
// 			setUsersCount(users.length);
// 			// console.log("admin users", users);
// 			setEmployeesCount(
// 				users.filter((user) => user.role === "employee").length
// 			);
// 			setCustomersCount(
// 				users.filter((user) => user.role === "customer").length
// 			);
// 			setManagersCount(users.filter((user) => user.role === "manager").length);

// 			// Process user growth data
// 			const growthData = processUserGrowthData(users);
// 			setUserGrowthData(growthData);

// 			// Only show success notification on the first load
// 			if (isInitialLoad.current) {
// 			// showNotification(
// 			// 	"Admin Dashboard loaded successfully.",
// 			// 	"success",
// 			// 	"admin"
// 			// );

// 			}
// 		} catch (err) {
// 			console.error("Dashboard fetch error:", err);
// 			const errorMessage =
// 				err.response?.data?.message || "Failed to load dashboard data.";
// 			showNotification(errorMessage, "error");
// 			setError(errorMessage);

// 			if (err.response && err.response.status === 401) {
// 				setIsAuthenticated(false);
// 				localStorage.removeItem("adminToken");
// 				// Show notification and prevent automatic redirect for a session-expired error
// 				showNotification(
// 					"Session expired. Please log in again.",
// 					"error",
// 					"admin"
// 				);
// 				setError("Session expired. Please log in again.");
// 			}
// 		}
// 	};

// 	const resetError = () => {
// 		setError(null);
// 		setLoading(false);
// 	};

// 	//login
// 	const login = async (email, password) => {
// 		setLoading(true);
// 		try {
// 			// Send login request
// 			const response = await axios.post(
// 				"http://localhost:8000/api/admin/login",
// 				{
// 					email,
// 					password,
// 				}
// 			);
			
// 			// Store the token in localStorage
// 			if (response.data.token) {
// 				localStorage.setItem("adminToken", response.data.token);
// 			}
			
// 			setIsAuthenticated(true);
// 			await fetchDashboardData();
// 			return true; // Successful login
// 		} catch (err) {
// 			console.error("Login error:", err.response?.data?.message || err.message);
// 			showNotification("Login error", "error", "admin");
// 			return false; // Login failed
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const logout = () => {
// 		showNotification("Logged Out Successfully", "success");
// 		localStorage.removeItem("adminToken"); // Clear token on logout
// 		setIsAuthenticated(false); // Update authentication state
// 	};

// 	const handleCreateService = async () => {
// 		setLoading(true);
// 		const {
// 			category,
// 			name,
// 			description,
// 			hsncode,
// 			currency,
// 			packages,
// 			requiredDocuments,
// 		} = newService;

// 		// Basic validation
// 		if (!category || !name || !description || !hsncode) {
// 			showNotification("Please fill in all required service fields.", "error");
// 			setLoading(false);
// 			return;
// 		}

// 		// Packages are now optional
// 		// No validation needed for packages

// 		try {
// 			const { data } = await axios.post(
// 				"http://localhost:8000/api/admin/services",
// 				{
// 					category,
// 					name,
// 					description,
// 					hsncode,
// 					currency,
// 					packages,
// 					requiredDocuments,
// 				}
// 			);
// 			setServices((prevServices) => [...prevServices, data.service]);
// 			showNotification("Service created successfully", "success");
// 			setLoading(false);
// 			setServicesCount(services.length);
// 			fetchDashboardData();
// 			setNewService({
// 				category: "",
// 				name: "",
// 				description: "",
// 				hsncode: "",
// 				currency: "INR",
// 				packages: [],
// 				requiredDocuments: [],
// 			});
// 		} catch (err) {
// 			showNotification(
// 				err.response?.data?.message || "Error creating service.",
// 				"error",
// 				"admin"
// 			);
// 			setLoading(false);
// 		}
// 	};

// 	// Other functions follow the same error handling pattern
// 	const handleCreateManager = async () => {
// 		setLoading(true);
// 		const { name, email, username, password } = newManager;

// 		if (!name || !email || !username || !password) {
// 			showNotification("Please provide all fields.", "error");
// 			setLoading(false);
// 			return;
// 		}

// 		try {
// 			const response = await axios.post(
// 				"http://localhost:8000/api/admin/manager",
// 				{ name, email, role: "manager", username, password }
// 			);

// 			showNotification("Manager created successfully", "success");
// 			// Wait for the dashboard data to refresh
// 			// await fetchDashboardData();

// 			setLoading(false);
// 			fetchDashboardData();
// 			setNewManager({
// 				name: "",
// 				email: "",

// 				username: "",
// 				password: "",
// 			});
// 		} catch (err) {
// 			showNotification("Error creating manager.", "error");
// 			setLoading(false);
// 		}
// 	};

// 	const handleCreateEmployee = async () => {
// 		setLoading(true);
// 		const {
// 			name,
// 			email,
// 			services, // Changed from serviceId to services array
// 			username,
// 			password,
// 			Lminus1code,
// 			L1EmpCode,
// 			designation,
// 		} = newEmployee;

// 		// Validate required fields
// 		if (!name || !email || !username || !password) {
// 			showNotification(
// 				"Please provide all required fields: name, email, username, and password.",
// 				"error"
// 			);
// 			setLoading(false);
// 			return;
// 		}

// 		if (!services || !Array.isArray(services) || services.length === 0) {
// 			showNotification(
// 				"Please select at least one service for the employee.",
// 				"error"
// 			);
// 			setLoading(false);
// 			return;
// 		}

// 		// if (!L1EmpCode) {
// 		// 	showNotification("Please select an L+1 employee.", "error");
// 		// 	setLoading(false);
// 		// 	return;
// 		// }

// 		try {
// 			console.log("Creating employee with data:", {
// 				name,
// 				email,
// 				role: "employee",
// 				services,
// 				username,
// 				Lminus1code,
// 				L1EmpCode,
// 				designation,
// 			});

// 			const { data } = await axios.post(
// 				"http://localhost:8000/api/admin/employee",
// 				{
// 					name,
// 					email,
// 					role: "employee",
// 					services, // Send the array of service IDs
// 					username,
// 					password,
// 					Lminus1code,
// 					L1EmpCode,
// 					designation,
// 				}
// 			);

// 			console.log("Employee created successfully:", data);
// 			setUsers((prevUsers) => [...prevUsers, data.employee]);
// 			showNotification("Employee created successfully.", "success");
// 			setLoading(false);
// 			fetchDashboardData();

// 			// Reset form fields including the services array
// 			setNewEmployee({
// 				name: "",
// 				email: "",
// 				services: [],
// 				username: "",
// 				password: "",
// 				Lminus1code: "",
// 				L1EmpCode: "",
// 				designation: "",
// 			});
// 		} catch (err) {
// 			console.error("Error creating employee:", err);
// 			console.error("Error response:", err.response?.data);
// 			console.error("Full error object:", JSON.stringify({
// 				message: err.message,
// 				response: {
// 					status: err.response?.status,
// 					statusText: err.response?.statusText,
// 					data: err.response?.data
// 				}
// 			}, null, 2));
// 			const errorMessage =
// 				err.response?.data?.message || err.response?.data?.error || "Error creating employee: " + (err.message || "Unknown error");
// 			showNotification(errorMessage, "error");
// 			setLoading(false);
// 		}
// 	};

// 	const handleCreateUser = async () => {
// 		setLoading(true);
// 		const { name, email, role = "customer", username, password } = newUser;
// 		if (!name || !email || !username || !password) {
// 			showNotification("Please provide all fields.", "error");
// 			setLoading(false);
// 			return;
// 		}
// 		try {
// 			const response = await axios.post(
// 				"http://localhost:8000/api/admin/createUser",
// 				{ name, email, role: "customer", username, password }
// 			);
// 			setUsers((prevUsers) => [...prevUsers, response.data.user]);
// 			showNotification("User created successfully.", "success");
// 			setLoading(false);
// 			fetchDashboardData();
// 			setNewUser({
// 				name: "",
// 				email: "",
// 				username: "",
// 				role: "customer",

// 				password: "",
// 			});
// 		} catch (err) {
// 			showNotification("Error creating user.", "error");
// 			setLoading(false);
// 		}
// 	};

// 	const handleActivateUser = async (userId) => {
// 		setLoading(true);
// 		// Optimistically update the state
// 		setUsers((prevUsers) =>
// 			prevUsers.map((user) =>
// 				user._id === userId ? { ...user, isActive: true } : user
// 			)
// 		);

// 		try {
// 			await axios.put(
// 				`http://localhost:8000/api/admin/user/activate/${userId}`
// 			);
// 			showNotification("User activated successfully.", "success");
// 			setLoading(false);
// 			fetchDashboardData();
// 		} catch (err) {
// 			console.error("Error activating user:", err);
// 			// Revert state if the API call fails
// 			setUsers((prevUsers) =>
// 				prevUsers.map((user) =>
// 					user._id === userId ? { ...user, isActive: false } : user
// 				)
// 			);

// 			showNotification(
// 				"Failed to activate user. Please try again.",
// 				"error",
// 				"admin"
// 			);
// 			setLoading(false);
// 		}
// 	};

// 	const handleDeactivateUser = async (userId) => {
// 		setLoading(true);
// 		try {
// 			setUsers((prevUsers) =>
// 				prevUsers.map((user) =>
// 					user._id === userId ? { ...user, isActive: true } : user
// 				)
// 			);
// 			await axios.put(
// 				`http://localhost:8000/api/admin/user/deactivate/${userId}`,
// 				{}
// 			);

// 			showNotification("User deactivated successfully.", "success");
// 			setLoading(false);
// 			fetchDashboardData();
// 			setUsers(
// 				users.map((user) =>
// 					user._id === userId ? { ...user, isActive: false } : user
// 				)
// 			);
// 		} catch (err) {
// 			console.error("Error deactivating user:", err);
// 			showNotification("Error deactivating user", "error");
// 			setLoading(false);
// 		}
// 	};

// 	const handleDeleteUser = async (userId) => {
// 		setLoading(true);
// 		try {
// 			await axios.delete(`http://localhost:8000/api/admin/user/${userId}`);

// 			showNotification("User deleted successfully.", "success");
// 			setLoading(false);
// 			fetchDashboardData();
// 			setUsers(users.filter((user) => user._id !== userId));
// 		} catch (err) {
// 			console.error("Error deleting user:", err);
// 			showNotification("Error deleting user", "error");
// 		}
// 	};

// 	const handleAssignOrderToEmployee = async () => {
// 		setLoading(true);
// 		const { orderId, employeeId } = assignOrder; // Changed from assignCustomer to assignOrder
// 		if (!orderId || !employeeId) {
// 			showNotification("Please provide all fields.", "error");
// 			setLoading(false);
// 			return;
// 		}
// 		try {
// 			console.log("Assign Order Payload:", { orderId, employeeId });
// 			await axios.post(
// 				"http://localhost:8000/api/admin/assign-order",
// 				{ orderId, employeeId }
// 			);
// 			showNotification("Order assigned to employee successfully.", "success");
// 			setLoading(false);
// 			setShowAssignOrderForm(false);
// 			setAssignOrder({ orderId: "", employeeId: "" });
// 			// Refresh data
// 			fetchAllOrders();
// 		} catch (err) {
// 			console.error("Error assigning order:", err.response?.data || err);
// 			showNotification("Error assigning order", "error");
// 			setLoading(false);
// 		}
// 	};

// 	const handleAssignEmployee = async () => {
// 		setLoading(true);
// 		const { employeeId, managerId } = assignEmployee;

// 		if (!employeeId || !managerId) {
// 			showNotification("Please provide all fields.", "error");
// 			setLoading(false);
// 			return;
// 		}

// 		try {
// 			await axios.post(
// 				"http://localhost:8000/api/admin/assign-employee",
// 				{ employeeId, managerId }
// 			);

// 			showNotification("Employee assigned to Manager successfully.", "success");
// 			setShowAssignEmployeeForm(false);
// 			setLoading(false);
// 			setAssignEmployee({ employeeId: "", managerId: "" });
// 		} catch (err) {
// 			showNotification("Error assigning employee.", "error");
// 			setLoading(false);
// 			console.error("Error assigning employee:", err);
// 		}
// 	};

// 	const handleUpdateService = async (updatedService, extensionDays = 0) => {
// 		setLoading(true);
// 		try {
// 			// Add extension days to the request if provided
// 			const requestData = {
// 				...updatedService,
// 				extensionDays: extensionDays,
// 			};

// 			const response = await axios.put(
// 				`http://localhost:8000/api/admin/services/${updatedService._id}`,
// 				requestData
// 			);

// 			setServices((prevServices) =>
// 				prevServices.map((service) =>
// 					service._id === updatedService._id ? response.data.service : service
// 				)
// 			);

// 			showNotification("Service updated successfully!", "success");
// 			setLoading(false);
// 			await fetchDashboardData();
// 			return true;
// 		} catch (error) {
// 			console.error("Error updating service:", error);
// 			showNotification(
// 				error.response?.data?.message ||
// 					"Failed to update service. Please try again.",
// 				"error",
// 				"admin"
// 			);
// 			setLoading(false);
// 			return false;
// 		}
// 	};

// 	const handleDeleteService = async (serviceId) => {
// 		setLoading(true);
// 		try {
// 			await axios.delete(
// 				`http://localhost:8000/api/admin/services/${serviceId}`
// 			);
// 			setServices((prevServices) =>
// 				prevServices.filter((service) => service._id !== serviceId)
// 			);

// 			showNotification("Service deleted successfully!", "success");
// 			fetchDashboardData();
// 			setLoading(false);
// 		} catch (error) {
// 			console.error("Error deleting service:", error);
// 			showNotification(
// 				"Failed to delete service. Please try again.",
// 				"error",
// 				"admin"
// 			);
// 			setLoading(false);
// 		}
// 	};

// 	const employees = useMemo(() => {
// 		return users.filter((user) => user && user.role === "employee");
// 	}, [users]);
// 	// console.log("employees", employees);
// 	const managers = useMemo(() => {
// 		return users.filter((user) => user && user.role === "manager");
// 	}, [users]);

// 	const customers = useMemo(() => {
// 		return users.filter((user) => user && user.role === "customer");
// 	}, [users]);
// 	// console.log("customers", customers);
// 	// Add the update service status function here
// 	const updateServiceStatusByAdmin = async (userId, serviceId, status) => {
// 		try {
// 			setLoading(true);

// 			// Make the API request
// 			console.log("Making API request to update service status..."); // Log before making the request
// 			const response = await axios.put(
// 				`http://localhost:8000/api/admin/update-service-status/${userId}`,
// 				{ serviceId, status } // Pass serviceId and status
// 			);

// 			// Log the response to check if the status is updated correctly
// 			console.log("API Response:", response.data);

// 			// Update the state with the new service status
// 			setUsers((prevUsers) =>
// 				prevUsers.map((user) =>
// 					user._id === userId
// 						? {
// 								...user,
// 								services: user.services.map((service) =>
// 									service.serviceId === serviceId // Compare by serviceId
// 										? { ...service, status: response.data.status } // Update the status
// 										: service
// 								),
// 						  }
// 						: user
// 				)
// 			);

// 			return response.data; // Return the updated data if needed
// 		} catch (err) {
// 			setError("Failed to update service status.");
// 			console.error("Error:", err); // Log the full error for debugging
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const fetchAllOrders = async () => {
// 		try {
// 			const { data } = await axios.get(
// 				"http://localhost:8000/api/admin/orders"
// 			);

// 			setOrders(data.orders);
// 			console.log("Oorders:", data.orders);
// 		} catch (error) {
// 			console.error("Error fetching orders:", error);
// 			showNotification(
// 				error.response?.data?.message || "Error fetching orders",
// 				"error",
// 				"admin"
// 			);
// 		}
// 	};

// 	const [filters, setFilters] = useState({
// 		customerId: "",
// 		serviceId: "",
// 		orderId: "",
// 	});

// 	const fetchMessages = async () => {
// 		try {
// 			// setLoading(true);
// 			const token = localStorage.getItem("adminToken");
// 			const response = await axios.get("http://localhost:8000/api/messages", {
// 				params: filters,
// 				headers: token ? { Authorization: `Bearer ${token}` } : {},
// 			});
// 			setMessages(response.data.messages);
// 		} catch (err) {
// 			console.error("Error fetching messages:", err);
// 			setError("Failed to load messages");
// 		} finally {
// 			// setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchMessages();

// 		const interval = setInterval(fetchMessages, 1000);
// 		return () => clearInterval(interval);
// 	}, [filters]);

// 	const reduceUnreadCount = (messageId) => {
// 		setMessages((prevMessages) =>
// 			prevMessages.map((msg) =>
// 				msg._id === messageId ? { ...msg, isReplied: true } : msg
// 			)
// 		);
// 	};

// 	const [assigningService, setAssigningService] = useState(false);

// 	// AdminDashboardContext.js
// 	const handleAssignService = async (userId, serviceId) => {
// 		try {
// 			setAssigningService(true);
// 			const response = await axios.post(
// 				`http://localhost:8000/api/admin/users/${userId}/assign-service`,
// 				{ serviceId }
// 			);
// 			if (response.status === 200) {
// 				const updatedUsers = users.map((user) =>
// 					user._id === userId
// 						? {
// 								...user,
// 								services: [
// 									...(user.services || []),
// 									{
// 										serviceId,
// 										name: services.find((s) => s._id === serviceId).name,
// 										status: "In Process",
// 									},
// 								],
// 						  }
// 						: user
// 				);
// 				updateUsers(updatedUsers);
// 				showNotification("Service assigned successfully", "success");
// 			}
// 		} catch (error) {
// 			showNotification("Error assigning service", "error");
// 		} finally {
// 			setAssigningService(false);
// 		}
// 	};

// 	const updateUsers = (newUsers) => {
// 		setUsers(newUsers);
// 	};

// 	const handleToggleServiceActivation = async (serviceId) => {
// 		try {
// 			setLoading(true);

// 			const response = await axios.put(
// 				`http://localhost:8000/api/admin/services/${serviceId}/toggle-activation`,
// 				{}
// 			);

// 			// Update the services state with the updated service
// 			setServices((prevServices) =>
// 				prevServices.map((service) =>
// 					service._id === serviceId
// 						? { ...service, isActive: response.data.service.isActive }
// 						: service
// 				)
// 			);

// 			const statusMessage = response.data.service.isActive
// 				? "activated"
// 				: "deactivated";
// 			showNotification(`Service ${statusMessage} successfully!`, "success");
// 			setLoading(false);
// 			return true;
// 		} catch (error) {
// 			console.error("Error toggling service activation:", error);
// 			showNotification(
// 				"Failed to update service status. Please try again.",
// 				"error",
// 				"admin"
// 			);
// 			setLoading(false);
// 			return false;
// 		}
// 	};

// 	// Fetch all leads
// 	const fetchAllLeads = async () => {
// 		try {
// 			const { data } = await axios.get(
// 				"http://localhost:8000/api/admin/leads"
// 			);

// 			// Process the leads to include order assignment information
// 			const processedLeads = data.leads.map(lead => {
// 				// If lead is converted and has an order ID, we need to get the order assignee
// 				if (lead.status === 'converted' && lead.convertedToOrderId) {
// 					// Try to find the corresponding order in the orders list
// 					const correspondingOrder = orders.find(order => 
// 						order.orderId === lead.convertedToOrderId
// 					);
					
// 					// If we found the order and it has an assigned employee, add it to the lead
// 					if (correspondingOrder && correspondingOrder.employeeId) {
// 						return {
// 							...lead,
// 							orderAssignedEmployee: correspondingOrder.employeeId
// 						};
// 					}
// 				}
// 				return lead;
// 			});

// 			setLeads(processedLeads);
// 			console.log("Processed Leads:", processedLeads);
// 		} catch (error) {
// 			console.error("Error fetching leads:", error);
// 			showNotification(
// 				error.response?.data?.message || "Error fetching leads",
// 				"error",
// 				"admin"
// 			);
// 		}
// 	};
	
// 	// Assign lead to employee
// 	const handleAssignLead = async (leadId, employeeId) => {
// 		setLoading(true);
// 		try {
// 			const response = await axios.post(
// 				"http://localhost:8000/api/admin/leads/assign",
// 				{ leadId, employeeId }
// 			);
			
// 			// Update local state
// 			setLeads(prevLeads => 
// 				prevLeads.map(lead => 
// 					lead._id === leadId 
// 						? { 
// 							...lead, 
// 							status: "assigned", 
// 							assignedToEmployee: employeeId,
// 							assignedAt: new Date()
// 						} 
// 						: lead
// 				)
// 			);
			
// 			showNotification("Lead assigned successfully", "success");
// 			setLoading(false);
// 			return true;
// 		} catch (error) {
// 			console.error("Error assigning lead:", error);
// 			showNotification(
// 				error.response?.data?.message || "Error assigning lead",
// 				"error"
// 			);
// 			setLoading(false);
// 			return false;
// 		}
// 	};
	
// 	// Convert lead to customer order
// 	const handleConvertLead = async (leadId, paymentDetails) => {
// 		setLoading(true);
// 		try {
// 			const response = await axios.post(
// 				"http://localhost:8000/api/admin/leads/convert",
// 				{ leadId, paymentDetails }
// 			);
			
// 			// Get the lead that's being converted to determine assigned employee
// 			const leadToConvert = leads.find(lead => lead._id === leadId);
// 			const assignedEmployee = leadToConvert ? leadToConvert.assignedToEmployee : null;
			
// 			// Update local state
// 			setLeads(prevLeads => 
// 				prevLeads.map(lead => 
// 					lead._id === leadId 
// 						? { 
// 							...lead, 
// 							status: "converted",
// 							convertedToOrderId: response.data.orderId,
// 							convertedAt: new Date(),
// 							orderAssignedEmployee: assignedEmployee // Initially assign the same employee
// 						} 
// 						: lead
// 				)
// 			);
			
// 			// Fetch updated data
// 			fetchAllLeads();
// 			fetchDashboardData();
// 			fetchAllOrders(); // Make sure to fetch updated orders to get the order assignment
			
// 			showNotification("Lead converted to customer order successfully", "success");
// 			setLoading(false);
// 			return true;
// 		} catch (error) {
// 			console.error("Error converting lead:", error);
// 			showNotification(
// 				error.response?.data?.message || "Error converting lead",
// 				"error"
// 			);
// 			setLoading(false);
// 			return false;
// 		}
// 	};
	
// 	// Add a function to send leads back to employees
// 	const handleSendLeadBack = async (leadId, message) => {
// 		try {
// 			setLoading(true);
			
// 			const response = await axios.post(
// 				"http://localhost:8000/api/admin/leads/send-back",
// 				{ leadId, message }
// 			);
			
// 			// Update the lead status in the local state
// 			setLeads(prevLeads =>
// 				prevLeads.map(lead =>
// 					lead._id === leadId
// 						? { ...lead, status: 'assigned', adminNote: message, sentBackAt: new Date() }
// 						: lead
// 				)
// 			);
			
// 			showNotification("Lead sent back to employee successfully", "success");
// 			return true;
// 		} catch (error) {
// 			console.error("Error sending lead back:", error);
// 			showNotification(
// 				error.response?.data?.message || "Error sending lead back",
// 				"error"
// 			);
// 			return false;
// 		} finally {
// 			setLoading(false);
// 		}
// 	};
	
// 	useEffect(() => {
// 		if (isAuthenticated) {
// 			fetchAllLeads();
// 		}
// 	}, [isAuthenticated]);

// 	// Add a new effect to update leads data when orders change
// 	useEffect(() => {
// 		if (orders.length > 0 && leads.length > 0) {
// 			// Process leads again to update order assignment information
// 			const updatedLeads = leads.map(lead => {
// 				if (lead.status === 'converted' && lead.convertedToOrderId) {
// 					const correspondingOrder = orders.find(order => 
// 						order.orderId === lead.convertedToOrderId
// 					);
					
// 					if (correspondingOrder && correspondingOrder.employeeId) {
// 						return {
// 							...lead,
// 							orderAssignedEmployee: correspondingOrder.employeeId
// 						};
// 					}
// 				}
// 				return lead;
// 			});
			
// 			setLeads(updatedLeads);
// 		}
// 	}, [orders]);

// 	return (
// 		<AdminDashboardContext.Provider
// 			value={{
// 				servicesCount,
// 				usersCount,
// 				employeesCount,
// 				managersCount,
// 				customersCount,
// 				// loading,
// 				setError,
// 				services,
// 				setServices,
// 				users,
// 				setUsers,
// 				newService,
// 				setNewService,
// 				newEmployee,
// 				setNewEmployee,
// 				newManager,
// 				setNewManager,
// 				newUser,
// 				setNewUser,
// 				fetchDashboardData,
// 				handleCreateService,
// 				resetError,
// 				handleCreateManager,
// 				handleActivateUser,
// 				handleDeactivateUser,
// 				handleCreateUser,
// 				handleDeleteUser,
// 				assignCustomer,
// 				assignService,
// 				setAssignService,
// 				setAssignCustomer,
// 				handleCreateEmployee,
// 				// handleAssignCustomer,
// 				// handleAssignService,
// 				handleUpdateService,
// 				handleDeleteService,
// 				//login
// 				isAuthenticated,
// 				login,
// 				logout,
// 				employees,
// 				managers,
// 				customers,
// 				selectedOrderPosition,
// 				setSelectedOrderPosition,
// 				handleAssignEmployee,
// 				assignEmployee,
// 				setAssignEmployee,
// 				updateServiceStatusByAdmin,

// 				assigningService,
// 				setAssigningService,
// 				handleAssignService,

// 				messages,
// 				setMessages,
// 				error,
// 				filters,
// 				setFilters,
// 				fetchMessages,
// 				reduceUnreadCount,
// 				fetchAllOrders,
// 				updateUsers,
// 				orders,
// 				setOrders,
// 				assignOrder,
// 				setAssignOrder,
// 				handleAssignOrderToEmployee,
// 				handleToggleServiceActivation,
// 				showUserForm,
// 				setShowUserForm,
// 				showEmployeeForm,
// 				setShowEmployeeForm,
// 				leads,
// 				fetchAllLeads,
// 				handleAssignLead,
// 				handleConvertLead,
// 				handleSendLeadBack,
// 				userGrowthData,
// 			}}>
// 			{loading && (
// 				<div
// 					style={{
// 						position: "fixed",
// 						top: 0,
// 						left: 0,
// 						width: "100%",
// 						height: "100%",
// 						backgroundColor: "rgba(0, 0, 0, 0.5)",
// 						display: "flex",
// 						justifyContent: "center",
// 						alignItems: "center",
// 						zIndex: 9999,
// 					}}>
// 					<ClipLoader size={50} color='#ffffff' />
// 				</div>
// 			)}
// 			{children}
// 		</AdminDashboardContext.Provider>
// 	);
// };

// export { AdminDashboardContext, AdminDashboardProvider };




import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "./utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";
import { useRef } from "react";
const AdminDashboardContext = createContext();

const AdminDashboardProvider = ({ children }) => {
	const [servicesCount, setServicesCount] = useState(0);
	const [usersCount, setUsersCount] = useState(0);
	const [managersCount, setManagersCount] = useState(0);
	const [employeesCount, setEmployeesCount] = useState(0);
	const [customersCount, setCustomersCount] = useState(0);
	const [userGrowthData, setUserGrowthData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [services, setServices] = useState([]);
	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [orders, setOrders] = useState([]);
	const [leads, setLeads] = useState([]);
	// const [loading, setLoading] = useState(false);

	const [assignOrder, setAssignOrder] = useState({
		orderId: "",
		employeeId: "",
	});
	const [showAssignOrderForm, setShowAssignOrderForm] = useState(false);

	const { showNotification, setCurrentPage } = useNotification();
	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	useEffect(() => {
		setCurrentPage("admin");
	}, [setCurrentPage]);
	//login
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [selectedOrderPosition, setSelectedOrderPosition] = useState(null);

	const [newService, setNewService] = useState({
		category: "",
		name: "",
		description: "",
		hsncode: "",
		currency: "INR",
		packages: [],
		requiredDocuments: [],
	});

	const [newEmployee, setNewEmployee] = useState({
		name: "",
		email: "",
		role: "",
		services: [],
		username: "",
		password: "",
		Lminus1code: "",
		L1EmpCode: "",
		designation: "",
	});
	const [newManager, setNewManager] = useState({
		name: "",
		email: "",
		role: "",
		serviceId: "",
		username: "",
		password: "",
	});
	const [newUser, setNewUser] = useState({
		role: "",
		name: "",
		email: "",
		serviceId: "",
		username: "",
		password: "",
	});
	const [assignCustomer, setAssignCustomer] = useState({
		customerId: "",
		employeeId: "",
	});
	//assign employee
	const [assignEmployee, setAssignEmployee] = useState({
		employeeId: "",
		managerId: "",
	});
	const [assignService, setAssignService] = useState({
		customerId: "",
		serviceId: "",
		employeeId: "",
	});
	const [showUserForm, setShowUserForm] = useState(false);
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	// const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);
	// Fetch Dashboard Data
	const isInitialLoad = useRef(true);

	useEffect(() => {
		console.log("Fetching dashboard data...");
		fetchDashboardData();
		fetchAllOrders();
	}, []);

	// Function to process user growth data based on creation dates
	const processUserGrowthData = (users) => {
		// Get the current date and go back 6 months
		const now = new Date();
		const months = [];
		const monthData = {};
		
		// Get the last 6 months (including current)
		for (let i = 0; i < 6; i++) {
			const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthName = monthDate.toLocaleString('default', { month: 'short' });
			const monthKey = `${monthName} ${monthDate.getFullYear()}`;
			months.unshift({ monthKey, monthDate });
			monthData[monthKey] = 0;
		}
		
		// Sort users by creation date
		const sortedUsers = [...users].sort((a, b) => 
			new Date(a.createdAt) - new Date(b.createdAt)
		);
		
		// Initialize with total users at the beginning of the period
		let runningTotal = sortedUsers.filter(user => 
			new Date(user.createdAt) < months[0].monthDate
		).length;
		
		// For each month, count users created in that month
		months.forEach(({ monthKey, monthDate }, index) => {
			const nextMonthDate = index < months.length - 1 
				? months[index + 1].monthDate 
				: new Date(now.getFullYear(), now.getMonth() + 1, 1);
			
			const newUsers = sortedUsers.filter(user => {
				const userDate = new Date(user.createdAt);
				return userDate >= monthDate && userDate < nextMonthDate;
			}).length;
			
			runningTotal += newUsers;
			monthData[monthKey] = runningTotal;
		});
		
		// Transform to array for the chart
		return months.map(({ monthKey }) => ({
			month: monthKey.split(' ')[0], // Only show month name in the chart
			users: monthData[monthKey]
		}));
	};

	const fetchDashboardData = async () => {
		try {
			const { data } = await axios.get(
				"http://localhost:8000/api/admin/dashboard"
			);
			// setLoading(true);
			console.log("admin data", data);
			const { services, users } = data;
			setServices(services);
			setUsers(users);

			setServicesCount(services.length);
			setUsersCount(users.length);
			// console.log("admin users", users);
			setEmployeesCount(
				users.filter((user) => user.role === "employee").length
			);
			setCustomersCount(
				users.filter((user) => user.role === "customer").length
			);
			setManagersCount(users.filter((user) => user.role === "manager").length);

			// Process user growth data
			const growthData = processUserGrowthData(users);
			setUserGrowthData(growthData);

			// Only show success notification on the first load
			if (isInitialLoad.current) {
			// showNotification(
			// 	"Admin Dashboard loaded successfully.",
			// 	"success",
			// 	"admin"
			// );

			}
		} catch (err) {
			console.error("Dashboard fetch error:", err);
			const errorMessage =
				err.response?.data?.message || "Failed to load dashboard data.";
			showNotification(errorMessage, "error");
			setError(errorMessage);

			if (err.response && err.response.status === 401) {
				setIsAuthenticated(false);
				localStorage.removeItem("adminToken");
				// Show notification and prevent automatic redirect for a session-expired error
				showNotification(
					"Session expired. Please log in again.",
					"error",
					"admin"
				);
				setError("Session expired. Please log in again.");
			}
		}
	};

	const resetError = () => {
		setError(null);
		setLoading(false);
	};

	//login
	const login = async (email, password) => {
		setLoading(true);
		try {
			// Send login request
			const response = await axios.post(
				"http://localhost:8000/api/admin/login",
				{
					email,
					password,
				}
			);
			
			// Store the token in localStorage
			if (response.data.token) {
				localStorage.setItem("adminToken", response.data.token);
			}
			
			setIsAuthenticated(true);
			await fetchDashboardData();
			return true; // Successful login
		} catch (err) {
			console.error("Login error:", err.response?.data?.message || err.message);
			showNotification("Login error", "error", "admin");
			return false; // Login failed
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		showNotification("Logged Out Successfully", "success");
		localStorage.removeItem("adminToken"); // Clear token on logout
		setIsAuthenticated(false); // Update authentication state
	};

	const handleCreateService = async () => {
		setLoading(true);
		const {
			category,
			name,
			description,
			hsncode,
			currency,
			packages,
			requiredDocuments,
		} = newService;

		// Basic validation
		if (!category || !name || !description || !hsncode) {
			showNotification("Please fill in all required service fields.", "error");
			setLoading(false);
			return;
		}

		// Packages are now optional
		// No validation needed for packages

		try {
			const { data } = await axios.post(
				"http://localhost:8000/api/admin/services",
				{
					category,
					name,
					description,
					hsncode,
					currency,
					packages,
					requiredDocuments,
				}
			);
			setServices((prevServices) => [...prevServices, data.service]);
			showNotification("Service created successfully", "success");
			setLoading(false);
			setServicesCount(services.length);
			fetchDashboardData();
			setNewService({
				category: "",
				name: "",
				description: "",
				hsncode: "",
				currency: "INR",
				packages: [],
				requiredDocuments: [],
			});
		} catch (err) {
			showNotification(
				err.response?.data?.message || "Error creating service.",
				"error",
				"admin"
			);
			setLoading(false);
		}
	};

	// Other functions follow the same error handling pattern
	const handleCreateManager = async () => {
		setLoading(true);
		const { name, email, username, password } = newManager;

		if (!name || !email || !username || !password) {
			showNotification("Please provide all fields.", "error");
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:8000/api/admin/manager",
				{ name, email, role: "manager", username, password }
			);

			showNotification("Manager created successfully", "success");
			// Wait for the dashboard data to refresh
			// await fetchDashboardData();

			setLoading(false);
			fetchDashboardData();
			setNewManager({
				name: "",
				email: "",

				username: "",
				password: "",
			});
		} catch (err) {
			showNotification("Error creating manager.", "error");
			setLoading(false);
		}
	};

	const handleCreateEmployee = async () => {
		setLoading(true);
		const {
			name,
			email,
			services, // Changed from serviceId to services array
			username,
			password,
			Lminus1code,
			L1EmpCode,
			designation,
		} = newEmployee;

		// Validate required fields
		if (!name || !email || !username || !password) {
			showNotification(
				"Please provide all required fields: name, email, username, and password.",
				"error"
			);
			setLoading(false);
			return;
		}

		if (!services || !Array.isArray(services) || services.length === 0) {
			showNotification(
				"Please select at least one service for the employee.",
				"error"
			);
			setLoading(false);
			return;
		}

		// if (!L1EmpCode) {
		// 	showNotification("Please select an L+1 employee.", "error");
		// 	setLoading(false);
		// 	return;
		// }

		try {
			const { data } = await axios.post(
				"http://localhost:8000/api/admin/employee",
				{
					name,
					email,
					role: "employee",
					services, // Send the array of service IDs
					username,
					password,
					Lminus1code,
					L1EmpCode,
					designation,
				}
			);

			setUsers((prevUsers) => [...prevUsers, data.employee]);
			showNotification("Employee created successfully.", "success");
			setLoading(false);
			fetchDashboardData();

			// Reset form fields including the services array
			setNewEmployee({
				name: "",
				email: "",
				services: [], // Reset services array instead of serviceId
				username: "",
				password: "",
				Lminus1code: "",
				L1EmpCode: "",
				designation: "",
			});
		} catch (err) {
			console.error("Error creating employee:", err);
			const errorMessage =
				err.response?.data?.message || "Error creating employee.";
			showNotification(errorMessage, "error");
			setLoading(false);
		}
	};

	const handleCreateUser = async () => {
		setLoading(true);
		const { name, email, role = "customer", username, password } = newUser;
		if (!name || !email || !username || !password) {
			showNotification("Please provide all fields.", "error");
			setLoading(false);
			return;
		}
		try {
			const response = await axios.post(
				"http://localhost:8000/api/admin/createUser",
				{ name, email, role: "customer", username, password }
			);
			setUsers((prevUsers) => [...prevUsers, response.data.user]);
			showNotification("User created successfully.", "success");
			setLoading(false);
			fetchDashboardData();
			setNewUser({
				name: "",
				email: "",
				username: "",
				role: "customer",

				password: "",
			});
		} catch (err) {
			showNotification("Error creating user.", "error");
			setLoading(false);
		}
	};

	const handleActivateUser = async (userId) => {
		setLoading(true);
		// Optimistically update the state
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user._id === userId ? { ...user, isActive: true } : user
			)
		);

		try {
			await axios.put(
				`http://localhost:8000/api/admin/user/activate/${userId}`
			);
			showNotification("User activated successfully.", "success");
			setLoading(false);
			fetchDashboardData();
		} catch (err) {
			console.error("Error activating user:", err);
			// Revert state if the API call fails
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user._id === userId ? { ...user, isActive: false } : user
				)
			);

			showNotification(
				"Failed to activate user. Please try again.",
				"error",
				"admin"
			);
			setLoading(false);
		}
	};

	const handleDeactivateUser = async (userId) => {
		setLoading(true);
		try {
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user._id === userId ? { ...user, isActive: true } : user
				)
			);
			await axios.put(
				`http://localhost:8000/api/admin/user/deactivate/${userId}`,
				{}
			);

			showNotification("User deactivated successfully.", "success");
			setLoading(false);
			fetchDashboardData();
			setUsers(
				users.map((user) =>
					user._id === userId ? { ...user, isActive: false } : user
				)
			);
		} catch (err) {
			console.error("Error deactivating user:", err);
			showNotification("Error deactivating user", "error");
			setLoading(false);
		}
	};

	const handleDeleteUser = async (userId) => {
		setLoading(true);
		try {
			await axios.delete(`http://localhost:8000/api/admin/user/${userId}`);

			showNotification("User deleted successfully.", "success");
			setLoading(false);
			fetchDashboardData();
			setUsers(users.filter((user) => user._id !== userId));
		} catch (err) {
			console.error("Error deleting user:", err);
			showNotification("Error deleting user", "error");
		}
	};

	const handleAssignOrderToEmployee = async () => {
		setLoading(true);
		const { orderId, employeeId } = assignOrder; // Changed from assignCustomer to assignOrder
		if (!orderId || !employeeId) {
			showNotification("Please provide all fields.", "error");
			setLoading(false);
			return;
		}
		try {
			console.log("Assign Order Payload:", { orderId, employeeId });
			await axios.post(
				"http://localhost:8000/api/admin/assign-order",
				{ orderId, employeeId }
			);
			showNotification("Order assigned to employee successfully.", "success");
			setLoading(false);
			setShowAssignOrderForm(false);
			setAssignOrder({ orderId: "", employeeId: "" });
			// Refresh data
			fetchAllOrders();
		} catch (err) {
			console.error("Error assigning order:", err.response?.data || err);
			showNotification("Error assigning order", "error");
			setLoading(false);
		}
	};

	const handleAssignEmployee = async () => {
		setLoading(true);
		const { employeeId, managerId } = assignEmployee;

		if (!employeeId || !managerId) {
			showNotification("Please provide all fields.", "error");
			setLoading(false);
			return;
		}

		try {
			await axios.post(
				"http://localhost:8000/api/admin/assign-employee",
				{ employeeId, managerId }
			);

			showNotification("Employee assigned to Manager successfully.", "success");
			setShowAssignEmployeeForm(false);
			setLoading(false);
			setAssignEmployee({ employeeId: "", managerId: "" });
		} catch (err) {
			showNotification("Error assigning employee.", "error");
			setLoading(false);
			console.error("Error assigning employee:", err);
		}
	};

	const handleUpdateService = async (updatedService, extensionDays = 0) => {
		setLoading(true);
		try {
			// Add extension days to the request if provided
			const requestData = {
				...updatedService,
				extensionDays: extensionDays,
			};

			const response = await axios.put(
				`http://localhost:8000/api/admin/services/${updatedService._id}`,
				requestData
			);

			setServices((prevServices) =>
				prevServices.map((service) =>
					service._id === updatedService._id ? response.data.service : service
				)
			);

			showNotification("Service updated successfully!", "success");
			setLoading(false);
			await fetchDashboardData();
			return true;
		} catch (error) {
			console.error("Error updating service:", error);
			showNotification(
				error.response?.data?.message ||
					"Failed to update service. Please try again.",
				"error",
				"admin"
			);
			setLoading(false);
			return false;
		}
	};

	const handleDeleteService = async (serviceId) => {
		setLoading(true);
		try {
			await axios.delete(
				`http://localhost:8000/api/admin/services/${serviceId}`
			);
			setServices((prevServices) =>
				prevServices.filter((service) => service._id !== serviceId)
			);

			showNotification("Service deleted successfully!", "success");
			fetchDashboardData();
			setLoading(false);
		} catch (error) {
			console.error("Error deleting service:", error);
			showNotification(
				"Failed to delete service. Please try again.",
				"error",
				"admin"
			);
			setLoading(false);
		}
	};

	const employees = useMemo(() => {
		return users.filter((user) => user && user.role === "employee");
	}, [users]);
	// console.log("employees", employees);
	const managers = useMemo(() => {
		return users.filter((user) => user && user.role === "manager");
	}, [users]);

	const customers = useMemo(() => {
		return users.filter((user) => user && user.role === "customer");
	}, [users]);
	// console.log("customers", customers);
	// Add the update service status function here
	const updateServiceStatusByAdmin = async (userId, serviceId, status) => {
		try {
			setLoading(true);

			// Make the API request
			console.log("Making API request to update service status..."); // Log before making the request
			const response = await axios.put(
				`http://localhost:8000/api/admin/update-service-status/${userId}`,
				{ serviceId, status } // Pass serviceId and status
			);

			// Log the response to check if the status is updated correctly
			console.log("API Response:", response.data);

			// Update the state with the new service status
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user._id === userId
						? {
								...user,
								services: user.services.map((service) =>
									service.serviceId === serviceId // Compare by serviceId
										? { ...service, status: response.data.status } // Update the status
										: service
								),
						  }
						: user
				)
			);

			return response.data; // Return the updated data if needed
		} catch (err) {
			setError("Failed to update service status.");
			console.error("Error:", err); // Log the full error for debugging
		} finally {
			setLoading(false);
		}
	};

	const fetchAllOrders = async () => {
		try {
			const { data } = await axios.get(
				"http://localhost:8000/api/admin/orders"
			);

			setOrders(data.orders);
			console.log("Oorders:", data.orders);
		} catch (error) {
			console.error("Error fetching orders:", error);
			showNotification(
				error.response?.data?.message || "Error fetching orders",
				"error",
				"admin"
			);
		}
	};

	const [filters, setFilters] = useState({
		customerId: "",
		serviceId: "",
		orderId: "",
	});

	const fetchMessages = async () => {
		try {
			// setLoading(true);
			const token = localStorage.getItem("adminToken");
			const response = await axios.get("http://localhost:8000/api/messages", {
				params: filters,
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});
			setMessages(response.data.messages);
		} catch (err) {
			console.error("Error fetching messages:", err);
			setError("Failed to load messages");
		} finally {
			// setLoading(false);
		}
	};

	useEffect(() => {
		fetchMessages();

		const interval = setInterval(fetchMessages, 1000);
		return () => clearInterval(interval);
	}, [filters]);

	const reduceUnreadCount = (messageId) => {
		setMessages((prevMessages) =>
			prevMessages.map((msg) =>
				msg._id === messageId ? { ...msg, isReplied: true } : msg
			)
		);
	};

	const [assigningService, setAssigningService] = useState(false);

	// AdminDashboardContext.js
	const handleAssignService = async (userId, serviceId) => {
		try {
			setAssigningService(true);
			const response = await axios.post(
				`http://localhost:8000/api/admin/users/${userId}/assign-service`,
				{ serviceId }
			);
			if (response.status === 200) {
				const updatedUsers = users.map((user) =>
					user._id === userId
						? {
								...user,
								services: [
									...(user.services || []),
									{
										serviceId,
										name: services.find((s) => s._id === serviceId).name,
										status: "In Process",
									},
								],
						  }
						: user
				);
				updateUsers(updatedUsers);
				showNotification("Service assigned successfully", "success");
			}
		} catch (error) {
			showNotification("Error assigning service", "error");
		} finally {
			setAssigningService(false);
		}
	};

	const updateUsers = (newUsers) => {
		setUsers(newUsers);
	};

	const handleToggleServiceActivation = async (serviceId) => {
		try {
			setLoading(true);

			const response = await axios.put(
				`http://localhost:8000/api/admin/services/${serviceId}/toggle-activation`,
				{}
			);

			// Update the services state with the updated service
			setServices((prevServices) =>
				prevServices.map((service) =>
					service._id === serviceId
						? { ...service, isActive: response.data.service.isActive }
						: service
				)
			);

			const statusMessage = response.data.service.isActive
				? "activated"
				: "deactivated";
			showNotification(`Service ${statusMessage} successfully!`, "success");
			setLoading(false);
			return true;
		} catch (error) {
			console.error("Error toggling service activation:", error);
			showNotification(
				"Failed to update service status. Please try again.",
				"error",
				"admin"
			);
			setLoading(false);
			return false;
		}
	};

	// Fetch all leads
	const fetchAllLeads = async () => {
		try {
			const { data } = await axios.get(
				"http://localhost:8000/api/admin/leads"
			);

			// Process the leads to include order assignment information
			const processedLeads = data.leads.map(lead => {
				// If lead is converted and has an order ID, we need to get the order assignee
				if (lead.status === 'converted' && lead.convertedToOrderId) {
					// Try to find the corresponding order in the orders list
					const correspondingOrder = orders.find(order => 
						order.orderId === lead.convertedToOrderId
					);
					
					// If we found the order and it has an assigned employee, add it to the lead
					if (correspondingOrder && correspondingOrder.employeeId) {
						return {
							...lead,
							orderAssignedEmployee: correspondingOrder.employeeId
						};
					}
				}
				return lead;
			});

			setLeads(processedLeads);
			console.log("Processed Leads:", processedLeads);
		} catch (error) {
			console.error("Error fetching leads:", error);
			showNotification(
				error.response?.data?.message || "Error fetching leads",
				"error",
				"admin"
			);
		}
	};
	
	// Assign lead to employee
	const handleAssignLead = async (leadId, employeeId) => {
		setLoading(true);
		try {
			const response = await axios.post(
				"http://localhost:8000/api/admin/leads/assign",
				{ leadId, employeeId }
			);
			
			// Update local state
			setLeads(prevLeads => 
				prevLeads.map(lead => 
					lead._id === leadId 
						? { 
							...lead, 
							status: "assigned", 
							assignedToEmployee: employeeId,
							assignedAt: new Date()
						} 
						: lead
				)
			);
			
			showNotification("Lead assigned successfully", "success");
			setLoading(false);
			return true;
		} catch (error) {
			console.error("Error assigning lead:", error);
			showNotification(
				error.response?.data?.message || "Error assigning lead",
				"error"
			);
			setLoading(false);
			return false;
		}
	};
	
	// Convert lead to customer order
	const handleConvertLead = async (leadId, paymentDetails) => {
		setLoading(true);
		try {
			const response = await axios.post(
				"http://localhost:8000/api/admin/leads/convert",
				{ leadId, paymentDetails }
			);
			
			// Get the lead that's being converted to determine assigned employee
			const leadToConvert = leads.find(lead => lead._id === leadId);
			const assignedEmployee = leadToConvert ? leadToConvert.assignedToEmployee : null;
			
			// Update local state
			setLeads(prevLeads => 
				prevLeads.map(lead => 
					lead._id === leadId 
						? { 
							...lead, 
							status: "converted",
							convertedToOrderId: response.data.orderId,
							convertedAt: new Date(),
							orderAssignedEmployee: assignedEmployee // Initially assign the same employee
						} 
						: lead
				)
			);
			
			// Fetch updated data
			fetchAllLeads();
			fetchDashboardData();
			fetchAllOrders(); // Make sure to fetch updated orders to get the order assignment
			
			showNotification("Lead converted to customer order successfully", "success");
			setLoading(false);
			return true;
		} catch (error) {
			console.error("Error converting lead:", error);
			showNotification(
				error.response?.data?.message || "Error converting lead",
				"error"
			);
			setLoading(false);
			return false;
		}
	};
	
	// Add a function to send leads back to employees
	const handleSendLeadBack = async (leadId, message) => {
		try {
			setLoading(true);
			
			const response = await axios.post(
				"http://localhost:8000/api/admin/leads/send-back",
				{ leadId, message }
			);
			
			// Update the lead status in the local state
			setLeads(prevLeads =>
				prevLeads.map(lead =>
					lead._id === leadId
						? { ...lead, status: 'assigned', adminNote: message, sentBackAt: new Date() }
						: lead
				)
			);
			
			showNotification("Lead sent back to employee successfully", "success");
			return true;
		} catch (error) {
			console.error("Error sending lead back:", error);
			showNotification(
				error.response?.data?.message || "Error sending lead back",
				"error"
			);
			return false;
		} finally {
			setLoading(false);
		}
	};
	
	useEffect(() => {
		if (isAuthenticated) {
			fetchAllLeads();
		}
	}, [isAuthenticated]);

	// Add a new effect to update leads data when orders change
	useEffect(() => {
		if (orders.length > 0 && leads.length > 0) {
			// Process leads again to update order assignment information
			const updatedLeads = leads.map(lead => {
				if (lead.status === 'converted' && lead.convertedToOrderId) {
					const correspondingOrder = orders.find(order => 
						order.orderId === lead.convertedToOrderId
					);
					
					if (correspondingOrder && correspondingOrder.employeeId) {
						return {
							...lead,
							orderAssignedEmployee: correspondingOrder.employeeId
						};
					}
				}
				return lead;
			});
			
			setLeads(updatedLeads);
		}
	}, [orders]);

	return (
		<AdminDashboardContext.Provider
			value={{
				servicesCount,
				usersCount,
				employeesCount,
				managersCount,
				customersCount,
				// loading,
				setError,
				services,
				setServices,
				users,
				setUsers,
				newService,
				setNewService,
				newEmployee,
				setNewEmployee,
				newManager,
				setNewManager,
				newUser,
				setNewUser,
				fetchDashboardData,
				handleCreateService,
				resetError,
				handleCreateManager,
				handleActivateUser,
				handleDeactivateUser,
				handleCreateUser,
				handleDeleteUser,
				assignCustomer,
				assignService,
				setAssignService,
				setAssignCustomer,
				handleCreateEmployee,
				// handleAssignCustomer,
				// handleAssignService,
				handleUpdateService,
				handleDeleteService,
				//login
				isAuthenticated,
				login,
				logout,
				employees,
				managers,
				customers,
				selectedOrderPosition,
				setSelectedOrderPosition,
				handleAssignEmployee,
				assignEmployee,
				setAssignEmployee,
				updateServiceStatusByAdmin,

				assigningService,
				setAssigningService,
				handleAssignService,

				messages,
				setMessages,
				error,
				filters,
				setFilters,
				fetchMessages,
				reduceUnreadCount,
				fetchAllOrders,
				updateUsers,
				orders,
				setOrders,
				assignOrder,
				setAssignOrder,
				handleAssignOrderToEmployee,
				handleToggleServiceActivation,
				showUserForm,
				setShowUserForm,
				showEmployeeForm,
				setShowEmployeeForm,
				leads,
				fetchAllLeads,
				handleAssignLead,
				handleConvertLead,
				handleSendLeadBack,
				userGrowthData,
			}}>
			{loading && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 9999,
					}}>
					<ClipLoader size={50} color='#ffffff' />
				</div>
			)}
			{children}
		</AdminDashboardContext.Provider>
	);
};

export { AdminDashboardContext, AdminDashboardProvider };
