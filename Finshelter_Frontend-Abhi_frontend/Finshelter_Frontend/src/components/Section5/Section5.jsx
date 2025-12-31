import React, { useEffect, useRef, useState } from "react";
import "./section5.css";

const Section5 = () => {
	const [activeStep, setActiveStep] = useState(1);
	const [isMobile, setIsMobile] = useState(false);
	const timelineRef = useRef(null);
	const progressBarRef = useRef(null);
	const verticalProgressBarRef = useRef(null);
	const workflowStepsRefs = useRef([]);

	// Define workflow steps with two-line titles for visual consistency
	const workflowSteps = [
		{
			id: 1,
			icon: "fa-search",
			title: "Search & Select\nTax Options",
			description: "Browse through various tax-saving services and select the ones that match your needs.",
		},
		{
			id: 2,
			icon: "fa-clipboard-check",
			title: "Submit Your\nRequirements",
			description: "Fill out a quick form with your specific requirements and preferences.",
		},
		{
			id: 3,
			icon: "fa-comment-dots",
			title: "Expert\nConsultation",
			description: "Connect with our tax experts who'll analyze your profile and suggest the best strategy.",
		},
		{
			id: 4,
			icon: "fa-file-signature",
			title: "Document\nSubmission",
			description: "Securely upload the necessary documents for your selected tax service.",
		},
		{
			id: 5,
			icon: "fa-check-circle",
			title: "Review &\nConfirm",
			description: "Review the proposed tax strategy and confirm to proceed with implementation.",
		},
		{
			id: 6,
			icon: "fa-award",
			title: "Tax Benefit\nDelivered",
			description: "Receive your completed tax planning service with maximum savings achieved.",
		},
	];

	useEffect(() => {
		// Check if screen is mobile size
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		
		// Initial check
		checkMobile();
		
		// Add resize listener
		window.addEventListener('resize', checkMobile);
		
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	useEffect(() => {
		if (!timelineRef.current) return;
		
		// Initialize Intersection Observer to trigger animations when section is in view
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					// Activate all steps immediately
					activateAllSteps();
					
					// Then update the progress bar based on device
					if (progressBarRef.current) {
						progressBarRef.current.style.width = '100%';
					}
					
					// Remove observer after animation is triggered
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);

		observer.observe(timelineRef.current);

		// Auto advance active step effect
		const interval = setInterval(() => {
			setActiveStep((prev) => (prev % workflowSteps.length) + 1);
		}, 3000);

		return () => {
			clearInterval(interval);
			observer.disconnect();
		};
	}, []);

	// Function to activate all steps immediately
	const activateAllSteps = () => {
		workflowStepsRefs.current.forEach(step => {
			if (step) {
				step.classList.add('active');
			}
		});
	};

	return (
		<section id="tax-section5">
			<div className="workflow-container" ref={timelineRef}>
				{/* Decorative background elements */}
				<div className="workflow-background-elements">
					<div className="workflow-shape shape-1"></div>
					<div className="workflow-shape shape-2"></div>
					<div className="workflow-shape shape-3"></div>
					<div className="workflow-shape shape-4"></div>
				</div>

				<div className="workflow-header">
					<h2 className="workflow-title">Our Simple Tax Process</h2>
					<div className="title-decoration">
						<span></span>
						<span></span>
						<span></span>
					</div>
					<p className="workflow-subtitle">
						Follow our straightforward workflow to maximize your tax savings with minimum effort
					</p>
				</div>

				<div className="workflow-timeline-container">
					{/* Overall progress bar - horizontal */}
					<div className="workflow-progress-bar">
						<div className="workflow-progress-fill" ref={progressBarRef}></div>
					</div>
					
					<div className="workflow-timeline">
						{workflowSteps.map((step, index) => (
							<div 
								key={step.id}
								ref={el => workflowStepsRefs.current[index] = el}
								className={`workflow-step ${step.id === activeStep ? 'current' : ''} active`}
							>
								<div className="workflow-node-container">
									<div className="workflow-node-outer">
										<div className="node-halo"></div>
										<div className="node-pulse"></div>
										<div className="workflow-node">
											<div className="node-ripple"></div>
											<i className={`fa-solid ${step.icon.replace('fas ', '')}`}></i>
										</div>
									</div>
									
									<div className="step-number">{step.id}</div>
									
									{/* Connection line - don't show for last item */}
									{index < workflowSteps.length - 1 && (
										<div className="workflow-line">
											<div className="workflow-line-progress"></div>
											<div className="workflow-line-particles">
												<span style={{ animationDelay: '0s' }}></span>
												<span style={{ animationDelay: '1s' }}></span>
												<span style={{ animationDelay: '2s' }}></span>
											</div>
										</div>
									)}
								</div>
								
								<div className="workflow-content">
									<h3>{step.title.split('\n').map((line, i) => (
										<React.Fragment key={i}>
											{line}
											{i === 0 && <br />}
										</React.Fragment>
									))}</h3>
									<p>{step.description}</p>
								</div>
								
								<div className="workflow-shadow"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section5;
