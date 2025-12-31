// import React, { useState } from "react";
// import "./section3.css";
// import TaxFlipbox from "../FlipboxSection/TaxFlipbox";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { useEffect } from "react";

// const Section3 = () => {
// 	useEffect(() => {
// 		window.scrollTo({ top: 0, behavior: "smooth" });
// 		// Initialize AOS with custom animations
// 		AOS.init({
// 			duration: 1000,
// 			once: false, // whether animation should happen only once - while scrolling down
// 			mirror: true, // whether elements should animate out while scrolling past them
// 		});
// 	}, []);

// 	// State to track which cards are expanded
// 	const [expandedCards, setExpandedCards] = useState({
// 		funding: false,
// 		mutualFunds: false,
// 		taxation: false,
// 		insurance: false
// 	});

// 	// Toggle function to expand/collapse card content
// 	const toggleCardExpansion = (cardId) => {
// 		setExpandedCards(prev => ({
// 			...prev,
// 			[cardId]: !prev[cardId]
// 		}));
// 	};

// 	return (
// 		<div id='tax-section3'>
// 			{/* <p className='p-tag2' data-aos='fade-down' data-aos-duration='800'>
// 				SERVICES
// 			</p> */}
// 			<h1 data-aos='fade-down' data-aos-duration='800'>
// 				Our Services
// 			</h1>
// 			<div className='tax-section3-wrap'>
// 				<div
// 					className='tax-section3-card card-left'
// 					data-aos='fade-up'
// 					data-aos-duration='800'
// 					data-aos-delay='100'
// 					data-aos-easing='ease-out-cubic'>
// 					<img src='./images/i2.jpg' alt='Funding services' />
// 					<div className='tax3-card-desc'>
// 						<h2>Funding</h2>
// 						<p className={expandedCards.funding ? 'expanded' : 'collapsed'}>
// 							FinShelter offers tailored loan solutions for personal and
// 							business needs. From personal loans and home financing to business
// 							and vehicle loans, we provide quick approvals, flexible terms, and
// 							competitive rates, ensuring a seamless borrowing experience with
// 							expert guidance at every step to meet your financial goals
// 						</p>
// 						<button 
// 							className="read-more-btn" 
// 							onClick={() => toggleCardExpansion('funding')}
// 						>
// 							{expandedCards.funding ? 'Read Less' : 'Read More'} <i className={`fa-solid fa-circle-arrow-${expandedCards.funding ? 'up' : 'right'} fa-xl`}></i>
// 						</button>
// 					</div>
// 				</div>
// 				<div
// 					className='tax-section3-card card-right'
// 					data-aos='fade-up'
// 					data-aos-duration='800'
// 					data-aos-delay='200'
// 					data-aos-easing='ease-out-cubic'>
// 					<img src='./images/i3.jpg' alt='Mutual Funds services' />
// 					<div className='tax3-card-desc'>
// 						<h2>Mutual Funds</h2>
// 						<p className={expandedCards.mutualFunds ? 'expanded' : 'collapsed'}>
// 							FinShelter provides expert mutual fund distribution services to
// 							achieve your financial goals. With personalized recommendations
// 							and access to diverse investment options, we ensure your funds are
// 							managed professionally with transparency, maximizing growth
// 							potential through strategic planning and reliable support tailored
// 							to your unique needs.
// 						</p>
// 						<button 
// 							className="read-more-btn" 
// 							onClick={() => toggleCardExpansion('mutualFunds')}
// 						>
// 							{expandedCards.mutualFunds ? 'Read Less' : 'Read More'} <i className={`fa-solid fa-circle-arrow-${expandedCards.mutualFunds ? 'up' : 'right'} fa-xl`}></i>
// 						</button>
// 					</div>
// 				</div>
// 				{/* </div> */}
// 				<div
// 					className='tax-section3-card card-left'
// 					data-aos='fade-up'
// 					data-aos-duration='800'
// 					data-aos-delay='300'
// 					data-aos-easing='ease-out-cubic'>
// 					<img src='./images/i4.jpg' alt='Taxation services' />
// 					<div className='tax3-card-desc'>
// 						<h2>Taxation</h2>
// 						<p className={expandedCards.taxation ? 'expanded' : 'collapsed'}>
// 							FinShelter offers reliable taxation solutions, including ITR
// 							filing, GST compliance, and ROC services. We simplify complex
// 							processes, ensure accuracy, and provide expert guidance for a
// 							hassle-free experience, helping you meet regulatory requirements
// 							with confidence and efficiency while supporting your financial and
// 							business objectives.
// 						</p>
// 						<button 
// 							className="read-more-btn" 
// 							onClick={() => toggleCardExpansion('taxation')}
// 						>
// 							{expandedCards.taxation ? 'Read Less' : 'Read More'} <i className={`fa-solid fa-circle-arrow-${expandedCards.taxation ? 'up' : 'right'} fa-xl`}></i>
// 						</button>
// 					</div>
// 				</div>
// 				<div
// 					className='tax-section3-card card-right'
// 					data-aos='fade-up'
// 					data-aos-duration='800'
// 					data-aos-delay='400'
// 					data-aos-easing='ease-out-cubic'>
// 					<img src='./images/i1.jpg' alt='Insurance services' />
// 					<div className='tax3-card-desc'>
// 						<h2>Insurance</h2>
// 						<p className={expandedCards.insurance ? 'expanded' : 'collapsed'}>
// 							FinShelter provides comprehensive insurance solutions to secure
// 							your future. From life and health to property and vehicle
// 							coverage, we offer trusted advice and tailored plans to protect
// 							what matters most, ensuring peace of mind with reliable,
// 							customized options designed for your personal and business needs.
// 						</p>
// 						<button 
// 							className="read-more-btn" 
// 							onClick={() => toggleCardExpansion('insurance')}
// 						>
// 							{expandedCards.insurance ? 'Read Less' : 'Read More'} <i className={`fa-solid fa-circle-arrow-${expandedCards.insurance ? 'up' : 'right'} fa-xl`}></i>
// 						</button>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Section3;

import React, { useState, useEffect } from "react";
import "./section3.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Section3 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });

		AOS.init({
			duration: 1000,
			once: false,
			mirror: true,
		});
	}, []);

	const [expandedCards, setExpandedCards] = useState({
		funding: false,
		mutualFunds: false,
		taxation: false,
		insurance: false,
	});

	const toggleCardExpansion = (cardId) => {
		setExpandedCards((prev) => ({
			...prev,
			[cardId]: !prev[cardId],
		}));
	};

	return (
		<div id='tax-section3'>
			<h1 data-aos='fade-down'>Our Services</h1>

			<div className='tax-section3-wrap'>
				
				{/* LEFT CARD */}
				<div
					className='tax-section3-card card-left'
					data-aos='slide-left'
				>
					<img src='./images/i2.jpg' alt='Funding services' />
					<div className='tax3-card-desc'>
						<h2>Funding</h2>
						<p className={expandedCards.funding ? "expanded" : "collapsed"}>
							FinShelter offers tailored loan solutions for personal and
							business needs. From personal loans and home financing to business
							and vehicle loans, we provide quick approvals, flexible terms, and
							competitive rates, ensuring a seamless borrowing experience with
							expert guidance every step of the way.
						</p>
						<button
							className='read-more-btn'
							onClick={() => toggleCardExpansion("funding")}
						>
							{expandedCards.funding ? "Read Less" : "Read More"}{" "}
							<i
								className={`fa-solid fa-circle-arrow-${
									expandedCards.funding ? "up" : "right"
								} fa-xl`}
							></i>
						</button>
					</div>
				</div>

				{/* RIGHT CARD */}
				<div
					className='tax-section3-card card-right'
					data-aos='slide-right'
				>
					<img src='./images/i3.jpg' alt='Mutual Funds services' />
					<div className='tax3-card-desc'>
						<h2>Mutual Funds</h2>
						<p className={expandedCards.mutualFunds ? "expanded" : "collapsed"}>
							FinShelter provides expert mutual fund distribution services with
							personalized recommendations and access to diverse investment
							options to help you grow wealth strategically and securely.
						</p>
						<button
							className='read-more-btn'
							onClick={() => toggleCardExpansion("mutualFunds")}
						>
							{expandedCards.mutualFunds ? "Read Less" : "Read More"}{" "}
							<i
								className={`fa-solid fa-circle-arrow-${
									expandedCards.mutualFunds ? "up" : "right"
								} fa-xl`}
							></i>
						</button>
					</div>
				</div>

				{/* LEFT CARD */}
				<div
					className='tax-section3-card card-left'
					data-aos='slide-left'
				>
					<img src='./images/i4.jpg' alt='Taxation services' />
					<div className='tax3-card-desc'>
						<h2>Taxation</h2>
						<p className={expandedCards.taxation ? "expanded" : "collapsed"}>
							FinShelter offers reliable taxation solutions including ITR filing,
							GST compliance, and ROC services, ensuring accuracy and
							hassle-free completion with expert support.
						</p>
						<button
							className='read-more-btn'
							onClick={() => toggleCardExpansion("taxation")}
						>
							{expandedCards.taxation ? "Read Less" : "Read More"}{" "}
							<i
								className={`fa-solid fa-circle-arrow-${
									expandedCards.taxation ? "up" : "right"
								} fa-xl`}
							></i>
						</button>
					</div>
				</div>

				{/* RIGHT CARD */}
				<div
					className='tax-section3-card card-right'
					data-aos='slide-right'
				>
					<img src='./images/i1.jpg' alt='Insurance services' />
					<div className='tax3-card-desc'>
						<h2>Insurance</h2>
						<p className={expandedCards.insurance ? "expanded" : "collapsed"}>
							FinShelter provides comprehensive insurance plans from life and
							health to vehicle and property coverage, ensuring complete
							protection customized to your needs.
						</p>
						<button
							className='read-more-btn'
							onClick={() => toggleCardExpansion("insurance")}
						>
							{expandedCards.insurance ? "Read Less" : "Read More"}{" "}
							<i
								className={`fa-solid fa-circle-arrow-${
									expandedCards.insurance ? "up" : "right"
								} fa-xl`}
							></i>
						</button>
					</div>
				</div>

			</div>
		</div>
	);
};

export default Section3;
