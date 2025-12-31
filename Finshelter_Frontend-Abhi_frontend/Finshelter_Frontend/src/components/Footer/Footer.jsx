import React from "react";
import "./footer.css";
import { NavLink } from "react-router-dom";
import { SERVICE_PATHS } from "../../utils/serviceRouteMap";

const Footer = () => {
	// Group services by category
	const taxFiling = [
		{ name: "ITR Filing", path: SERVICE_PATHS["itr filing"] },
		{ name: "GST Filing", path: SERVICE_PATHS["gst"] },
		{ name: "TDS Return Filing", path: SERVICE_PATHS["tds returns"] },
	];

	const taxPlanning = [
		{ name: "Tax Planner", path: SERVICE_PATHS["tax planning"] },
		{ name: "Income Tax", path: SERVICE_PATHS["income tax"] },
		{ name: "PF and ESI", path: SERVICE_PATHS["pf and esi"] },
	];

	const registrations = [
		{
			name: "Business Registration",
			path: SERVICE_PATHS["business registration"],
		},
		{
			name: "Company Registration",
			path: SERVICE_PATHS["company registration"],
		},
		{ name: "MSME Registration", path: SERVICE_PATHS["msme registration"] },
	];

	const loans = [
		{ name: "Business Loan", path: SERVICE_PATHS["business loan"] },
		{ name: "Personal Loan", path: SERVICE_PATHS["personal loan"] },
		{ name: "Home Loan", path: SERVICE_PATHS["home loan"] },
		{ name: "Gold Loan", path: SERVICE_PATHS["gold loan"] },
	];

	const insurance = [
		{ name: "Term Insurance", path: SERVICE_PATHS["term insurance"] },
		{ name: "Health Insurance", path: SERVICE_PATHS["health insurance"] },
		{ name: "Vehicle Insurance", path: SERVICE_PATHS["vehicle insurance"] },
	];

	return (
		<footer className='footer'>
			{/* Top Footer Section - Logo, Contact, Quick Links */}
			<div className='footer-top'>
				<div className='container'>
					{/* Logo and Description */}
					<div className='footer-column'>
						<h3 style={{ fontFamily: "Agbalumo" }}>FinShelter</h3>
						<p>
							Robust financial services like taxation, loans, insurance, and
							mutual funds are the pillars of economic growth — empowering
							individuals, supporting governments, and securing futures.
						</p>
					</div>

					{/* Contact Us */}
					<div className='footer-column'>
						<h4>Contact Us</h4>
						<ul>
							<li>
								<a href='mailto:Info@thefinshelter.com'>
									Info@thefinshelter.com
								</a>
							</li>
							<li>
								<a href='tel:+919537601955'>+91 95376 01955</a>
							</li>
						</ul>
					</div>

					{/* Quick Links */}
					<div className='footer-column'>
						<h4>Quick Links</h4>
						<ul>
							<li>
								<NavLink to='/terms-conditions'>Terms & Conditions</NavLink>
							</li>
							<li>
								<NavLink to='/data-policy'>Privacy Policy</NavLink>
							</li>
							<li>
								<NavLink to='/refund-policy'>Refund Policy</NavLink>
							</li>
							<li>
								<NavLink to='/contact'>Contact Us</NavLink>
							</li>
						</ul>
					</div>

					{/* Social Media */}
					<div className='footer-column'>
						<h4>Follow Us</h4>
						<div className='footer-social'>
							<a
								href='https://www.instagram.com/finshelter/'
								target='_blank'
								rel='noopener noreferrer'>
								<i className='fa-brands fa-instagram fa-xl'></i>
							</a>
							<a
								href='https://www.facebook.com/profile.php?id=61575009025557'
								target='_blank'
								rel='noopener noreferrer'>
								<i className='fa-brands fa-facebook fa-xl'></i>
							</a>
							<a
								href='https://wa.me/919537601955'
								target='_blank'
								rel='noopener noreferrer'>
								<i className='fa-brands fa-whatsapp fa-xl'></i>
							</a>
							<a href='#' target='_blank' rel='noopener noreferrer'>
								<i className='fa-brands fa-linkedin fa-xl'></i>
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* Services Section */}
			<div className='footer-services'>
				<div className='container'>
					<div className='services-group'>
						<h4>Tax Filing</h4>
						<ul>
							{taxFiling.map((service, index) => (
								<li key={index}>
									<NavLink to={service.path}>{service.name}</NavLink>
								</li>
							))}
						</ul>
					</div>

					<div className='services-group'>
						<h4>Tax Planning</h4>
						<ul>
							{taxPlanning.map((service, index) => (
								<li key={index}>
									<NavLink to={service.path}>{service.name}</NavLink>
								</li>
							))}
						</ul>
					</div>

					<div className='services-group'>
						<h4>Registration</h4>
						<ul>
							{registrations.map((service, index) => (
								<li key={index}>
									<NavLink to={service.path}>{service.name}</NavLink>
								</li>
							))}
						</ul>
					</div>

					<div className='services-group'>
						<h4>Loans</h4>
						<ul>
							{loans.map((service, index) => (
								<li key={index}>
									<NavLink to={service.path}>{service.name}</NavLink>
								</li>
							))}
						</ul>
					</div>

					<div className='services-group'>
						<h4>Insurance</h4>
						<ul>
							{insurance.map((service, index) => (
								<li key={index}>
									<NavLink to={service.path}>{service.name}</NavLink>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			{/* Copyright Section */}
			<div className='footer-copyright'>
				<div className='container'>
					<p>
						&copy; {new Date().getFullYear()} FINSHELTER. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
