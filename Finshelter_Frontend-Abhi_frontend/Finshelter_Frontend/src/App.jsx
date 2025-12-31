import "./App.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useParams,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Section1 from "./components/Section1/Section1";
import About from "./components/AboutUs/About";
import ContactUs from "./components/ContactUs/ContactUs";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import LoginPage from "./Admin/utils/LoginPage";
import AdminDashboard from "./Admin/AdminDashboard";
import ProtectedRoute from "./Admin/utils/ProtectedRoute";
import { useState, useEffect, useContext } from "react";
import CustomerDashboard from "./Customer/CustomerDashboard";
import CustomerLoginPage from "./Customer/CustomerLoginPage";
import LoginOTPVerification from "./Customer/LoginOTPVerification";
import ResetPasswordPage from "./Customer/ResetPasswordPage";
import { CustomerAuthProvider } from "./Customer/CustomerAuthContext";
import { useNavigate } from "react-router-dom";
import CustomerProtectedRoute from "./Customer/CustomerProtectedRoute";
import CDashSection from "./Customer/CDashSection";
import { EmployeeContext, EmployeeProvider } from "./Employee/EmployeeContext";
import EmployeeLoginPage from "./Employee/EmLoginPage";
import EmLoginPage from "./Employee/EmLoginPage";
import EmployeeProtectedRoute from "./Employee/EmployeeProtectedRoute";
import EmployeeDashboard from "./Employee/EmployeeDashboard";
import { NotificationProvider } from "./NotificationContext";
import {
	AdminDashboardProvider,
	AdminDashboardContext,
} from "./Admin/AdminDashboardContext";
import ServiceProgress from "./Customer/ServiceProgress";
import CategoryPage from "./components/Services/CategoryPage";
import FlexiCustomerForm from "./components/Services/FlexiCustomerForm";
import BusinessLoanPage from "./components/Services/BusinessLoan";
import PersonalLoanPage from "./components/Services/PersonalLoan";
import HomeLoanPage from "./components/Services/HomeLoan";
import VehicleLoanPage from "./components/Services/VehicleLoan";
import GoldLoanPage from "./components/Services/GoldLoan";
import TermInsurancePage from "./components/Services/TermInsurance";
import HealthInsurancePage from "./components/Services/HealthInsurance";
import CreditCardPage from "./components/Services/CreditCard";
import LoanAgainstPropertyPage from "./components/Services/LAP";
import OverdraftPage from "./components/Services/Overdraft";
import VehicleInsurancePage from "./components/Services/VehicleInsurance";
import ServiceRegistration from "./components/Services/ServiceRegistration";
import PaymentPage from "./components/Services/PaymentPage";
import StaticServiceTemplate from "./components/Services/StaticServiceTemplate";
import { createServiceSlug } from "./utils/serviceRouteMap";
import InvestmentsPage from "./components/Services/Investments";
import WorkmenInsurancePage from "./components/Services/WorkmenCompensation";
import PersonalAccidentPage from "./components/Services/PersonalAccident";
import MutualFundsPage from "./components/Services/MutualFunds";
import ITRFilingPage from "./components/Services/ITRFiling";
import TaxPlanningPage from "./components/Services/TaxPlanning";
import PortfolioBPage from "./components/Services/PortfolioB";
import TDSReturnsPage from "./components/Services/TDSReturns";
import GSTPage from "./components/Services/GST";
import PFandESIPage from "./components/Services/PFandESI";
import RegistartionsPage from "./components/Services/Registrations";
import ScrollToTop from "./components/ScrollToTop";
import GlossaryPage from "./components/Glossary/Glossary";

// Import calculators
import EMICalculator from "./components/Calculators/EMICalculator";
import InvestmentCalculator from "./components/Calculators/InvestmentCalculator";
import TaxCalculator from "./components/Calculators/TaxCalculator";

// Import policy pages
import TermsConditions from "./components/Footer/TermsConditions";
import DataPolicy from "./components/Footer/DataPolicy";
import RefundPolicy from "./components/Footer/RefundPolicy";

// Array of all static service pages with their route paths
// This makes it easy to add new service pages - just add them to this array
const serviceRoutes = [
	{
		path: "/business-loan",
		name: "Business Loan",
		component: BusinessLoanPage,
	},
	{
		path: "/personalloan",
		name: "Personal Loan",
		component: PersonalLoanPage,
	},
	{
		path: "/home-loan",
		name: "Home Loan",
		component: HomeLoanPage,
	},
	{
		path: "/vehicle-loan",
		name: "Vehicle Loan",
		component: VehicleLoanPage,
	},
	{
		path: "/gold-loan",
		name: "Gold Loan",
		component: GoldLoanPage,
	},
	{
		path: "/term-insurance",
		name: "Term Insurance",
		component: TermInsurancePage,
	},
	{
		path: "/health-insurance",
		name: "Health Insurance",
		component: HealthInsurancePage,
	},
	{
		path: "/vehicle-insurance",
		name: "Vehicle Insurance",
		component: VehicleInsurancePage,
	},
	{
		path: "/workmen-compensation",
		name: "Workmen Compensation",
		component: WorkmenInsurancePage,
	},
	{
		path: "/personal-accident",
		name: "Personal Accident Insurance",
		component: PersonalAccidentPage,
	},
	{
		path: "/credit-card",
		name: "Credit Card",
		component: CreditCardPage,
	},
	{
		path: "/loan-against-property",
		name: "Loan Against Property",
		component: LoanAgainstPropertyPage,
	},
	{
		path: "/overdraft",
		name: "Overdraft",
		component: OverdraftPage,
	},
	{
		path: "/mutual-funds",
		name: "Mutual Funds",
		component: MutualFundsPage,
	},
	{
		path: "/itr-filing",
		name: "ITR Filing",
		component: ITRFilingPage,
	},
	{
		path: "/tax-planning",
		name: "Tax Planning",
		component: TaxPlanningPage,
	},
	{
		path: "/portfolio-builder",
		name: "Portfolio Builder",
		component: PortfolioBPage,
	},
	{
		path: "/tds-returns",
		name: "TDS Returns",
		component: TDSReturnsPage,
	},
	{
		path: "/gst",
		name: "GST",
		component: GSTPage,
	},
	{
		path: "/pf-and-esi",
		name: "PF and ESI",
		component: PFandESIPage,
	},
	{
		path: "/registrations",
		name: "Registrations",
		component: RegistartionsPage,
	},
];

// Array of all calculator routes
const calculatorRoutes = [
	{
		path: "/emi-calculator",
		name: "EMI Calculator",
		component: EMICalculator,
	},
	{
		path: "/investment-calculator",
		name: "Investment Calculator",
		component: InvestmentCalculator,
	},
	{
		path: "/tax-calculator",
		name: "Tax Calculator",
		component: TaxCalculator,
	},
];

// Dynamic Service Component - Used for services with hasStaticPage=true but no dedicated component
const DynamicServicePage = () => {
	const { serviceId } = useParams();
	const { services } = useContext(AdminDashboardContext);
	const service = services.find(
		(s) => s._id === serviceId || createServiceSlug(s.name) === serviceId
	);

	if (!service) {
		return <div>Service not found</div>;
	}

	// Create a basic service config for the Static Template
	const serviceConfig = {
		serviceId: service._id,
		serviceName: service.name,
		serviceDescription: service.description,
		isLeadService: false,
		leadButtonText: "Apply Now",
		packageButtonText: "Select Package",
	};

	return <StaticServiceTemplate {...serviceConfig} />;
};

function App() {
	const [dynamicRoutes, setDynamicRoutes] = useState([]);

	return (
		<NotificationProvider>
			<AdminDashboardProvider>
				<EmployeeProvider>
					<CustomerAuthProvider>
						<Router>
							<ScrollToTop />
							<Routes>
								<Route
									path='/'
									element={
										<>
											<Header />
											<Home />
										</>
									}
								/>

								<Route
									path='/section1'
									element={
										<>
											<Section1 />
										</>
									}
								/>

								<Route
									path='/about'
									element={
										<>
											<Header />
											<About />
										</>
									}
								/>

								<Route
									path='/category/:categoryName'
									element={
										<>
											<Header />
											<CategoryPage />
										</>
									}
								/>

								<Route
									path='/contact'
									element={
										<>
											<Header />
											<ContactUs />
										</>
									}
								/>
								<Route
									path='/admin/login'
									element={
										<>
											<Header />
											<LoginPage />
										</>
									}
								/>

								{/* Dynamic service routes - generated from the serviceRoutes array */}
								{serviceRoutes.map((route) => (
									<Route
										key={route.path}
										path={route.path}
										element={
											<>
												<Header />
												<route.component />
											</>
										}
									/>
								))}

								{/* Dynamic route for any service that has hasStaticPage=true but no dedicated component */}
								<Route
									path='/:serviceId'
									element={
										<>
											<Header />
											<DynamicServicePage />
										</>
									}
								/>

								<Route
									path='/service-registration'
									element={
										<>
											<Header />
											<ServiceRegistration />
										</>
									}
								/>
							<Route
								path='/payment'
								element={
									<>
										<Header />
										<PaymentPage />
									</>
								}
							/>
								<Route
									path='/admin/dashboard'
									element={<ProtectedRoute element={<AdminDashboard />} />}
								/>
								<Route
									path='/admin/*'
									element={<Navigate to='/admin/login' replace />}
								/>
								{/* Customer Routes */}

								<Route
									path='/login'
									element={
										<>
											<Header />
											<CustomerLoginPage />
										</>
									}
								/>

								<Route
									path='/customers/login'
									element={
										<>
											<Header />
											<CustomerLoginPage />
										</>
									}
								/>

								<Route
									path='/verify-login-otp'
									element={
										<>
											<LoginOTPVerification />
										</>
									}
								/>

								<Route
									path='/reset-password/:token'
									element={
										<>
											<Header />
											<ResetPasswordPage />
										</>
									}
								/>

								<Route
									path='/investments'
									element={
										<>
											<Header />
											<InvestmentsPage />
										</>
									}
								/>

								<Route
									path='/register'
									element={
										<>
											<Header />
											<FlexiCustomerForm />
										</>
									}
								/>

								<Route
									path='/customers/dashboard/:email'
									element={
										<CustomerProtectedRoute
											element={
												<>
													<Header />
													<CustomerDashboard />
												</>
											}
										/>
									}
								/>

								<Route
									path='/customers/*'
									element={<Navigate to='/customers/login' replace />}
								/>
								<Route
									path='/employees/login'
									element={
										<>
											<Header />
											<EmLoginPage />
										</>
									}
								/>
								<Route
									path='/employees/dashboard/:email'
									element={
										<EmployeeProtectedRoute element={<EmployeeDashboard />} />
									}
								>
									<Route index element={<Navigate to='overview' replace />} />
									<Route path='overview' element={<div></div>} />
									<Route path='orders' element={<div></div>} />
									<Route path='leads' element={<div></div>} />
									<Route path='queries' element={<div></div>} />
									<Route path='profile' element={<div></div>} />
								</Route>
								<Route
									path='/employees/*'
									element={<Navigate to='/employees/login' replace />}
								/>

								{/* Calculator Routes */}
								{calculatorRoutes.map((route) => (
									<Route
										key={route.path}
										path={route.path}
										element={
											<>
												<Header />
												<route.component />
											</>
										}
									/>
								))}

								{/* Service Routes */}
								{serviceRoutes.map((route) => (
									<Route
										key={route.path}
										path={route.path}
										element={
											<>
												<Header />
												<route.component />
											</>
										}
									/>
								))}

								{/* Service Registration Route */}
								<Route
									path='/service-registration'
									element={
										<>
											<Header />
											<ServiceRegistration />
										</>
									}
								/>

								{/* Payment Page Route */}
								<Route
									path='/payment'
									element={
										<>
											<Header />
											<PaymentPage />
										</>
									}
								/>

								{/* Policy Pages Routes */}
								<Route
									path='/terms-conditions'
									element={
										<>
											<Header />
											<TermsConditions />
										</>
									}
								/>

								<Route
									path='/data-policy'
									element={
										<>
											<Header />
											<DataPolicy />
										</>
									}
								/>

								<Route
									path='/refund-policy'
									element={
										<>
											<Header />
											<RefundPolicy />
										</>
									}
								/>

								{/* Glossary Page Route */}
								<Route
									path='/glossary'
									element={
										<>
											<Header />
											<GlossaryPage />
										</>
									}
								/>
							</Routes>
							<Footer />
						</Router>
					</CustomerAuthProvider>
				</EmployeeProvider>
			</AdminDashboardProvider>
		</NotificationProvider>
	);
}

export default App;


