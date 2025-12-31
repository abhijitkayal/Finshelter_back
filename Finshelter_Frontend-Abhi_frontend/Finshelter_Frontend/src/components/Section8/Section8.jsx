import React from "react";
import "./section8.css";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const Section8 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);

	// Form state
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});

	// Form status states
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState({
		success: false,
		message: "",
	});

	// Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// Form validation
	const validateForm = () => {
		if (!formData.name.trim()) {
			setSubmitStatus({
				success: false,
				message: "Please enter your name.",
			});
			return false;
		}
		if (
			!formData.email.trim() ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
		) {
			setSubmitStatus({
				success: false,
				message: "Please enter a valid email address.",
			});
			return false;
		}
		if (
			!formData.phone.trim() ||
			!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))
		) {
			setSubmitStatus({
				success: false,
				message: "Please enter a valid 10-digit phone number.",
			});
			return false;
		}
		if (!formData.subject.trim()) {
			setSubmitStatus({
				success: false,
				message: "Please enter a subject.",
			});
			return false;
		}
		if (!formData.message.trim()) {
			setSubmitStatus({
				success: false,
				message: "Please enter your message.",
			});
			return false;
		}
		return true;
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Reset status
		setSubmitStatus({ success: false, message: "" });

		// Validate form
		if (!validateForm()) return;

		setIsSubmitting(true);

		try {
			// Send form data to backend
			const response = await axios.post(
				"http://localhost:8000/api/contact",
				formData
			);

			// Show success message
			setSubmitStatus({
				success: true,
				message: "Thank you! Your message has been sent successfully.",
			});

			// Reset form
			setFormData({
				name: "",
				email: "",
				phone: "",
				subject: "",
				message: "",
			});
		} catch (error) {
			// Show error message
			setSubmitStatus({
				success: false,
				message:
					error.response?.data?.message ||
					"Something went wrong. Please try again later.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='tax-section8'>
			<div className='tax-section8-wrap'>
				<div
					className='tax-section8-right2'
					data-aos='fade-up'
					data-aos-duration='800'>
					<form onSubmit={handleSubmit}>
						{submitStatus.message && (
							<div
								className={`form-message ${
									submitStatus.success ? "success" : "error"
								}`}>
								{submitStatus.message}
							</div>
						)}

						<input
							type='text'
							name='name'
							placeholder='Name'
							value={formData.name}
							onChange={handleInputChange}
							required
						/>
						<div className='fdiv'>
							<input
								type='email'
								name='email'
								placeholder='Email'
								value={formData.email}
								onChange={handleInputChange}
								required
							/>
							<input
								type='text'
								name='phone'
								placeholder='Phone No'
								value={formData.phone}
								onChange={handleInputChange}
								required
							/>
						</div>

						<input
							type='text'
							name='subject'
							placeholder='Subject'
							value={formData.subject}
							onChange={handleInputChange}
							required
						/>

						<textarea
							name='message'
							placeholder='Message'
							value={formData.message}
							onChange={handleInputChange}
							required></textarea>

						<button type='submit' className='tax5-btn' disabled={isSubmitting}>
							{isSubmitting ? "Submitting..." : "Submit Now"}
							{!isSubmitting && <i className='fa-solid fa-arrow-right'></i>}
						</button>
					</form>
				</div>
				<div className='tax-section8-left'>
					<h1 data-aos='fade-right' data-aos-duration='800'>
						Schedule <span>Consultation</span> With Our Team
					</h1>
					<p>
						Take the first step toward achieving your financial goals with ease.
						At FinShelter, our team of experienced professionals is here to
						provide personalized guidance tailored to your needs. Schedule a
						consultation today and let us help you simplify your finances,
						secure your future, and make informed decisions with confidence.
					</p>

					<div className='tax-8list-con'>
						<ul>
							<li>
								<i className='fa-solid fa-phone fa-xl'></i>
								<div className='tax-8-icontext'>
									<h3>Phone</h3>
									<p>+91 95376 01955</p>
								</div>
							</li>
						</ul>
						<ul>
							<li>
								<i className='fa-solid fa-envelope fa-xl'></i>
								<div className='tax-8-icontext'>
									<h3>Email</h3>
									<p>Info@thefinshelter.com</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section8;
