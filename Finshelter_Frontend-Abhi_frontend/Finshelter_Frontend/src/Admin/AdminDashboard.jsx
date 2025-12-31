import React, { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardSection from "./DashboardSection";
import ServicesSection from "./ServicesSection";
import EmployeesSection from "./EmployeesSection";
import UsersSection from "./UsersSection";
// import ManagersSection from "./ManagersSection";
import AdminMessageCenter from "./AdminMessageCenter";
import LeadsSection from "./LeadsSection";
import "./admin.css";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useNotification } from "../NotificationContext";
import { useEffect } from "react";
import Orders from "./Orders";
import WalletTransactions from "./WalletTransactions";

const AdminDashboard = () => {
	const {
		isAuthenticated,
		servicesCount,
		usersCount,
		employeesCount,
		managersCount,
		customersCount,
		error,
		services,
		users,
		newService,
		setNewService,
		newEmployee,
		setNewEmployee,
		newManager,
		setNewManager,
		newUser,
		setNewUser,
		assignCustomer,
		setAssignCustomer,
		handleCreateService,
		handleCreateManager,
		handleCreateEmployee,
		handleCreateUser,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
		handleAssignCustomer,
		handleUpdateService,
		handleDeleteService,
		logout,
	} = useContext(AdminDashboardContext);

	const [activeSection, setActiveSection] = useState("Dashboard");
	const [showServiceForm, setShowServiceForm] = useState(false);
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	const [showManagerForm, setShowManagerForm] = useState(false);
	const [showUserForm, setShowUserForm] = useState(false);
	const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);

	const { showNotification, setCurrentPage } = useNotification();

	useEffect(() => {
		setCurrentPage("admin");
	}, [setCurrentPage]);

	if (!isAuthenticated) {
		return <Navigate to='/admin/login' replace />;
		
	}
	return (
		<div className='admin-dashboard'>
			<Sidebar
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>
			<div className='content2'>
				<Topbar
					activeSection={activeSection}
					setActiveSection={setActiveSection}
				/>
				<div className='content'>
					{activeSection === "Dashboard" && (
						<DashboardSection
							servicesCount={servicesCount}
							usersCount={usersCount}
							employeesCount={employeesCount}
							managersCount={managersCount}
							customersCount={customersCount}
							showServiceForm={showServiceForm}
							setShowServiceForm={setShowServiceForm}
							handleCreateService={handleCreateService}
							showEmployeeForm={showEmployeeForm}
							setShowEmployeeForm={setShowEmployeeForm}
							showUserForm={showUserForm}
							setShowUserForm={setShowUserForm}
							handleCreateUser={handleCreateUser}
							handleActivateUser={handleActivateUser}
							handleDeactivateUser={handleDeactivateUser}
							handleDeleteUser={handleDeleteUser}
							services={services}
							users={users}
						/>
					)}
					{activeSection === "Services" && (
						<ServicesSection
							services={services}
							newService={newService}
							setNewService={setNewService}
							showServiceForm={showServiceForm}
							setShowServiceForm={setShowServiceForm}
							handleCreateService={handleCreateService}
							handleUpdateService={handleUpdateService}
							handleDeleteService={handleDeleteService}
						/>
					)}
					
					{activeSection === "Employees" && (
						<EmployeesSection
							newUser={newUser}
							setNewUser={setNewUser}
							users={users}
							services={services}
							newEmployee={newEmployee}
							setNewEmployee={setNewEmployee}
							showEmployeeForm={showEmployeeForm}
							setShowEmployeeForm={setShowEmployeeForm}
							showAssignCustomerForm={showAssignCustomerForm}
							setShowAssignCustomerForm={setShowAssignCustomerForm}
							handleCreateEmployee={handleCreateEmployee}
							handleActivateUser={handleActivateUser}
							handleDeactivateUser={handleDeactivateUser}
							handleDeleteUser={handleDeleteUser}
						/>
					)}
					{activeSection === "Customers" && (
						<UsersSection
							users={users}
							services={services}
							newUser={newUser}
							setNewUser={setNewUser}
							showUserForm={showUserForm}
							setShowUserForm={setShowUserForm}
							handleCreateUser={handleCreateUser}
							handleActivateUser={handleActivateUser}
							handleDeactivateUser={handleDeactivateUser}
							handleDeleteUser={handleDeleteUser}
						/>
					)}
					{activeSection === "Orders" && <Orders />}
					{activeSection === "Leads" && <LeadsSection />}
					{activeSection === "Message Center" && <AdminMessageCenter />}
					{activeSection === "Withdrawal Requests" && <WalletTransactions />}
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
