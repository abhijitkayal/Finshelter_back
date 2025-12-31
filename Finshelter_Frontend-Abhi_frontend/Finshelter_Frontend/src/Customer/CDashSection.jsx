import React, { useEffect, useState, useRef } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "../Admin/utils/axiosConfig";
import ServiceProgress from "./ServiceProgress";
import { useNotification } from "../NotificationContext";
import { useNavigate } from "react-router-dom";
import { createServiceSlug } from "../utils/serviceRouteMap";

const CDashSection = () => {
	const {
		services,
		user,
		getAllServicesForCDash,
		fetchMessages,
		loading,
		setLoading,
		fetchCustomerDashboard
	} = useCustomerAuth();
	const [allServices, setAllServices] = useState([]);
	const sliderRef = useRef(null);
	const navigate = useNavigate();

	const { showNotification, setCurrentPage } = useNotification();

	useEffect(() => {
		setCurrentPage("customer");
	}, [setCurrentPage]);

	useEffect(() => {
		const fetchData = async () => {
			const fetchedServices = await getAllServicesForCDash();
			setAllServices(fetchedServices);
		};
		fetchData();
	}, []);

	const scroll = (direction) => {
		if (sliderRef.current) {
			const scrollAmount = sliderRef.current.offsetWidth;
			sliderRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	const handleServiceDetails = (service) => {
		// Navigate to service page using the service ID or slug
		try {
			const serviceSlug = createServiceSlug(service.name);
			// Navigate to the service page
			navigate(`/${serviceSlug}`, { 
				state: { 
					serviceId: service._id 
				} 
			});
		} catch (error) {
			console.error("Error navigating to service page:", error);
			showNotification("Unable to view service details. Please try again.", "error");
		}
	};

	return (
		<div className='tax-dashboard-section'>
			<div className='cdashboard-summary'>
				<h1>Welcome, {user?.name ? user.name.split(' ')[0] : "new customer"} {user?.packageName ? "package" : ""}</h1>
				<div>
					<div className='dashboard-card'>
						<p>Total Services: {services.length}</p>
					</div>
					<div className='dashboard-card'>
						<p>
							Total Payments: ₹
							{(user?.paymentHistory?.reduce(
								(total, payment) => total + (payment.amount || 0),
								0
							) || 0).toFixed(2)}
						</p>
					</div>
				</div>
			</div>

			<div className='services-container'>
				<div className='services-slider' ref={sliderRef}>
					{allServices.map((service, index) => (
						<div key={index} className='service-card'>
							<h3>{service.name}</h3>
							<p>{service.description}</p>
							<p className='service-price'>
								Price: ₹{service.salePrice || service.actualPrice || 0}
								<small style={{ display: 'block', fontSize: '12px', color: '#666' }}>
									+{service.gstRate || 18}% GST
								</small>
							</p>
							<button
								onClick={() => handleServiceDetails(service)}
								className='buy-button'>
								View Details
							</button>
						</div>
					))}
				</div>
				<div className='slider-controls'>
					<button className='slider-button' onClick={() => scroll("left")}>
						<ChevronLeft />
					</button>
					<button className='slider-button' onClick={() => scroll("right")}>
						<ChevronRight />
					</button>
				</div>
			</div>
		</div>
	);
};

export default CDashSection;
